"use client"

import { useState } from "react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { Upload, Video, Plus, Search, Play, Sparkles, TrendingUp, Zap } from "lucide-react"

const videoModels = ["Kling 3.0", "Kling 2.6", "Grok Imagine", "Sora 2", "Google Veo 3.1", "Wan 2.5"]
const durations = ["4s", "6s", "10s", "15s"]
const aspects = ["16:9", "9:16", "1:1", "4:3"]
const qualityOptions = ["720p", "1080p", "2K", "4K"]

const presetCategories = [
  { id: "all", icon: Sparkles },
  { id: "trending", icon: TrendingUp },
  { id: "effects", icon: Zap },
]

const presets = [
  { name: "Zoom In", badge: "TOP", variant: "gold" as const, img: "/images/gallery-2.jpg" },
  { name: "Dolly Out", badge: "TOP", variant: "gold" as const, img: "/images/gallery-3.jpg" },
  { name: "Orbit Left", badge: null, variant: null, img: "/images/gallery-4.jpg" },
  { name: "Crane Up", badge: "MIXED", variant: "cyan" as const, img: "/images/model-sora.jpg" },
  { name: "Pan Right", badge: null, variant: null, img: "/images/gallery-5.jpg" },
  { name: "Tilt Down", badge: "TOP", variant: "gold" as const, img: "/images/gallery-6.jpg" },
  { name: "Steadicam", badge: null, variant: null, img: "/images/model-veo.jpg" },
  { name: "FPV Drone", badge: "MIXED", variant: "cyan" as const, img: "/images/gallery-7.jpg" },
  { name: "Whip Pan", badge: null, variant: null, img: "/images/gallery-8.jpg" },
  { name: "Push In", badge: "TOP", variant: "gold" as const, img: "/images/model-kling.jpg" },
  { name: "Tracking Shot", badge: null, variant: null, img: "/images/gallery-1.jpg" },
  { name: "Vertigo Effect", badge: "MIXED", variant: "cyan" as const, img: "/images/preset-thumb.jpg" },
]

