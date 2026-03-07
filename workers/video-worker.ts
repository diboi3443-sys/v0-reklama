import { Worker, Job } from 'bullmq'
import { connection } from '../lib/queue'
import { supabase } from '../lib/supabase'
import { replicate } from '../lib/openrouter/replicate'
import { uploadFromUrl } from '../lib/storage'

const worker = new Worker('video-generation', async (job: Job) => {
  const startTime = Date.now()
  
  const {
    generationId,
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
  } = job.data

  console.log(`[Video Worker] Processing job ${job.id} for generation ${generationId}`)
  console.log(`[Video Worker] Mode: ${mode}, Model: ${model}`)

  try {
    // Update status to processing
    await supabase
      .from('generations')
      .update({
        status: 'processing',
        progress: 10,
        started_at: new Date().toISOString(),
      })
      .eq('id', generationId)

    await supabase
      .from('jobs')
      .update({
        status: 'active',
        started_at: new Date().toISOString(),
      })
      .eq('generation_id', generationId)

    await job.updateProgress(20)

    // Generate video via Replicate (Kling)
    console.log(`[Video Worker] Starting video generation...`)
    
    let predictionId: string

    if (model === 'ltx-video') {
      predictionId = await replicate.generateVideoLTX({
        prompt,
        imageUrl,
        duration,
      })
    } else {
      // Default: Kling
      predictionId = await replicate.generateVideoKling({
        prompt,
        imageUrl,
        duration,
        aspectRatio,
      })
    }

    console.log(`[Video Worker] Prediction started: ${predictionId}`)

    await job.updateProgress(40)
    await supabase
      .from('generations')
      .update({ progress: 40 })
      .eq('id', generationId)

    // Wait for prediction to complete
    console.log(`[Video Worker] Waiting for completion...`)
    
    const videoUrl = await replicate.waitForPrediction(predictionId)

    console.log(`[Video Worker] Video generated: ${videoUrl}`)

    await job.updateProgress(80)
    await supabase
      .from('generations')
      .update({ progress: 80 })
      .eq('id', generationId)

    // Upload to our storage
    console.log(`[Video Worker] Uploading to storage...`)
    
    const storedUrl = await uploadFromUrl(videoUrl, {
      userId,
      jobId: generationId,
      type: 'video',
    })

    console.log(`[Video Worker] Stored at: ${storedUrl}`)

    // Calculate processing time
    const processingTime = Date.now() - startTime

    // Update generation record
    await supabase
      .from('generations')
      .update({
        status: 'completed',
        progress: 100,
        result_url: storedUrl,
        result_urls: [storedUrl],
        completed_at: new Date().toISOString(),
        processing_time_ms: processingTime,
        metadata: {
          predictionId,
          model,
          duration,
        },
      })
      .eq('id', generationId)

    // Update job record
    await supabase
      .from('jobs')
      .update({
        status: 'completed',
        result: { url: storedUrl },
        completed_at: new Date().toISOString(),
      })
      .eq('generation_id', generationId)

    // Deduct credits (video costs 5 credits)
    await supabase.rpc('deduct_credits', {
      user_id: userId,
      amount: 5,
    })

    // Update preset usage if used
    if (job.data.presetId) {
      await supabase.rpc('increment_preset_usage', {
        preset_id: job.data.presetId,
      })
    }

    // Log usage
    await supabase.from('usage_logs').insert({
      user_id: userId,
      action: 'generate_video',
      resource_type: 'generation',
      resource_id: generationId,
      credits_used: 5,
      metadata: { mode, model, duration, prompt },
    })

    console.log(`[Video Worker] Job ${job.id} completed in ${processingTime}ms (${Math.round(processingTime/1000)}s)`)

    return { url: storedUrl, processingTime }

  } catch (error: any) {
    console.error(`[Video Worker] Job ${job.id} failed:`, error)

    // Update generation status
    await supabase
      .from('generations')
      .update({
        status: 'failed',
        error_message: error.message,
        completed_at: new Date().toISOString(),
      })
      .eq('id', generationId)

    // Update job status
    await supabase
      .from('jobs')
      .update({
        status: 'failed',
        error: error.message,
        attempts: (await job.attemptsMade) + 1,
      })
      .eq('generation_id', generationId)

    throw error
  }
}, {
  connection,
  concurrency: 2, // Process 2 videos simultaneously (expensive)
  limiter: {
    max: 5, // Max 5 videos
    duration: 60000, // per minute
  },
})

worker.on('completed', (job) => {
  console.log(`[Video Worker] ✅ Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`[Video Worker] ❌ Job ${job?.id} failed:`, err.message)
})

worker.on('error', (err) => {
  console.error('[Video Worker] Worker error:', err)
})

console.log('🎬 Video Worker started')

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Video Worker] Shutting down...')
  await worker.close()
  process.exit(0)
})

export default worker
