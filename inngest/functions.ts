import { inngest } from "./client";
import { getSupabase } from "@/lib/supabase";
import { replicate } from "@/lib/openrouter/replicate";
import { openrouter } from "@/lib/openrouter/client";
import { uploadFromUrl } from "@/lib/storage";

// 🖼️ ГЕНЕРАЦИЯ ИЗОБРАЖЕНИЙ
export const generateImage = inngest.createFunction(
  {
    id: "generate-image",
    name: "Generate Image",
    retries: 3,
    cancelOn: [
      { event: "image/cancel", match: "data.generationId" },
    ],
  },
  { event: "image/generate" },
  async ({ event, step }) => {
    const supabase = getSupabase(); // <-- ВНУТРИ функции!
    const startTime = Date.now();
    const { generationId, userId, prompt, model, width, height, quality, seed, cost } = event.data;

    console.log(`[Inngest] Starting image generation: ${generationId}`);

    // 1. Создаём запись в jobs
    await step.run("create-job-record", async () => {
      await supabase.from("jobs").insert({
        bull_job_id: generationId,
        generation_id: generationId,
        queue_name: "image-generation",
        status: "waiting",
        data: { prompt, model },
      });
    });

    // 2. Обновляем статус
    await step.run("mark-processing", async () => {
      await supabase.from("generations").update({
        status: "processing",
        progress: 10,
        started_at: new Date().toISOString(),
      }).eq("id", generationId);

      await supabase.from("jobs").update({
        status: "active",
        started_at: new Date().toISOString(),
      }).eq("generation_id", generationId);
    });

    // 3. Генерируем изображение
    const imageUrl = await step.run("generate-with-openrouter", async () => {
      return await openrouter.generateImage({
        prompt,
        model: model || "black-forest-labs/flux-pro",
        width: width || 1024,
        height: height || 1024,
        steps: (quality || 8) * 4,
        seed,
      });
    });

    console.log(`[Inngest] Image generated: ${imageUrl}`);

    // 4. Обновляем прогресс
    await step.run("update-progress-50", async () => {
      await supabase.from("generations").update({
        progress: 50,
      }).eq("id", generationId);
    });

    // 5. Загружаем в хранилище
    const storedUrl = await step.run("upload-to-storage", async () => {
      return await uploadFromUrl(imageUrl, { userId, jobId: generationId, type: "image" });
    });

    console.log(`[Inngest] Image stored: ${storedUrl}`);

    // 6. Сохраняем результат
    const processingTime = Date.now() - startTime;
    await step.run("save-result", async () => {
      await supabase.from("generations").update({
        status: "completed",
        progress: 100,
        result_url: storedUrl,
        result_urls: [storedUrl],
        completed_at: new Date().toISOString(),
        processing_time_ms: processingTime,
      }).eq("id", generationId);

      await supabase.from("jobs").update({
        status: "completed",
        result: { url: storedUrl },
        completed_at: new Date().toISOString(),
      }).eq("generation_id", generationId);
    });

    // 7. Списываем кредиты
    await step.run("deduct-credits", async () => {
      await supabase.rpc("deduct_credits", {
        user_id: userId,
        amount: cost || 1,
      });
    });

    // 8. Логируем использование
    await step.run("log-usage", async () => {
      await supabase.from("usage_logs").insert({
        user_id: userId,
        action: "generate_image",
        resource_type: "generation",
        resource_id: generationId,
        credits_used: cost || 1,
        metadata: { model, prompt },
      });
    });

    console.log(`[Inngest] Image generation completed: ${generationId} in ${processingTime}ms`);

    return {
      success: true,
      generationId,
      imageUrl: storedUrl,
      processingTime,
    };
  }
);

