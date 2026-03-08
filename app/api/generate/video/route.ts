import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { inngest } from "@/inngest/client";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase(); // <-- ВНУТРИ функции!
    
    const authClient = await createClient();
    const { data: { session } } = await authClient.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;

    const body = await req.json();
    const {
      prompt,
      imageUrl,
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
        cost: estimatedCost,
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
