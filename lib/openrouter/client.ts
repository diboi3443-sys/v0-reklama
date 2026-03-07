const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export interface ImageGenerationParams {
  prompt: string
  model?: string
  width?: number
  height?: number
  steps?: number
  seed?: number
}

export interface VideoGenerationParams {
  prompt?: string
  imageUrl?: string
  model?: string
  duration?: number
  fps?: number
  motionStrength?: number
}

export class OpenRouterClient {
  private apiKey: string

  constructor(apiKey: string = OPENROUTER_API_KEY) {
    if (!apiKey) {
      throw new Error('OpenRouter API key is required')
    }
    this.apiKey = apiKey
  }

  /**
   * Generate image via OpenRouter
   */
  async generateImage(params: ImageGenerationParams): Promise<string> {
    const {
      prompt,
      model = 'black-forest-labs/flux-pro',
      width = 1024,
      height = 1024,
      steps = 30,
      seed,
    } = params

    const response = await fetch(`${OPENROUTER_BASE_URL}/images/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'v0-reklama',
      },
      body: JSON.stringify({
        model,
        prompt,
        n: 1,
        size: `${width}x${height}`,
        response_format: 'url',
        // Additional params
        steps,
        seed,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenRouter error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    return data.data[0].url
  }

  /**
   * Generate video via OpenRouter (Kling, Luma, etc.)
   */
  async generateVideo(params: VideoGenerationParams): Promise<string> {
    const {
      prompt,
      imageUrl,
      model = 'kling/v1-standard',
      duration = 5,
      fps = 30,
      motionStrength = 0.7,
    } = params

    // For video, we'll use a custom implementation
    // OpenRouter may not have a standard video API yet
    // So we'll integrate with specific providers (Kling, Luma) directly
    
    // For now, return a placeholder implementation
    // We'll implement specific providers in separate files
    throw new Error('Video generation via OpenRouter not yet implemented. Use specific provider.')
  }

  /**
   * Get available models
   */
  async getModels(): Promise<any[]> {
    const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch models')
    }

    const data = await response.json()
    return data.data
  }

  /**
   * Estimate cost for generation
   */
  estimateCost(params: ImageGenerationParams | VideoGenerationParams): number {
    // Simplified cost estimation
    // In production, use actual model pricing from OpenRouter
    
    if ('imageUrl' in params || 'duration' in params) {
      // Video generation (expensive)
      return 5 // 5 credits per video
    } else {
      // Image generation
      return 1 // 1 credit per image
    }
  }
}

export const openrouter = new OpenRouterClient()
