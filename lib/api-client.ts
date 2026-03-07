import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface GenerateImageParams {
  prompt: string
  negativePrompt?: string
  model?: string
  width?: number
  height?: number
  quality?: number
  count?: number
  seed?: number
}

export interface GenerateVideoParams {
  mode: 'text-to-video' | 'image-to-video' | 'motion-control'
  prompt?: string
  imageUrl?: string
  referenceVideoUrl?: string
  presetId?: string
  model?: string
  duration?: number
  aspectRatio?: '16:9' | '9:16' | '1:1'
  fps?: number
  quality?: number
}

export interface JobStatus {
  jobId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  result?: string
  results?: string[]
  thumbnail?: string
  error?: string
  metadata: {
    type: string
    mode: string
    model: string
    createdAt: string
    startedAt?: string
    completedAt?: string
    processingTime?: number
    costCredits: number
  }
}

export interface Preset {
  id: string
  name: string
  name_ru?: string
  slug: string
  category: 'cinematic' | 'social' | 'ecommerce' | 'creative' | 'other'
  tags: string[]
  description?: string
  description_ru?: string
  params: Record<string, any>
  preview_url?: string
  preview_gif_url?: string
  rating: number
  usage_count: number
  is_featured: boolean
  is_premium: boolean
  min_tier: string
}

export const api = {
  // Image generation
  generateImage: async (params: GenerateImageParams) => {
    const { data } = await apiClient.post('/generate/image', params)
    return data
  },

  // Video generation
  generateVideo: async (params: GenerateVideoParams) => {
    const { data } = await apiClient.post('/generate/video', params)
    return data
  },

  // Get job status
  getJobStatus: async (jobId: string): Promise<JobStatus> => {
    const { data } = await apiClient.get(`/generate/status/${jobId}`)
    return data
  },

  // Get presets
  getPresets: async (params?: {
    category?: string
    search?: string
    tags?: string[]
    featured?: boolean
    limit?: number
    offset?: number
  }) => {
    const { data } = await apiClient.get('/presets', { params })
    return data
  },
}

export default api
