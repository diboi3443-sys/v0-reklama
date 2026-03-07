"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Upload, Loader2, Play, Download, RefreshCw, Sparkles } from "lucide-react"
import { api, Preset } from "@/lib/api-client"
import { useJobStatus } from "@/hooks/use-job-status"
import { toast } from "sonner"
import useSWR from "swr"

const modes = [
  { id: "text-to-video", label: "Text → Video", description: "Generate from prompt" },
  { id: "image-to-video", label: "Image → Video", description: "Animate image" },
  { id: "motion-control", label: "Motion Control", description: "Transfer motion" },
]

const durations = [3, 5, 8, 10, 15]
const aspectRatios = ["16:9", "9:16", "1:1", "4:3"]

export function VideoContentV2() {
  const searchParams = useSearchParams()
  const presetIdFromUrl = searchParams?.get('preset')

  // Form state
  const [mode, setMode] = useState<"text-to-video" | "image-to-video" | "motion-control">("image-to-video")
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [presetId, setPresetId] = useState<string | undefined>(presetIdFromUrl || undefined)
  const [duration, setDuration] = useState(5)
  const [aspectRatio, setAspectRatio] = useState("16:9")
  
  // Generation state
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Fetch preset if ID in URL
  const { data: presetData } = useSWR(
    presetId ? `/presets/${presetId}` : null,
    async () => {
      const allPresets = await api.getPresets({ limit: 500 })
      return allPresets.presets.find((p: Preset) => p.id === presetId)
    }
  )

  // Poll job status
  const { job, isLoading: isPolling } = useJobStatus(currentJobId)

  // Auto-fill preset params
  useEffect(() => {
    if (presetData?.params) {
      if (presetData.params.duration) setDuration(presetData.params.duration)
      setMode("image-to-video")
    }
  }, [presetData])

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true)
      
      // Upload to Supabase Storage via API
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      setImageUrl(data.url)
      setImageFile(file)
      toast.success("Image uploaded!")
      
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "Failed to upload image")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleGenerate = async () => {
    // Validation
    if (mode === "text-to-video" && !prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    if (mode === "image-to-video" && !imageUrl) {
      toast.error("Please upload an image")
      return
    }

    try {
      setIsGenerating(true)

      const response = await api.generateVideo({
        mode,
        prompt: prompt || undefined,
        imageUrl: imageUrl || undefined,
        presetId,
        duration,
        aspectRatio: aspectRatio as any,
      })

      setCurrentJobId(response.jobId)
      toast.success(`Video generation started! Queue position: ${response.queuePosition || 1}`)

    } catch (error: any) {
      console.error("Generation error:", error)
      toast.error(error.response?.data?.error || "Failed to start generation")
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setCurrentJobId(null)
    setIsGenerating(false)
  }

  const handleDownload = (url: string) => {
    window.open(url, '_blank')
  }

  const isProcessing = isGenerating || isPolling || job?.status === 'pending' || job?.status === 'processing'

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      {/* Mode Tabs */}
      <div className="mb-10 flex gap-1 rounded-xl border border-[#D4A853]/5 bg-[#0c0c10]/50 p-1">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            disabled={isProcessing}
            className={`flex-1 rounded-lg py-3 px-4 text-sm font-medium transition-all disabled:opacity-50 ${
              mode === m.id
                ? "bg-gradient-to-r from-[#D4A853] to-[#B8922F] text-[#050507] shadow-lg shadow-[#D4A853]/15"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div>{m.label}</div>
            <div className="mt-0.5 text-[10px] opacity-70">{m.description}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Panel - Input */}
        <div className="space-y-6">
          {/* Text-to-Video Mode */}
          {mode === "text-to-video" && (
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                Video Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A cinematic shot of waves crashing on a beach at sunset..."
                rows={6}
                disabled={isProcessing}
                className="w-full resize-none rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#D4A853]/30 focus:outline-none disabled:opacity-50"
              />
            </div>
          )}

          {/* Image-to-Video Mode */}
          {mode === "image-to-video" && (
            <>
              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                  Upload Image
                </label>
                {!imageUrl ? (
                  <label className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-[#D4A853]/20 bg-[#D4A853]/5 transition-all hover:border-[#D4A853]/40 hover:bg-[#D4A853]/10">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                      disabled={uploadingImage || isProcessing}
                      className="hidden"
                    />
                    <div className="text-center">
                      {uploadingImage ? (
                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#D4A853]" />
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-[#D4A853]/40" />
                          <p className="mt-3 text-sm font-medium text-foreground">
                            Drop image or click to upload
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            PNG, JPG up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                ) : (
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-[#D4A853]/10">
                    <Image
                      src={imageUrl}
                      alt="Uploaded"
                      fill
                      className="object-cover"
                    />
                    {!isProcessing && (
                      <button
                        onClick={() => {
                          setImageUrl("")
                          setImageFile(null)
                        }}
                        className="absolute right-2 top-2 rounded-lg bg-black/50 p-2 text-white backdrop-blur-sm hover:bg-black/70"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Optional Prompt */}
              <div>
                <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                  Animation Description (Optional)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Slow zoom in with cinematic lighting..."
                  rows={3}
                  disabled={isProcessing}
                  className="w-full resize-none rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#D4A853]/30 focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Selected Preset */}
              {presetData && (
                <div className="rounded-lg border border-[#D4A853]/20 bg-[#D4A853]/10 p-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-[#D4A853]" />
                    <div>
                      <div className="font-semibold text-foreground">
                        Preset: {presetData.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {presetData.description}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Settings */}
          <div className="space-y-4 rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5 p-4">
            {/* Duration */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                Duration
              </label>
              <div className="flex gap-2">
                {durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    disabled={isProcessing}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all disabled:opacity-50 ${
                      duration === d
                        ? "bg-[#D4A853] text-[#050507]"
                        : "border border-[#D4A853]/10 bg-[#D4A853]/3 text-muted-foreground hover:border-[#D4A853]/20"
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                Aspect Ratio
              </label>
              <div className="flex gap-2">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar}
                    onClick={() => setAspectRatio(ar)}
                    disabled={isProcessing}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all disabled:opacity-50 ${
                      aspectRatio === ar
                        ? "bg-[#D4A853] text-[#050507]"
                        : "border border-[#D4A853]/10 bg-[#D4A853]/3 text-muted-foreground hover:border-[#D4A853]/20"
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isProcessing || (mode === "image-to-video" && !imageUrl)}
            className="w-full rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-6 py-4 font-semibold text-[#050507] shadow-lg shadow-[#D4A853]/20 transition-all hover:shadow-[#D4A853]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                {job?.progress ? `Generating... ${job.progress}%` : 'Starting...'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Play className="h-5 w-5" />
                Generate Video
              </span>
            )}
          </button>

          {/* Cost Info */}
          <div className="rounded-lg border border-[#D4A853]/10 bg-[#D4A853]/5 p-3 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Cost:</span>
              <span className="font-semibold text-[#D4A853]">5 credits</span>
            </div>
            {job?.metadata && (
              <div className="mt-2 flex justify-between">
                <span>Est. time:</span>
                <span className="font-semibold text-foreground">
                  {duration * 30}s (~{Math.round(duration * 30 / 60)} min)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div>
          {!currentJobId && !job ? (
            // Empty state
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5">
              <div className="text-center">
                <Play className="mx-auto h-16 w-16 text-[#D4A853]/30" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">Ready to create video</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {mode === "text-to-video" && "Enter a prompt to generate"}
                  {mode === "image-to-video" && "Upload an image to animate"}
                  {mode === "motion-control" && "Upload image and reference"}
                </p>
              </div>
            </div>
          ) : job?.status === 'processing' || job?.status === 'pending' ? (
            // Loading state
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5">
              <div className="text-center">
                <Loader2 className="mx-auto h-16 w-16 animate-spin text-[#D4A853]" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">Generating video...</h3>
                <div className="mt-3 w-64 mx-auto">
                  <div className="h-2 rounded-full bg-[#D4A853]/20 overflow-hidden">
                    <div 
                      className="h-full bg-[#D4A853] transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {job.progress}% complete
                  </p>
                </div>
                {job.metadata?.processingTime && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Elapsed: {Math.round((job.metadata.processingTime || 0) / 1000)}s
                  </p>
                )}
              </div>
            </div>
          ) : job?.status === 'failed' ? (
            // Error state
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span className="text-3xl">❌</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">Generation Failed</h3>
                <p className="mt-2 text-sm text-red-400">
                  {job.error || 'Unknown error'}
                </p>
                <button
                  onClick={handleReset}
                  className="mt-4 flex items-center gap-2 mx-auto rounded-lg border border-[#D4A853]/20 bg-[#D4A853]/5 px-6 py-2 text-sm font-medium text-foreground hover:bg-[#D4A853]/10"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          ) : job?.status === 'completed' && job.result ? (
            // Success state - show video
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Video Ready!</h3>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-lg border border-[#D4A853]/20 bg-[#D4A853]/5 px-4 py-2 text-sm font-medium text-foreground hover:bg-[#D4A853]/10"
                >
                  <RefreshCw className="h-4 w-4" />
                  New Video
                </button>
              </div>

              {/* Video Player */}
              <div className="relative aspect-video overflow-hidden rounded-xl border border-[#D4A853]/10">
                <video
                  src={job.result}
                  controls
                  autoPlay
                  loop
                  className="h-full w-full"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload(job.result!)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-6 py-3 font-semibold text-[#050507]"
                >
                  <Download className="h-4 w-4" />
                  Download Video
                </button>
              </div>

              {/* Metadata */}
              <div className="rounded-lg border border-[#D4A853]/10 bg-[#D4A853]/5 p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="ml-2 font-medium text-foreground">{duration}s</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Aspect:</span>
                    <span className="ml-2 font-medium text-foreground">{aspectRatio}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Processing Time:</span>
                    <span className="ml-2 font-medium text-foreground">
                      {Math.round((job.metadata.processingTime || 0) / 1000)}s
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="ml-2 font-medium text-[#D4A853]">5 credits</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
