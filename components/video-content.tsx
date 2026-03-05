"use client"

import { useState } from "react"
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
  { name: "Zoom In", badge: "TOP", variant: "gold" as const },
  { name: "Dolly Out", badge: "TOP", variant: "gold" as const },
  { name: "Orbit Left", badge: null, variant: null },
  { name: "Crane Up", badge: "MIXED", variant: "cyan" as const },
  { name: "Pan Right", badge: null, variant: null },
  { name: "Tilt Down", badge: "TOP", variant: "gold" as const },
  { name: "Steadicam", badge: null, variant: null },
  { name: "FPV Drone", badge: "MIXED", variant: "cyan" as const },
  { name: "Whip Pan", badge: null, variant: null },
  { name: "Push In", badge: "TOP", variant: "gold" as const },
  { name: "Tracking Shot", badge: null, variant: null },
  { name: "Vertigo Effect", badge: "MIXED", variant: "cyan" as const },
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
          ? "bg-[#D4A853] text-[#050507] shadow-lg shadow-[#D4A853]/20"
          : "border border-[#D4A853]/5 bg-[#D4A853]/3 text-muted-foreground hover:border-[#D4A853]/15 hover:text-foreground"
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
          {[t("videoPage.startFrame"), t("videoPage.endFrame")].map((label) => (
            <div key={label}>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">{label}</label>
              <div className="glass-card glass-card-hover flex aspect-video cursor-pointer items-center justify-center rounded-xl transition-all">
                <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                  <Upload className="h-6 w-6 text-[#D4A853]/20" />
                  <span className="text-xs text-[#D4A853]/30">Upload</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">{t("videoPage.multiShot")}</label>
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
        <div className="glass-card flex aspect-video items-center justify-center rounded-2xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4A853]/10 bg-[#D4A853]/5">
            <Play className="h-8 w-8 text-[#D4A853]/30" />
          </div>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t("videoPage.prompt")}
          rows={3}
          className="resize-none rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#D4A853]/30 focus:outline-none transition-colors"
        />
      </div>

      {/* Bottom controls */}
      <div className="col-span-1 lg:col-span-2">
        <div className="glass-card flex flex-wrap items-center gap-4 rounded-xl p-5">
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#D4A853]/40">{t("videoPage.model")}</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="rounded-lg border border-[#D4A853]/10 bg-[#D4A853]/3 px-3 py-2 text-sm text-foreground focus:outline-none"
            >
              {videoModels.map((m) => (
                <option key={m} value={m} className="bg-[#0c0c10]">{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#D4A853]/40">{t("videoPage.duration")}</label>
            <div className="flex gap-1">
              {durations.map((d) => <PillButton key={d} active={duration === d} onClick={() => setDuration(d)}>{d}</PillButton>)}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#D4A853]/40">{t("videoPage.aspect")}</label>
            <div className="flex gap-1">
              {aspects.map((a) => <PillButton key={a} active={aspect === a} onClick={() => setAspect(a)}>{a}</PillButton>)}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#D4A853]/40">{t("videoPage.qualityLabel")}</label>
            <div className="flex gap-1">
              {qualityOptions.map((q) => <PillButton key={q} active={quality === q} onClick={() => setQuality(q)}>{q}</PillButton>)}
            </div>
          </div>
          <div className="ml-auto">
            <button className="rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-8 py-2.5 text-sm font-semibold text-[#050507] shadow-lg shadow-[#D4A853]/15 transition-all hover:shadow-[#D4A853]/25">
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
  return (
    <div className="flex flex-col gap-6">
      <div className="glass-card glass-card-hover flex aspect-video max-h-[400px] cursor-pointer items-center justify-center rounded-2xl transition-all">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Upload className="h-12 w-12 text-[#D4A853]/20" />
          <span className="text-sm text-[#D4A853]/30">{t("videoPage.uploadVideo")}</span>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card glass-card-hover flex aspect-square cursor-pointer items-center justify-center rounded-xl transition-all">
            <Plus className="h-5 w-5 text-[#D4A853]/20" />
          </div>
        ))}
      </div>
      <textarea
        placeholder={t("videoPage.editPrompt")}
        rows={3}
        className="resize-none rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#D4A853]/30 focus:outline-none"
      />
      <button className="self-end rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-8 py-2.5 text-sm font-semibold text-[#050507] shadow-lg shadow-[#D4A853]/15 transition-all hover:shadow-[#D4A853]/25">
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
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D4A853]/30" />
        <input
          type="text"
          placeholder={t("videoPage.search")}
          className="w-full rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/3 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#D4A853]/30 focus:outline-none transition-colors"
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
                  ? "bg-[#D4A853] text-[#050507] shadow-lg shadow-[#D4A853]/20"
                  : "border border-[#D4A853]/5 bg-[#D4A853]/3 text-muted-foreground hover:border-[#D4A853]/15 hover:text-foreground"
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
            <div className="aspect-video bg-gradient-to-br from-[#0c0c10] to-[#161619]">
              <div className="flex h-full items-center justify-center">
                <Video className="h-8 w-8 text-[#D4A853]/10" />
              </div>
              {preset.badge && (
                <span className={`absolute right-2 top-2 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  preset.variant === "gold"
                    ? "bg-[#D4A853]/15 text-[#D4A853]"
                    : "bg-[#00D4FF]/15 text-[#00D4FF]"
                }`}>
                  {preset.badge}
                </span>
              )}
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
      {/* Tabs */}
      <div className="mb-10 flex gap-1 rounded-xl border border-[#D4A853]/5 bg-[#0c0c10]/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#D4A853] to-[#B8922F] text-[#050507] shadow-lg shadow-[#D4A853]/15"
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
