/**
 * Replicate API client for video generation
 * Models: Kling, LTX Video, Stable Video Diffusion
 */

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN!
const REPLICATE_API_URL = 'https://api.replicate.com/v1'

export interface ReplicateVideoParams {
  prompt?: string
  imageUrl?: string
  model?: 'kling' | 'ltx-video' | 'stable-video'
  duration?: number
  aspectRatio?: '16:9' | '9:16' | '1:1'
  motionStrength?: number
}

export class ReplicateClient {
  private apiToken: string

  constructor(apiToken: string = REPLICATE_API_TOKEN) {
    if (!apiToken) {
      throw new Error('Replicate API token is required')
    }
    this.apiToken = apiToken
  }

  /**
   * Generate video using Kling v3
   */
  async generateVideoKling(params: ReplicateVideoParams): Promise<string> {
    const {
      prompt,
      imageUrl,
      duration = 5,
      aspectRatio = '16:9',
    } = params

    const input: any = {
      cfg_scale: 0.5,
      num_frames: duration * 16, // ~16 fps
      aspect_ratio: aspectRatio,
    }

    if (imageUrl) {
      // Image-to-video mode
      input.image = imageUrl
      input.prompt = prompt || 'animate this image'
    } else {
      // Text-to-video mode
      input.prompt = prompt
    }

    const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'kwaivgi/kling-v3-motion-control', // Latest Kling version
        input,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Replicate error: ${error.detail || 'Unknown error'}`)
    }

    const prediction = await response.json()
    return prediction.id
  }

  /**
   * Generate video using LTX Video 2.3 Pro
   */
  async generateVideoLTX(params: ReplicateVideoParams): Promise<string> {
    const {
      prompt,
      imageUrl,
      duration = 5,
    } = params

    const response = await fetch(`${REPLICATE_API_URL}/predictions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'lightricks/ltx-2.3-pro',
        input: {
          prompt,
          image: imageUrl,
          num_frames: duration * 50, // 50 fps
          width: 1920,
          height: 1080,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Replicate error: ${error.detail || 'Unknown error'}`)
    }

    const prediction = await response.json()
    return prediction.id
  }

  /**
   * Get prediction status and result
   */
  async getPrediction(predictionId: string): Promise<{
    status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled'
    output?: string | string[]
    error?: string
    progress?: number
  }> {
    const response = await fetch(`${REPLICATE_API_URL}/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get prediction status')
    }

    const prediction = await response.json()
    
    return {
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
      progress: this.calculateProgress(prediction),
    }
  }

  /**
   * Wait for prediction to complete
   */
  async waitForPrediction(predictionId: string, maxWaitMs: number = 300000): Promise<string> {
    const startTime = Date.now()
    
    while (Date.now() - startTime < maxWaitMs) {
      const result = await this.getPrediction(predictionId)
      
      if (result.status === 'succeeded') {
        const output = Array.isArray(result.output) ? result.output[0] : result.output
        if (!output) {
          throw new Error('No output URL from Replicate')
        }
        return output
      }
      
      if (result.status === 'failed') {
        throw new Error(`Prediction failed: ${result.error}`)
      }
      
      if (result.status === 'canceled') {
        throw new Error('Prediction was canceled')
      }
      
      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    throw new Error('Prediction timeout')
  }

  private calculateProgress(prediction: any): number {
    if (prediction.status === 'starting') return 10
    if (prediction.status === 'processing') return 50
    if (prediction.status === 'succeeded') return 100
    if (prediction.status === 'failed') return 0
    return 0
  }
}

export const replicate = new ReplicateClient()
