import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { inngest } from "@/inngest/client";
import { openrouter } from "@/lib/openrouter/client";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  console.log("[API IMAGE] ========================================");
  console.log("[API IMAGE] Starting POST request");
  
  try {
    console.log("[API IMAGE] Step 1: Getting Supabase client...");
    const supabase = getSupabase();
    console.log("[API IMAGE] Step 1: OK");
    
    console.log("[API IMAGE] Step 2: Getting session...");
    const authClient = await createClient();
    const { data: { session } } = await authClient.auth.getSession();
    console.log("[API IMAGE] Step 2: Session userId:", session?.user?.id);
    
    if (!session) {
      console.log("[API IMAGE] ERROR: No session!");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = session.user.id;
    console.log("[API IMAGE] Step 3: UserId:", userId);

    console.log("[API IMAGE] Step 4: Parsing body...");
    const body = await req.json();
    console.log("[API IMAGE] Step 4: Body:", JSON.stringify(body));
    
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
      console.log("[API IMAGE] ERROR: No prompt!");
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    console.log("[API IMAGE] Step 5: Checking credits...");
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", userId)
      .single();
    
    console.log("[API IMAGE] Step 5: User:", JSON.stringify(user), "Error:", userError?.message);

    const estimatedCost = 1;

    if (!user || user.credits < estimatedCost) {
      console.log("[API IMAGE] ERROR: No credits! User:", JSON.stringify(user));
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    console.log("[API IMAGE] Step 6: Creating generation record...");
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

    console.log("[API IMAGE] Step 6: Generation:", JSON.stringify(generation), "Error:", genError?.message);

    if (genError) {
      console.error("[API IMAGE] ERROR: Failed to create generation:", genError);
      return NextResponse.json(
        { error: "Failed to create generation: " + genError.message },
        { status: 500 }
      );
    }

    console.log("[API IMAGE] Step 7: Sending to Inngest...");
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
    console.log("[API IMAGE] Step 7: Inngest event sent");

    console.log("[API IMAGE] SUCCESS! Returning jobId:", generation.id);
    return NextResponse.json({
      jobId: generation.id,
      status: "pending",
      message: "Image generation started",
    });

  } catch (error: any) {
    console.error("[API IMAGE] CRITICAL ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
