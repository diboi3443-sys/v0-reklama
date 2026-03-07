import { Worker, Job } from 'bullmq'
import { connection } from '../lib/queue'
import { supabase } from '../lib/supabase'
import { openrouter } from '../lib/openrouter/client'
import { uploadFromUrl } from '../lib/storage'

const worker = new Worker('image-generation', async (job: Job) => {
  const startTime = Date.now()
  
  const {
    generationId,
    userId,
    prompt,
    negativePrompt,
    model,
    width,
    height,
    quality,
    count,
    seed,
  } = job.data

  console.log(`[Image Worker] Processing job ${job.id} for generation ${generationId}`)

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

    // Update progress
    await job.updateProgress(20)

    // Generate image via OpenRouter
    console.log(`[Image Worker] Generating with model: ${model}`)
    
    const imageUrl = await openrouter.generateImage({
      prompt,
      model,
      width,
      height,
      steps: quality * 4, // quality 1-10 → steps 4-40
      seed,
    })

    console.log(`[Image Worker] Generated image: ${imageUrl}`)

    // Update progress
    await job.updateProgress(60)
    await supabase
      .from('generations')
      .update({ progress: 60 })
      .eq('id', generationId)

    // Upload to our storage
    console.log(`[Image Worker] Uploading to storage...`)
    
    const storedUrl = await uploadFromUrl(imageUrl, {
      userId,
      jobId: generationId,
      type: 'image',
    })

    console.log(`[Image Worker] Stored at: ${storedUrl}`)

    // Update progress
    await job.updateProgress(90)

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

    // Deduct credits from user
    await supabase.rpc('deduct_credits', {
      user_id: userId,
      amount: job.data.cost || 1,
    })

    // Log usage
    await supabase.from('usage_logs').insert({
      user_id: userId,
      action: 'generate_image',
      resource_type: 'generation',
      resource_id: generationId,
      credits_used: job.data.cost || 1,
      metadata: { model, prompt },
    })

    console.log(`[Image Worker] Job ${job.id} completed in ${processingTime}ms`)

    return { url: storedUrl, processingTime }

  } catch (error: any) {
    console.error(`[Image Worker] Job ${job.id} failed:`, error)

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

    throw error // Let BullMQ handle retry
  }
}, {
  connection,
  concurrency: 3, // Process 3 images simultaneously
  limiter: {
    max: 10, // Max 10 jobs
    duration: 60000, // per minute
  },
})

worker.on('completed', (job) => {
  console.log(`[Image Worker] ✅ Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`[Image Worker] ❌ Job ${job?.id} failed:`, err.message)
})

worker.on('error', (err) => {
  console.error('[Image Worker] Worker error:', err)
})

console.log('🖼️  Image Worker started')

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[Image Worker] Shutting down...')
  await worker.close()
  process.exit(0)
})

export default worker