function PillButton({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
        active
          ? "bg-[#FF6B00] text-[#050507] shadow-lg shadow-[#FF6B00]/20"
          : "border border-[#FF6B00]/5 bg-[#FF6B00]/3 text-muted-foreground hover:border-[#FF6B00]/15 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

function CreateTab() {
  const { t } = useI18n()
  const [model, setModel] = useState("Kling 3.0")
  const [duration, setDuration] = useState("6s")
  const [aspect, setAspect] = useState("16:9")
  const [quality, setQuality] = useState("1080p")
  const [prompt, setPrompt] = useState("")
  const [shots, setShots] = useState(1)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left panel */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: t("videoPage.startFrame"), img: "/images/gallery-1.jpg" },
            { label: t("videoPage.endFrame"), img: "/images/gallery-3.jpg" },
          ].map((frame) => (
            <div key={frame.label}>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#FF6B00]/50">{frame.label}</label>
              <div className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl border border-[#FF6B00]/10 transition-all hover:border-[#FF6B00]/20">
                <Image src={frame.img} alt={frame.label} fill className="object-cover opacity-60 transition-all group-hover:opacity-80 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/60 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-[#f0ece4]/40" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#FF6B00]/50">{t("videoPage.multiShot")}</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <PillButton key={n} active={shots === n} onClick={() => setShots(n)}>
                {t("videoPage.shot")} {n}
              </PillButton>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col gap-6">
        <div className="group relative aspect-video overflow-hidden rounded-2xl border border-[#FF6B00]/10">
          <Image src="/images/model-kling.jpg" alt="Video preview" fill className="object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/60 via-transparent to-[#050507]/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#f0ece4]/10 bg-[#050507]/50 backdrop-blur-xl transition-all group-hover:scale-110">
              <Play className="h-8 w-8 text-[#FF6B00]/60" />
            </div>
          </div>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t("videoPage.prompt")}
          rows={3}
          className="resize-none rounded-xl border border-[#FF6B00]/10 bg-[#FF6B00]/3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#FF6B00]/30 focus:outline-none transition-colors"
        />
      </div>

      {/* Bottom controls */}
      <div className="col-span-1 lg:col-span-2">
        <div className="glass-card flex flex-wrap items-center gap-4 rounded-xl p-5">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]/40">{t("videoPage.model")}</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="rounded-lg border border-[#FF6B00]/10 bg-[#FF6B00]/3 px-3 py-2 text-sm text-foreground focus:outline-none"
            >
              {videoModels.map((m) => (
                <option key={m} value={m} className="bg-[#0c0c10]">{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]/40">{t("videoPage.duration")}</label>
            <div className="flex gap-1">
              {durations.map((d) => <PillButton key={d} active={duration === d} onClick={() => setDuration(d)}>{d}</PillButton>)}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]/40">{t("videoPage.aspect")}</label>
            <div className="flex gap-1">
              {aspects.map((a) => <PillButton key={a} active={aspect === a} onClick={() => setAspect(a)}>{a}</PillButton>)}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#FF6B00]/40">{t("videoPage.qualityLabel")}</label>
            <div className="flex gap-1">
              {qualityOptions.map((q) => <PillButton key={q} active={quality === q} onClick={() => setQuality(q)}>{q}</PillButton>)}
            </div>
          </div>
          <div className="ml-auto">
            <button className="rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#E55A00] px-8 py-2.5 text-sm font-semibold text-[#050507] shadow-lg shadow-[#FF6B00]/15 transition-all hover:shadow-[#FF6B00]/25">
              {t("videoPage.generateVideo")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditTab() {
  const { t } = useI18n()
  const editImages = ["/images/gallery-5.jpg", "/images/gallery-6.jpg", "/images/gallery-7.jpg", "/images/gallery-8.jpg"]

  return (
    <div className="flex flex-col gap-6">
      <div className="group relative aspect-video max-h-[400px] cursor-pointer overflow-hidden rounded-2xl border border-[#FF6B00]/10 transition-all hover:border-[#FF6B00]/20">
        <Image src="/images/model-sora.jpg" alt="Upload area" fill className="object-cover opacity-40 transition-all group-hover:opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Upload className="h-12 w-12 text-[#FF6B00]/30" />
          <span className="text-sm font-medium text-[#f0ece4]/50">{t("videoPage.uploadVideo")}</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {editImages.map((img, i) => (
          <div key={i} className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-[#FF6B00]/10 transition-all hover:border-[#FF6B00]/20">
            <Image src={img} alt={`Reference ${i + 1}`} fill className="object-cover opacity-60 transition-all group-hover:opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Plus className="h-5 w-5 text-[#f0ece4]/30" />
            </div>
          </div>
        ))}
      </div>
      <textarea
        placeholder={t("videoPage.editPrompt")}
        rows={3}
        className="resize-none rounded-xl border border-[#FF6B00]/10 bg-[#FF6B00]/3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#FF6B00]/30 focus:outline-none"
      />
      <button className="self-end rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#E55A00] px-8 py-2.5 text-sm font-semibold text-[#050507] shadow-lg shadow-[#FF6B00]/15 transition-all hover:shadow-[#FF6B00]/25">
        {t("videoPage.generateVideo")}
      </button>
    </div>
  )
}

function MotionTab() {
  const { t } = useI18n()
  const [activeCategory, setActiveCategory] = useState("all")
  const categoryLabels: Record<string, string> = {
    all: t("videoPage.all"), trending: t("videoPage.trending"), effects: t("videoPage.effects"),
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF6B00]/30" />
        <input
          type="text"
          placeholder={t("videoPage.search")}
          className="w-full rounded-xl border border-[#FF6B00]/10 bg-[#FF6B00]/3 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#FF6B00]/30 focus:outline-none transition-colors"
        />
      </div>
      <div className="flex gap-2">
        {presetCategories.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? "bg-[#FF6B00] text-[#050507] shadow-lg shadow-[#FF6B00]/20"
                  : "border border-[#FF6B00]/5 bg-[#FF6B00]/3 text-muted-foreground hover:border-[#FF6B00]/15 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {categoryLabels[cat.id]}
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {presets.map((preset) => (
          <div
            key={preset.name}
            className="glass-card glass-card-hover group relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image src={preset.img} alt={preset.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/60 via-transparent to-transparent" />
              {preset.badge && (
                <span className={`absolute right-2 top-2 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                  preset.variant === "gold"
                    ? "bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/20"
                    : "bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/20"
                }`}>
                  {preset.badge}
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#050507]/50 backdrop-blur-sm">
                  <Play className="h-5 w-5 text-[#f0ece4]" />
                </div>
              </div>
            </div>
            <div className="p-2.5">
              <span className="text-xs font-medium text-foreground">{preset.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function VideoContent() {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState<"create" | "edit" | "motion">("create")

  const tabs = [
    { id: "create" as const, label: t("videoPage.createVideo") },
    { id: "edit" as const, label: t("videoPage.editVideo") },
    { id: "motion" as const, label: t("videoPage.motionControl") },
  ]

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-10">
      <div className="mb-10 flex gap-1 rounded-xl border border-[#FF6B00]/5 bg-[#0c0c10]/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#FF6B00] to-[#E55A00] text-[#050507] shadow-lg shadow-[#FF6B00]/15"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="animate-fade-in">
        {activeTab === "create" && <CreateTab />}
        {activeTab === "edit" && <EditTab />}
        {activeTab === "motion" && <MotionTab />}
      </div>
    </div>
  )
}
