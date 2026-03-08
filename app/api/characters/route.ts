import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { inngest } from "@/inngest/client";
import { getSupabase } from "@/lib/supabase";

const supabase = getSupabase();

export async function POST(req: NextRequest) {
  try {
    const authClient = await createClient();
    const { data: { session } } = await authClient.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    const body = await req.json();
    
    const {
      characterId,
      prompt,
      model = "kling",
      duration = 5,
      aspectRatio = "16:9",
    } = body;

    if (!characterId) {
      return NextResponse.json(
        { error: "Character ID is required" },
        { status: 400 }
      );
    }

    const { data: user } = await supabase
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single();

    const estimatedCost = 15;

    if (!user || user.credits < estimatedCost) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    const { data: video, error } = await supabase
      .from("character_videos")
      .insert({
        user_id: userId,
        character_id: characterId,
        status: "pending",
        prompt,
        model,
        params: { duration, aspectRatio },
        cost_credits: estimatedCost,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to create video" },
        { status: 500 }
      );
    }

    await inngest.send({
      name: "character-video/generate",
      data: {
        generationId: video.id,
        userId,
        characterId,
        prompt,
        model,
        duration,
        aspectRatio,
        cost: estimatedCost,
      },
    });

    return NextResponse.json({
      jobId: video.id,
      status: "pending",
      message: "Character video generation started",
    });

  } catch (error: any) {
    console.error("Character video generation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
