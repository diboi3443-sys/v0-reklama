import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { inngest } from "@/inngest/client";
import { getSupabase } from "@/lib/supabase";

// Для обратной совместимости
const supabase = getSupabase();

export async function POST(req: NextRequest) {
  try {
    // Auth
    const authClient = await createClient();
    const { data: { session } } = await authClient.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;

    // Парсим body
    const body = await req.json();
    const {
      prompt,
      imageUrl, // Для image-to-video
      model = "kling",
      duration = 5,
      aspectRatio = "16:9",
    } = body;

    if (!prompt && !imageUrl) {
      return NextResponse.json(
        { error: "Prompt or imageUrl is required" },
        { status: 400 }
      );
    }

    // Проверяем кредиты (видео дороже)
    const { data: user } = await supabase
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single();

    const estimatedCost = model === "kling" ? 10 : 5;

    if (!user || user.credits < estimatedCost) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    // Создаём запись в БД
    const { data: generation, error: genError } = await supabase
      .from("generations")
      .insert({
        user_id: userId,
        type: "video",
        mode: imageUrl ? "image-to-video" : "text-to-video",
        status: "pending",
        prompt,
        model,
        params: { duration, aspectRatio },
        cost_credits: estimatedCost,
      })
      .select()
      .single();

    if (genError) {
      console.error("Failed to create generation:", genError);
      return NextResponse.json(
        { error: "Failed to create generation" },
        { status: 500 }
      );
    }

    // 🚀 Отправляем событие в Inngest!
    await inngest.send({
      name: "video/generate",
      data: {
        generationId: generation.id,
        userId,
        prompt,
        imageUrl,
        model,
        duration,
        aspectRatio,
        cost: estimatedCost, // Передаём стоимость
      },
    });

    return NextResponse.json({
      jobId: generation.id,
      status: "pending",
      message: "Video generation started. This may take 1-2 minutes.",
    });

  } catch (error: any) {
    console.error("Video generation API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