// 🎬 ГЕНЕРАЦИЯ ВИДЕО
export const generateVideo = inngest.createFunction(
  {
    id: "generate-video",
    name: "Generate Video",
    retries: 2,
  },
  { event: "video/generate" },
  async ({ event, step }) => {
    const supabase = getSupabase(); // <-- ВНУТРИ функции!
    const startTime = Date.now();
    const { generationId, userId, prompt, imageUrl, model, duration, aspectRatio, cost } = event.data;

    console.log(`[Inngest] Starting video generation: ${generationId}`);

    // 1. Создаём запись в jobs
    await step.run("create-job-record", async () => {
      await supabase.from("jobs").insert({
        bull_job_id: generationId,
        generation_id: generationId,
        queue_name: "video-generation",
        status: "waiting",
        data: { prompt, model },
      });
    });

    // 2. Обновляем статус
    await step.run("mark-processing", async () => {
      await supabase.from("generations").update({
        status: "processing",
        progress: 10,
        started_at: new Date().toISOString(),
      }).eq("id", generationId);

      await supabase.from("jobs").update({
        status: "active",
        started_at: new Date().toISOString(),
      }).eq("generation_id", generationId);
    });

    // 3. Стартуем генерацию в Replicate
    const prediction = await step.run("start-replicate", async () => {
      const replicateModel = model === "kling" ? "kwaivgi/kling-v3-motion-control" :
                             model === "ltx" ? "lightricks/ltx-2.3-pro" :
                             "kwaivgi/kling-v3-motion-control";

      const input: any = {
        prompt: prompt || "animate this",
        num_frames: (duration || 5) * 16,
        aspect_ratio: aspectRatio || "16:9",
      };

      if (imageUrl) {
        input.image = imageUrl;
      }

      return await replicate.predictions.create({
        version: replicateModel,
        input,
      });
    });

    console.log(`[Inngest] Replicate prediction started: ${prediction.id}`);

    // 4. Сохраняем prediction_id
    await step.run("save-prediction-id", async () => {
      await supabase.from("generations").update({
        prediction_id: prediction.id,
        progress: 20,
      }).eq("id", generationId);
    });

    // 5. ПОЛЛИНГ статуса
    const result = await step.run("poll-replicate-status", async () => {
      for (let i = 0; i < 120; i++) {
        const status = await replicate.predictions.get(prediction.id);
        
        const progress = status.status === "starting" ? 30 :
                         status.status === "processing" ? 60 : 0;
        
        if (progress > 0) {
          await supabase.from("generations").update({
            progress,
          }).eq("id", generationId);
        }

        if (status.status === "succeeded") {
          return status;
        }
        
        if (status.status === "failed") {
          throw new Error(`Replicate failed: ${status.error}`);
        }

        if (status.status === "canceled") {
          throw new Error("Generation was canceled");
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      throw new Error("Timeout waiting for video generation");
    });

    const videoUrl = Array.isArray(result.output) ? result.output[0] : result.output;
    console.log(`[Inngest] Video completed: ${videoUrl}`);

    // 6. Сохраняем результат
    const processingTime = Date.now() - startTime;
    await step.run("save-result", async () => {
      await supabase.from("generations").update({
        status: "completed",
        progress: 100,
        result_url: videoUrl,
        result_urls: [videoUrl],
        completed_at: new Date().toISOString(),
        processing_time_ms: processingTime,
      }).eq("id", generationId);

      await supabase.from("jobs").update({
        status: "completed",
        result: { url: videoUrl },
        completed_at: new Date().toISOString(),
      }).eq("generation_id", generationId);
    });

    // 7. Списываем кредиты
    await step.run("deduct-credits", async () => {
      await supabase.rpc("deduct_credits", {
        user_id: userId,
        amount: cost || 5,
      });
    });

    // 8. Логируем
    await step.run("log-usage", async () => {
      await supabase.from("usage_logs").insert({
        user_id: userId,
        action: "generate_video",
        resource_type: "generation",
        resource_id: generationId,
        credits_used: cost || 5,
        metadata: { model, prompt, duration },
      });
    });

    console.log(`[Inngest] Video generation completed: ${generationId} in ${processingTime}ms`);

    return {
      success: true,
      generationId,
      videoUrl,
      processingTime,
    };
  }
);

// 🎬 ГЕНЕРАЦИЯ ВИДЕО С ПЕРСОНАЖЕМ
export const generateCharacterVideo = inngest.createFunction(
  {
    id: "generate-character-video",
    name: "Generate Character Video",
    retries: 2,
  },
  { event: "character-video/generate" },
  async ({ event, step }) => {
    const supabase = getSupabase(); // <-- ВНУТРИ функции!
    const startTime = Date.now();
    const { generationId, userId, characterId, prompt, model, duration, aspectRatio } = event.data;

    // 1. Получаем персонажа
    const character = await step.run("get-character", async () => {
      const { data } = await supabase.from("characters")
        .select("*")
        .eq("id", characterId)
        .single();
      return data;
    });

    if (!character) {
      throw new Error("Character not found");
    }

    const imageUrl = character.avatar_url;

    // 2-8. Тот же процесс что и generateVideo
    await step.run("mark-processing", async () => {
      await supabase.from("character_videos").update({
        status: "processing",
        progress: 10,
        started_at: new Date().toISOString(),
      }).eq("id", generationId);
    });

    const prediction = await step.run("start-replicate", async () => {
      return await replicate.predictions.create({
        version: "kwaivgi/kling-v3-motion-control",
        input: {
          image: imageUrl,
          prompt: prompt || "person talking naturally",
          num_frames: (duration || 5) * 16,
          aspect_ratio: aspectRatio || "16:9",
        },
      });
    });

    const result = await step.run("poll-replicate-status", async () => {
      for (let i = 0; i < 120; i++) {
        const status = await replicate.predictions.get(prediction.id);
        if (status.status === "succeeded") return status;
        if (status.status === "failed") throw new Error(status.error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      throw new Error("Timeout");
    });

    const videoUrl = Array.isArray(result.output) ? result.output[0] : result.output;
    const processingTime = Date.now() - startTime;

    await step.run("save-result", async () => {
      await supabase.from("character_videos").update({
        status: "completed",
        progress: 100,
        video_url: videoUrl,
        completed_at: new Date().toISOString(),
        processing_time_ms: processingTime,
      }).eq("id", generationId);
    });

    return { success: true, generationId, videoUrl, processingTime };
  }
);
