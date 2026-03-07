import { NextRequest, NextResponse } from 'next/server'
import { videoQueue } from '@/lib/queue'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const authClient = await createClient()
    const { data: { session } } = await authClient.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    
    const body = await req.json()
    const {
      mode, // 'text-to-video' | 'image-to-video' | 'motion-control'
      prompt,
      imageUrl,
      referenceVideoUrl,
      presetId,
      model = 'kling-v3',
      duration = 5,
      aspectRatio = '16:9',
      fps = 30,
      quality = 1080,
    } = body

    // Validate mode
    if (!mode || !['text-to-video', 'image-to-video', 'motion-control'].includes(mode)) {
      return NextResponse.json(
        { error: 'Invalid mode' },
        { status: 400 }
      )
    }

    // Validate required fields based on mode
    if (mode === 'text-to-video' && !prompt) {
      return NextResponse.json(
        { error: 'Prompt is required for text-to-video' },
        { status: 400 }
      )
    }

    if (mode === 'image-to-video' && !imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required for image-to-video' },
        { status: 400 }
      )
    }

    if (mode === 'motion-control' && !referenceVideoUrl) {
      return NextResponse.json(
        { error: 'Reference video is required for motion-control' },
        { status: 400 }
      )
    }

    // Check user credits (video is expensive)
    const { data: user } = await supabase
      .from('users')
      .select('credits, tier')
      .eq('id', userId)
      .single()

    const videoCost = 5 // 5 credits per video

    if (!user || user.credits < videoCost) {
      return NextResponse.json(
        { error: 'Insufficient credits. Video generation costs 5 credits.' },
        { status: 402 }
      )
    }

    // Get preset params if presetId provided
    let presetParams = null
    if (presetId) {
      const { data: preset } = await supabase
        .from('presets')
        .select('params, name')
        .eq('id', presetId)
        .single()

      if (preset) {
        presetParams = preset.params
      }
    }

    // Create generation record
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        type: 'video',
        mode,
        status: 'pending',
        prompt,
        input_image_url: imageUrl,
        reference_video_url: referenceVideoUrl,
        preset_id: presetId,
        model,
        params: {
          duration,
          aspectRatio,
          fps,
          quality,
          presetParams,
        },
        cost_credits: videoCost,
      })
      .select()
      .single()

    if (genError) {
      console.error('Failed to create generation:', genError)
      return NextResponse.json(
        { error: 'Failed to create generation' },
        { status: 500 }
      )
    }

    // Add job to queue
    const job = await videoQueue.add('generate-video', {
      generationId: generation.id,
      userId,
      mode,
      prompt,
      imageUrl,
      referenceVideoUrl,
      presetParams,
      model,
      duration,
      aspectRatio,
      fps,
      quality,
    }, {
      jobId: generation.id,
      priority: user.tier === 'pro' || user.tier === 'studio' ? 1 : 10,
    })

    // Create job tracking record
    await supabase.from('jobs').insert({
      bull_job_id: job.id,
      generation_id: generation.id,
      queue_name: 'video-generation',
      status: 'waiting',
      data: {
        mode,
        prompt,
        model,
      },
    })

    return NextResponse.json({
      jobId: generation.id,
      status: 'queued',
      estimatedTime: duration * 30, // Rough estimate: 30s per second of video
      queuePosition: await videoQueue.count(),
    })

  } catch (error: any) {
    console.error('Video generation API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
