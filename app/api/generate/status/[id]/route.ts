import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { replicate } from "@/lib/openrouter/replicate";
import { getSupabase } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase(); // <-- ВНУТРИ функции!
    const { id } = params;
    
    const authClient = await createClient();
    const { data: { session } } = await authClient.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: generation, error } = await supabase
      .from("generations")
      .select("*")
      .eq("id", id)
      .eq("user_id", session.user.id)
      .single();

    if (error || !generation) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    if (generation.prediction_id && 
        (generation.status === "pending" || generation.status === "processing")) {
      try {
        const prediction = await replicate.predictions.get(generation.prediction_id);
        
        if (prediction.status !== generation.status && prediction.status !== "starting") {
          const update: any = { status: prediction.status };
          
          if (prediction.status === "succeeded") {
            const output = Array.isArray(prediction.output) 
              ? prediction.output[0] 
              : prediction.output;
            update.result_url = output;
            update.result_urls = [output];
            update.progress = 100;
            update.completed_at = new Date().toISOString();
          }
          
          if (prediction.status === "failed") {
            update.error_message = prediction.error;
          }

          await supabase.from("generations").update(update).eq("id", id);
          Object.assign(generation, update);
        }
      } catch (e) {
        console.error("Failed to check Replicate status:", e);
      }
    }

    return NextResponse.json({
      id: generation.id,
      status: generation.status,
      progress: generation.progress,
      result_url: generation.result_url,
      result_urls: generation.result_urls,
      error_message: generation.error_message,
      created_at: generation.created_at,
      completed_at: generation.completed_at,
    });

  } catch (error: any) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
