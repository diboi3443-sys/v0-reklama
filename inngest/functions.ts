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
    try {
      console.log("🔥🔥🔥 INNGEST FUNCTION STARTED! 🔥🔥🔥");
      console.log("Event name:", event.name);
      console.log("Event data:", JSON.stringify(event.data));
      
      console.log("Getting Supabase client...");
      const supabase = getSupabase();
      console.log("Supabase client OK");
      
      const startTime = Date.now();
      const { generationId, userId, prompt, model, width, height, quality, seed, cost } = event.data;

      console.log(`[Inngest] Starting image generation: ${generationId} for user: ${userId}`);

      // 1. Создаём запись в jobs
      console.log("Step 1: Creating job record...");
      await step.run("create-job-record", async () => {
        const { error } = await supabase.from("jobs").insert({
          bull_job_id: generationId,
          generation_id: generationId,
          queue_name: "image-generation",
          status: "waiting",
          data: { prompt, model },
        });
        if (error) console.error("Job insert error:", error);
      });
      console.log("Step 1: OK");

      // 2. Обновляем статус
      console.log("Step 2: Marking processing...");
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
      console.log("Step 2: OK");

      // 3. Генерируем изображение
      console.log("Step 3: Generating image with OpenRouter...");
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
      console.log(`Step 3: OK, image URL: ${imageUrl}`);

      // 4. Обновляем прогресс
      console.log("Step 4: Updating progress...");
      await step.run("update-progress-50", async () => {
        await supabase.from("generations").update({
          progress: 50,
        }).eq("id", generationId);
      });
      console.log("Step 4: OK");

      // 5. Загружаем в хранилище
      console.log("Step 5: Uploading to storage...");
      const storedUrl = await step.run("upload-to-storage", async () => {
        return await uploadFromUrl(imageUrl, { userId, jobId: generationId, type: "image" });
      });
      console.log(`Step 5: OK, stored URL: ${storedUrl}`);

      // 6. Сохраняем результат
      console.log("Step 6: Saving result...");
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
      console.log("Step 6: OK");

      // 7. Списываем кредиты
      console.log("Step 7: Deducting credits...");
      await step.run("deduct-credits", async () => {
        await supabase.rpc("deduct_credits", {
          user_id: userId,
          amount: cost || 1,
        });
      });
      console.log("Step 7: OK");

      // 8. Логируем использование
      console.log("Step 8: Logging usage...");
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
      console.log("Step 8: OK");

      console.log(`✅✅✅ COMPLETED! Generation: ${generationId} in ${processingTime}ms`);

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

// 🎬 ГЕНЕРАЦИЯ ВИДЕО
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
