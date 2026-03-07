"use client"

import { useState } from "react"
import Image from "next/image"
import { Sparkles, Loader2, Download, RefreshCw } from "lucide-react"
import { api } from "@/lib/api-client"
import { useJobStatus } from "@/hooks/use-job-status"
import { toast } from "sonner"

const models = [
  { id: "black-forest-labs/flux-pro", name: "Flux Pro", badge: "BEST" },
  { id: "stability-ai/sdxl", name: "SDXL", badge: null },
  { id: "ideogram-ai/ideogram-v2", name: "Ideogram V2", badge: "NEW" },
]

const aspects = ["1:1", "16:9", "9:16", "4:3", "3:4"]
const qualities = [1, 3, 5, 7, 10]

export function ImageContentV2() {
  // Form state
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState(models[0].id)
  const [aspect, setAspect] = useState("1:1")
  const [quality, setQuality] = useState(7)
  const [count, setCount] = useState(1)

  // Generation state
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Poll job status
  const { job, isLoading: isPolling } = useJobStatus(currentJobId)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    try {
      setIsGenerating(true)

      // Parse aspect ratio
      const [w, h] = aspect.split(':').map(Number)
      const width = 1024
      const height = Math.round((1024 * h) / w)

      const response = await api.generateImage({
        prompt,
        negativePrompt: negativePrompt || undefined,
        model: selectedModel,
        width,
        height,
        quality,
        count,
      })

      setCurrentJobId(response.jobId)
      toast.success("Generation started!")

    } catch (error: any) {
      console.error("Generation error:", error)
      toast.error(error.response?.data?.error || "Failed to start generation")
      setIsGenerating(false)
    }
  }

  // Reset when job completes
  const handleReset = () => {
    setCurrentJobId(null)
    setIsGenerating(false)
  }

  // Download result
  const handleDownload = (url: string) => {
    window.open(url, '_blank')
  }

  const isProcessing = isGenerating || isPolling || job?.status === 'pending' || job?.status === 'processing'

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Left Sidebar */}
      <aside className="w-full border-b border-[#D4A853]/5 bg-[#08080b] p-5 lg:w-[360px] lg:border-b-0 lg:border-r">
        <div className="space-y-6">
          {/* Prompt */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful sunset over mountains..."
              rows={4}
              disabled={isProcessing}
              className="w-full resize-none rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#D4A853]/30 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Negative Prompt */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
              Negative Prompt (Optional)
            </label>
            <textarea
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="blurry, low quality..."
              rows={2}
              disabled={isProcessing}
              className="w-full resize-none rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#D4A853]/30 focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Model Selection */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
              Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isProcessing}
              className="w-full rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/3 px-4 py-2.5 text-sm text-foreground focus:border-[#D4A853]/30 focus:outline-none disabled:opacity-50"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} {model.badge && `(${model.badge})`}
                </option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
              Aspect Ratio
            </label>
            <div className="flex flex-wrap gap-2">
              {aspects.map((a) => (
                <button
                  key={a}
                  onClick={() => setAspect(a)}
                  disabled={isProcessing}
                  className={`rounded-lg px-4 py-2 text-xs font-medium transition-all disabled:opacity-50 ${
                    aspect === a
                      ? "bg-[#D4A853] text-[#050507] shadow-lg shadow-[#D4A853]/20"
                      : "border border-[#D4A853]/10 bg-[#D4A853]/3 text-muted-foreground hover:border-[#D4A853]/20"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
              Quality: {quality}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              disabled={isProcessing}
              className="w-full accent-[#D4A853] disabled:opacity-50"
            />
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span>Fast</span>
              <span>Best</span>
            </div>
          </div>

          {/* Number of Images */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
              Number of Images
            </label>
            <div className="flex gap-2">
              {[1, 2, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  disabled={isProcessing}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all disabled:opacity-50 ${
                    count === n
                      ? "bg-[#D4A853] text-[#050507]"
                      : "border border-[#D4A853]/10 bg-[#D4A853]/3 text-muted-foreground hover:border-[#D4A853]/20"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isProcessing || !prompt.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-6 py-3.5 font-semibold text-[#050507] shadow-lg shadow-[#D4A853]/20 transition-all hover:shadow-[#D4A853]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {job?.progress ? `Generating... ${job.progress}%` : 'Starting...'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate
              </span>
            )}
          </button>

          {/* Cost Info */}
          <div className="rounded-lg border border-[#D4A853]/10 bg-[#D4A853]/5 p-3 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Cost:</span>
              <span className="font-semibold text-[#D4A853]">{count} credit{count > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 p-6">
        {!currentJobId && !job ? (
          // Empty state
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Sparkles className="mx-auto h-16 w-16 text-[#D4A853]/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">Ready to create</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter a prompt and click Generate to start
              </p>
            </div>
          </div>
        ) : job?.status === 'processing' || job?.status === 'pending' ? (
          // Loading state
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-16 w-16 animate-spin text-[#D4A853]" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">Generating...</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Progress: {job.progress}%
              </p>
              {job.metadata?.processingTime && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Elapsed: {Math.round((job.metadata.processingTime || 0) / 1000)}s
                </p>
              )}
            </div>
          </div>
        ) : job?.status === 'failed' ? (
          // Error state
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">Generation Failed</h3>
              <p className="mt-2 text-sm text-red-400">
                {job.error || 'Unknown error'}
              </p>
              <button
                onClick={handleReset}
                className="mt-4 rounded-lg border border-[#D4A853]/20 bg-[#D4A853]/5 px-6 py-2 text-sm font-medium text-foreground hover:bg-[#D4A853]/10"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : job?.status === 'completed' && job.results ? (
          // Success state - show results
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Generated {job.results.length} image{job.results.length > 1 ? 's' : ''}
              </h3>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-lg border border-[#D4A853]/20 bg-[#D4A853]/5 px-4 py-2 text-sm font-medium text-foreground hover:bg-[#D4A853]/10"
              >
                <RefreshCw className="h-4 w-4" />
                New Generation
              </button>
            </div>

            <div className={`grid gap-4 ${
              job.results.length === 1 ? 'grid-cols-1' : 
              job.results.length === 2 ? 'grid-cols-2' :
              'grid-cols-2 md:grid-cols-4'
            }`}>
              {job.results.map((url, index) => (
                <div key={index} className="group relative aspect-square overflow-hidden rounded-xl border border-[#D4A853]/10">
                  <Image
                    src={url}
                    alt={`Generated image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDownload(url)}
                      className="rounded-lg bg-[#D4A853] px-4 py-2 text-sm font-semibold text-[#050507] hover:bg-[#B8922F]"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Metadata */}
            <div className="mt-6 rounded-lg border border-[#D4A853]/10 bg-[#D4A853]/5 p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Model:</span>
                  <span className="ml-2 font-medium text-foreground">{job.metadata.model}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Processing Time:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {Math.round((job.metadata.processingTime || 0) / 1000)}s
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="ml-2 font-medium text-[#D4A853]">
                    {job.metadata.costCredits} credits
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Quality:</span>
                  <span className="ml-2 font-medium text-foreground">{quality}/10</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
