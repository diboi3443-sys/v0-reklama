import { NextRequest, NextResponse } from 'next/server'
import { imageQueue } from '@/lib/queue'
import { supabase } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-server'
import { openrouter } from '@/lib/openrouter/client'

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
      prompt,
      negativePrompt,
      model = 'black-forest-labs/flux-pro',
      width = 1024,
      height = 1024,
      quality = 8,
      count = 1,
      seed,
    } = body

    // Validate required fields
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Check user credits
    const { data: user } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    const estimatedCost = openrouter.estimateCost({ prompt, model })

    if (!user || user.credits < estimatedCost) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // Create generation record
    const { data: generation, error: genError } = await supabase
      .from('generations')
      .insert({
        user_id: userId,
        type: 'image',
        mode: 'text-to-image',
        status: 'pending',
        prompt,
        negative_prompt: negativePrompt,
        model,
        params: {
          width,
          height,
          quality,
          count,
          seed,
        },
        cost_credits: estimatedCost,
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
    const job = await imageQueue.add('generate-image', {
      generationId: generation.id,
      userId,
      prompt,
      negativePrompt,
      model,
      width,
      height,
      quality,
      count,
      seed,
    }, {
      jobId: generation.id, // Use generation ID as job ID for easy lookup
      priority: user.tier === 'pro' || user.tier === 'studio' ? 1 : 10,
    })

    // Create job tracking record
    await supabase.from('jobs').insert({
      bull_job_id: job.id,
      generation_id: generation.id,
      queue_name: 'image-generation',
      status: 'waiting',
      data: {
        prompt,
        model,
      },
    })

    return NextResponse.json({
      jobId: generation.id,
      status: 'queued',
      estimatedTime: 30, // seconds
    })

  } catch (error: any) {
    console.error('Image generation API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
