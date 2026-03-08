import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { inngest } from "@/inngest/client";
import { openrouter } from "@/lib/openrouter/client";
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
      negativePrompt,
      model = "black-forest-labs/flux-pro",
      width = 1024,
      height = 1024,
      quality = 8,
      seed,
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const { data: user } = await supabase
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single();

    const estimatedCost = 1;

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
        type: "image",
        mode: "text-to-image",
        status: "pending",
        prompt,
        negative_prompt: negativePrompt,
        model,
        params: { width, height, quality, seed },
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
      name: "image/generate",
      data: {
        generationId: generation.id,
        userId,
        prompt,
        model,
        width,
        height,
        quality,
        seed,
        cost: estimatedCost,
      },
    });

    return NextResponse.json({
      jobId: generation.id,
      status: "pending",
      message: "Image generation started",
    });

  } catch (error: any) {
    console.error("Image generation API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
