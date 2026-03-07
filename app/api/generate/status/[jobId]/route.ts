import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params

    // Get generation status
    const { data: generation, error } = await supabase
      .from('generations')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error || !generation) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // TODO: Check if user has access to this job
    // For now, allow anyone

    // Get job details from jobs table
    const { data: job } = await supabase
      .from('jobs')
      .select('*')
      .eq('generation_id', jobId)
      .single()

    return NextResponse.json({
      jobId: generation.id,
      status: generation.status, // 'pending' | 'processing' | 'completed' | 'failed'
      progress: generation.progress,
      result: generation.result_url,
      results: generation.result_urls,
      thumbnail: generation.thumbnail_url,
      error: generation.error_message,
      metadata: {
        type: generation.type,
        mode: generation.mode,
        model: generation.model,
        createdAt: generation.created_at,
        startedAt: generation.started_at,
        completedAt: generation.completed_at,
        processingTime: generation.processing_time_ms,
        costCredits: generation.cost_credits,
      },
      job: job ? {
        queueName: job.queue_name,
        attempts: job.attempts,
        maxAttempts: job.max_attempts,
      } : null,
    })

  } catch (error: any) {
    console.error('Status API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
