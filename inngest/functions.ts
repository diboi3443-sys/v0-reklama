import { inngest } from "./client";
import { getSupabase } from "@/lib/supabase";
import { replicate } from "@/lib/openrouter/replicate";
import { uploadFromUrl } from "@/lib/storage";

// 🖼️ ГЕНЕРАЦИЯ ИЗОБРАЖЕНИЙ через Replicate (быстрее и надёжнее)
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
    try {
      console.log("🔥🔥🔥 INNGEST FUNCTION STARTED! 🔥🔥🔥");
      console.log("Event name:", event.name);
      
      const supabase = getSupabase();
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

      // 3. Генерируем изображение через Replicate (FLUX)
      console.log("Step 3: Generating image with Replicate FLUX...");
      
      const prediction = await step.run("generate-with-replicate", async () => {
        return await replicate.predictions.create({
          version: "black-forest-labs/flux-schnell", // Быстрый FLUX
          input: {
            prompt: prompt,
            width: width || 1024,
            height: height || 1024,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "webp",
            output_quality: quality || 80,
            seed: seed || Math.floor(Math.random() * 1000000),
          },
        });
      });

      console.log(`Prediction started: ${prediction.id}`);

      // 4. ПОЛЛИНГ результата (ждём генерацию)
      console.log("Step 4: Polling for result...");
      const result = await step.run("poll-replicate-status", async () => {
        for (let i = 0; i < 60; i++) { // Макс 5 минут
          const status = await replicate.predictions.get(prediction.id);
          
          console.log(`Poll ${i}: status=${status.status}`);
          
          if (status.status === "succeeded") {
            return status;
          }
          
          if (status.status === "failed") {
            throw new Error(`Replicate failed: ${status.error}`);
          }

          // Ждём 5 секунд
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        throw new Error("Timeout waiting for image generation");
      });

      const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
      console.log(`Image generated: ${imageUrl}`);

      // 5. Обновляем прогресс
      await step.run("update-progress-50", async () => {
        await supabase.from("generations").update({
          progress: 50,
        }).eq("id", generationId);
      });

      // 6. Используем URL напрямую (без загрузки в storage)
      console.log("Step 6: Using Replicate URL directly...");
      const storedUrl = imageUrl;
      console.log(`URL: ${storedUrl}`);

      // 7. Сохраняем результат
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

      // 8. Списываем кредиты
      await step.run("deduct-credits", async () => {
        await supabase.rpc("deduct_credits", {
          user_id: userId,
          amount: cost || 1,
        });
      });

      // 9. Логируем
      await step.run("log-usage", async () => {
        await supabase.from("usage_logs").insert({
          user_id: userId,
          action: "generate_image",
          resource_type: "generation",
          resource_id: generationId,
          credits_used: cost || 1,
          metadata: { model: "flux-schnell", prompt },
        });
      });

      console.log(`✅ COMPLETED! Generation: ${generationId}`);

      return {
        success: true,
        generationId,
        imageUrl: storedUrl,
        processingTime,
      };
    } catch (error: any) {
      console.error("❌❌❌ INNGEST FUNCTION ERROR ❌❌❌");
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      throw error;
    }
  }
);

// 🎬 ГЕНЕРАЦИЯ ВИДЕО (остаётся через Replicate)
export const generateVideo = inngest.createFunction(
  {
    id: "generate-video",
    name: "Generate Video",
    retries: 2,
  },
  { event: "video/generate" },
  async ({ event, step }) => {
    const supabase = getSupabase();
    const startTime = Date.now();
    const { generationId, userId, prompt, imageUrl, model, duration, aspectRatio, cost } = event.data;

    console.log(`[Inngest] Starting video generation: ${generationId}`);

    await step.run("mark-processing", async () => {
      await supabase.from("generations").update({
        status: "processing",
        progress: 10,
        started_at: new Date().toISOString(),
      }).eq("id", generationId);
    });

    const prediction = await step.run("start-replicate", async () => {
      return await replicate.predictions.create({
        version: "kwaivgi/kling-v3-motion-control",
        input: {
          prompt: prompt || "animate this",
          num_frames: (duration || 5) * 16,
          aspect_ratio: aspectRatio || "16:9",
          image: imageUrl,
        },
      });
    });

    await step.run("save-prediction-id", async () => {
      await supabase.from("generations").update({
        prediction_id: prediction.id,
        progress: 20,
      }).eq("id", generationId);
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
      await supabase.from("generations").update({
        status: "completed",
        progress: 100,
        result_url: videoUrl,
        result_urls: [videoUrl],
        completed_at: new Date().toISOString(),
        processing_time_ms: processingTime,
      }).eq("id", generationId);
    });

    await step.run("deduct-credits", async () => {
      await supabase.rpc("deduct_credits", {
        user_id: userId,
        amount: cost || 5,
      });
    });

    return { success: true, generationId, videoUrl, processingTime };
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
    const supabase = getSupabase();
    const startTime = Date.now();
    const { generationId, userId, characterId, prompt, model, duration, aspectRatio } = event.data;

    const character = await step.run("get-character", async () => {
      const { data } = await supabase.from("characters")
        .select("*")
        .eq("id", characterId)
        .single();
      return data;
    });

    if (!character) throw new Error("Character not found");

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
          image: character.avatar_url,
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

    await step.run("save-result", async () => {
      await supabase.from("character_videos").update({
        status: "completed",
        progress: 100,
        video_url: videoUrl,
        completed_at: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime,
      }).eq("id", generationId);
    });

    return { success: true, generationId, videoUrl };
  }
);
