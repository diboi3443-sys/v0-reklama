import { inngest } from "./client";
import { getSupabase } from "@/lib/supabase";
import { replicate } from "@/lib/openrouter/replicate";

// 🖼️ ГЕНЕРАЦИЯ ИЗОБРАЖЕНИЙ через Replicate
export const generateImage = inngest.createFunction(
  {
    id: "generate-image",
    name: "Generate Image",
    retries: 3,
  },
  { event: "image/generate" },
  async ({ event, step }) => {
    console.log("🔥 INNGEST STARTED! Event:", JSON.stringify(event.data));
    
    const supabase = getSupabase();
    const { generationId, userId, prompt, width, height, quality, seed, cost } = event.data;

    try {
      // 1. Обновляем статус
      console.log("Step 1: Updating status to processing...");
      await supabase.from("generations").update({
        status: "processing",
        progress: 10,
        started_at: new Date().toISOString(),
      }).eq("id", generationId);
      console.log("✅ Status updated");

      // 2. Генерируем через Replicate
      console.log("Step 2: Creating prediction...");
      const prediction = await replicate.predictions.create({
        version: "black-forest-labs/flux-schnell",
        input: {
          prompt,
          width: width || 1024,
          height: height || 1024,
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: quality || 80,
          seed: seed || Math.floor(Math.random() * 1000000),
        },
      });
      console.log("✅ Prediction created:", prediction.id);

      // 3. Ждём результат
      console.log("Step 3: Waiting for result...");
      let result;
      for (let i = 0; i < 60; i++) {
        const status = await replicate.predictions.get(prediction.id);
        console.log(`Poll ${i}: ${status.status}`);
        
        if (status.status === "succeeded") {
          result = status;
          break;
        }
        if (status.status === "failed") {
          throw new Error(status.error);
        }
        await new Promise(r => setTimeout(r, 3000));
      }
      
      if (!result) throw new Error("Timeout");
      
      const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;
      console.log("✅ Image ready:", imageUrl);

      // 4. СОХРАНЯЕМ РЕЗУЛЬТАТ (прямой вызов)
      console.log("Step 4: Saving to database...");
      const startTime = Date.now();
      
      const updateData = {
        status: "completed",
        progress: 100,
        result_url: imageUrl,
        result_urls: [imageUrl],
        completed_at: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime,
      };
      
      console.log("Update data:", JSON.stringify(updateData));
      console.log("Generation ID:", generationId);
      
      const { data, error } = await supabase
        .from("generations")
        .update(updateData)
        .eq("id", generationId)
        .select();
      
      if (error) {
        console.error("❌ DATABASE ERROR:", error.message, error.details, error.hint);
        throw error;
      }
      
      console.log("✅ Database updated:", JSON.stringify(data));

      // 5. Списываем кредиты
      console.log("Step 5: Deducting credits...");
      await supabase.rpc("deduct_credits", {
        user_id: userId,
        amount: cost || 1,
      });
      console.log("✅ Credits deducted");

      console.log("🎉 COMPLETED!");
      return { success: true, imageUrl };
      
    } catch (error: any) {
      console.error("❌ FUNCTION ERROR:", error.message, error.stack);
      
      // Сохраняем ошибку
      await supabase.from("generations").update({
        status: "failed",
        error_message: error.message,
      }).eq("id", generationId);
      
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
    const { generationId, userId, prompt, imageUrl, model, duration, aspectRatio, cost } = event.data;

    await supabase.from("generations").update({
      status: "processing",
      started_at: new Date().toISOString(),
    }).eq("id", generationId);

    const prediction = await replicate.predictions.create({
      version: "kwaivgi/kling-v3-motion-control",
      input: {
        prompt,
        num_frames: (duration || 5) * 16,
        aspect_ratio: aspectRatio || "16:9",
        image: imageUrl,
      },
    });

    let result;
    for (let i = 0; i < 120; i++) {
      const status = await replicate.predictions.get(prediction.id);
      if (status.status === "succeeded") { result = status; break; }
      if (status.status === "failed") throw new Error(status.error);
      await new Promise(r => setTimeout(r, 5000));
    }

    const videoUrl = Array.isArray(result!.output) ? result!.output[0] : result!.output;

    await supabase.from("generations").update({
      status: "completed",
      result_url: videoUrl,
      completed_at: new Date().toISOString(),
    }).eq("id", generationId);

    await supabase.rpc("deduct_credits", { user_id: userId, amount: cost || 5 });

    return { success: true, videoUrl };
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
    const { generationId, userId, characterId, prompt, duration, aspectRatio } = event.data;

    const { data: character } = await supabase.from("characters")
      .select("*")
      .eq("id", characterId)
      .single();

    if (!character) throw new Error("Character not found");

    await supabase.from("character_videos").update({
      status: "processing",
    }).eq("id", generationId);

    const prediction = await replicate.predictions.create({
      version: "kwaivgi/kling-v3-motion-control",
      input: {
        image: character.avatar_url,
        prompt: prompt || "person talking",
        num_frames: (duration || 5) * 16,
        aspect_ratio: aspectRatio || "16:9",
      },
    });

    let result;
    for (let i = 0; i < 120; i++) {
      const status = await replicate.predictions.get(prediction.id);
      if (status.status === "succeeded") return status;
      if (status.status === "failed") throw new Error(status.error);
      await new Promise(r => setTimeout(r, 5000));
    }

    throw new Error("Timeout");
  }
);
