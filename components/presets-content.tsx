"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { Search, Sparkles, TrendingUp, Zap, Star, Play, Loader2 } from "lucide-react"
import { api, Preset } from "@/lib/api-client"

const categories = [
  { id: "all", label: "All Presets", icon: Sparkles },
  { id: "cinematic", label: "Cinematic", icon: Star },
  { id: "social", label: "Social Media", icon: TrendingUp },
  { id: "ecommerce", label: "E-commerce", icon: Zap },
  { id: "creative", label: "Creative", icon: Sparkles },
]

export function PresetsContent() {
  const router = useRouter()
  
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null)

  // Fetch presets
  const { data, isLoading, error } = useSWR(
    `/presets?category=${selectedCategory}&search=${searchQuery}`,
    () => api.getPresets({
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      search: searchQuery || undefined,
      limit: 100,
    })
  )

  const presets = data?.presets || []

  const handleSelectPreset = (preset: Preset) => {
    // Navigate to video generator with preset pre-selected
    router.push(`/create/video?preset=${preset.id}`)
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-10">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4A853]/50">
          Animation Library
        </p>
        <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl">
          400+ Ready-to-Use Presets
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          One-click animations for your videos. From cinematic camera movements to viral social media effects.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative mx-auto max-w-2xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#D4A853]/30" />
          <input
            type="text"
            placeholder="Search presets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/3 py-3.5 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#D4A853]/30 focus:outline-none"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#D4A853] text-[#050507] shadow-lg shadow-[#D4A853]/20"
                    : "border border-[#D4A853]/10 bg-[#D4A853]/3 text-muted-foreground hover:border-[#D4A853]/20 hover:bg-[#D4A853]/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4A853]" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p className="text-red-400">Failed to load presets. Please try again.</p>
        </div>
      )}

      {/* Presets Grid */}
      {!isLoading && !error && (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            {presets.length} preset{presets.length !== 1 ? 's' : ''} found
          </div>

          {presets.length === 0 ? (
            <div className="rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5 p-12 text-center">
              <Sparkles className="mx-auto h-12 w-12 text-[#D4A853]/30" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No presets found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {presets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  onClick={() => setSelectedPreset(preset)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Preset Detail Modal */}
      {selectedPreset && (
        <PresetModal
          preset={selectedPreset}
          onClose={() => setSelectedPreset(null)}
          onSelect={() => handleSelectPreset(selectedPreset)}
        />
      )}
    </div>
  )
}

// Preset Card Component
function PresetCard({ preset, onClick }: { preset: Preset; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="glass-card glass-card-hover group cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Preview */}
      <div className="relative aspect-video overflow-hidden bg-[#0c0c10]">
        {preset.preview_gif_url || preset.preview_url ? (
          <Image
            src={preset.preview_gif_url || preset.preview_url || ''}
            alt={preset.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Play className="h-8 w-8 text-[#D4A853]/30" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/80 via-transparent to-transparent" />
        
        {/* Featured Badge */}
        {preset.is_featured && (
          <div className="absolute right-2 top-2 rounded-full bg-[#D4A853]/20 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#D4A853] backdrop-blur-sm border border-[#D4A853]/20">
            TOP
          </div>
        )}
        
        {/* Premium Badge */}
        {preset.is_premium && (
          <div className="absolute left-2 top-2 rounded-full bg-[#00D4FF]/20 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#00D4FF] backdrop-blur-sm border border-[#00D4FF]/20">
            PRO
          </div>
        )}

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4A853]/90 backdrop-blur-sm">
            <Play className="h-6 w-6 text-[#050507]" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm line-clamp-1">
          {preset.name}
        </h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {preset.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-[#D4A853] text-[#D4A853]" />
              <span>{preset.rating.toFixed(1)}</span>
            </div>
          )}
          {preset.usage_count > 0 && (
            <span>• {preset.usage_count.toLocaleString()} uses</span>
          )}
        </div>
      </div>
    </div>
  )
}

// Preset Detail Modal
function PresetModal({
  preset,
  onClose,
  onSelect,
}: {
  preset: Preset
  onClose: () => void
  onSelect: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl border border-[#D4A853]/20 bg-[#0c0c10] p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground hover:bg-[#D4A853]/10 hover:text-foreground"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-foreground">{preset.name}</h2>
            {preset.description && (
              <p className="mt-2 text-sm text-muted-foreground">{preset.description}</p>
            )}
          </div>

          {/* Preview */}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-[#D4A853]/10">
            {preset.preview_gif_url || preset.preview_url ? (
              <Image
                src={preset.preview_gif_url || preset.preview_url || ''}
                alt={preset.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#050507]">
                <Play className="h-16 w-16 text-[#D4A853]/30" />
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-[#D4A853]/10 bg-[#D4A853]/5 p-4 text-sm">
            <div>
              <span className="text-muted-foreground">Category:</span>
              <span className="ml-2 font-medium text-foreground capitalize">{preset.category}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Rating:</span>
              <span className="ml-2 font-medium text-[#D4A853]">
                {preset.rating > 0 ? `${preset.rating.toFixed(1)} ⭐` : 'New'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Uses:</span>
              <span className="ml-2 font-medium text-foreground">{preset.usage_count.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Tier:</span>
              <span className="ml-2 font-medium text-foreground capitalize">{preset.min_tier}</span>
            </div>
          </div>

          {/* Tags */}
          {preset.tags && preset.tags.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {preset.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={onSelect}
            className="w-full rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-6 py-3.5 font-semibold text-[#050507] shadow-lg shadow-[#D4A853]/20 transition-all hover:shadow-[#D4A853]/30"
          >
            Use This Preset
          </button>
        </div>
      </div>
    </div>
  )
}
