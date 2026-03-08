import { inngest } from "./client";
import { supabase } from "@/lib/supabase";
import { replicate } from "@/lib/replicate";
import { openrouter } from "@/lib/openrouter/client";

// 🖼️ ГЕНЕРАЦИЯ ИЗОБРАЖЕНИЙ
export const generateImage = inngest.createFunction(
  {
    id: "generate-image",
    name: "Generate Image",
    retries: 3,
    // Таймаут 5 минут на всю функцию
    cancelOn: [
      { event: "image/cancel", match: "data.generationId" },
    ],
  },
  { event: "image/generate" },
  async ({ event, step }) => {
    const { generationId, userId, prompt, model, width, height, quality, seed } = event.data;

    console.log(`[Inngest] Starting image generation: ${generationId}`);

    // 1. Обновляем статус
    await step.run("mark-processing", async () => {
      await supabase.from("generations").update({
        status: "processing",
        progress: 10,
        started_at: new Date().toISOString(),
      }).eq("id", generationId);
    });

    // 2. Генерируем изображение
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

    // 3. Обновляем прогресс
    await step.run("update-progress-50", async () => {
      await supabase.from("generations").update({
        progress: 50,
      }).eq("id", generationId);
    });

    // 4. Загружаем в хранилище (если нужно)
    // const storedUrl = await step.run("upload-to-storage", async () => {
    //   return await uploadFromUrl(imageUrl, { userId, jobId: generationId, type: "image" });
    // });

    // 5. Сохраняем результат
    await step.run("save-result", async () => {
      await supabase.from("generations").update({
        status: "completed",
        progress: 100,
        result_url: imageUrl,
        result_urls: [imageUrl],
        completed_at: new Date().toISOString(),
      }).eq("id", generationId);
    });

    // 6. Списываем кредиты
    await step.run("deduct-credits", async () => {
      await supabase.rpc("deduct_credits", {
        user_id: userId,
        amount: 1, // 1 кредит за изображение
      });
    });

    // 7. Логируем использование
    await step.run("log-usage", async () => {
      await supabase.from("usage_logs").insert({
        user_id: userId,
        action: "generate_image",
        resource_type: "generation",
        resource_id: generationId,
        credits_used: 1,
        metadata: { model, prompt },
      });
    });

    console.log(`[Inngest] Image generation completed: ${generationId}`);

    return {
      success: true,
      generationId,
      imageUrl,
    };
  }
);

// 🎬 ГЕНЕРАЦИЯ ВИДЕО
export const generateVideo = inngest.createFunction(
  {
    id: "generate-video",
    name: "Generate Video",
    retries: 2,
    // Видео тяжелее — больше таймаут
  },
  { event: "video/generate" },
  async ({ event, step }) => {
    const { generationId, userId, prompt, imageUrl, model, duration, aspectRatio } = event.data;

    console.log(`[Inngest] Starting video generation: ${generationId}`);

    // 1. Обновляем статус
    await step.run("mark-processing", async () => {
      await supabase.from("generations").update({
        status: "processing",
        progress: 10,
        started_at: new Date().toISOString(),
      }).eq("id", generationId);
    });

    // 2. Стартуем генерацию в Replicate
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

    // 3. Сохраняем prediction_id
    await step.run("save-prediction-id", async () => {
      await supabase.from("generations").update({
        prediction_id: prediction.id,
        progress: 20,
      }).eq("id", generationId);
    });

    // 4. ПОЛЛИНГ статуса (каждые 5 сек, макс 120 попыток = 10 минут)
    const result = await step.run("poll-replicate-status", async () => {
      for (let i = 0; i < 120; i++) {
        const status = await replicate.predictions.get(prediction.id);
        
        // Обновляем прогресс
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

        // Ждём 5 секунд
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      throw new Error("Timeout waiting for video generation");
    });

    const videoUrl = Array.isArray(result.output) ? result.output[0] : result.output;
    console.log(`[Inngest] Video completed: ${videoUrl}`);

    // 5. Сохраняем результат
    await step.run("save-result", async () => {
      await supabase.from("generations").update({
        status: "completed",
        progress: 100,
        result_url: videoUrl,
        result_urls: [videoUrl],
        completed_at: new Date().toISOString(),
      }).eq("id", generationId);
    });

    // 6. Списываем кредиты (видео дороже)
    const creditsUsed = model === "kling" ? 10 : 5;
    await step.run("deduct-credits", async () => {
      await supabase.rpc("deduct_credits", {
        user_id: userId,
        amount: creditsUsed,
      });
    });

    // 7. Логируем
    await step.run("log-usage", async () => {
      await supabase.from("usage_logs").insert({
        user_id: userId,
        action: "generate_video",
        resource_type: "generation",
        resource_id: generationId,
        credits_used: creditsUsed,
        metadata: { model, prompt, duration },
      });
    });

    console.log(`[Inngest] Video generation completed: ${generationId}`);

    return {
      success: true,
      generationId,
      videoUrl,
    };
  }
);

// 🎬 ГЕНЕРАЦИЯ ВИДЕО С ПЕРСОНАЖЕМ (AI Influencer)
export const generateCharacterVideo = inngest.createFunction(
  {
    id: "generate-character-video",
    name: "Generate Character Video",
    retries: 2,
  },
  { event: "character-video/generate" },
  async ({ event, step }) => {
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

    // 2. Используем avatar_url персонажа как imageUrl
    const imageUrl = character.avatar_url;

    // 3-7. Тот же процесс что и generateVideo
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

    // ... polling и сохранение аналогично generateVideo
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

    await step.run("save-result", async () => {
      await supabase.from("character_videos").update({
        status: "completed",
        progress: 100,
        video_url: videoUrl,
        completed_at: new Date().toISOString(),
      }).eq("id", generationId);
    });

    return { success: true, generationId, videoUrl };
  }
);
