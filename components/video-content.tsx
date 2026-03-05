"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n"
import {
  Upload,
  Video,
  Plus,
  Search,
  ImageIcon,
  Play,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react"

const videoModels = [
  "Kling 3.0",
  "Kling 2.6",
  "Grok Imagine",
  "Sora 2",
  "Google Veo 3.1",
  "Wan 2.5",
]

const durations = ["4s", "6s", "10s", "15s"]
const aspects = ["16:9", "9:16", "1:1", "4:3"]
const qualityOptions = ["720p", "1080p", "2K", "4K"]

const presetCategories = [
  { id: "all", icon: Sparkles },
  { id: "trending", icon: TrendingUp },
  { id: "effects", icon: Zap },
]

const presets = [
  { name: "Zoom In", badge: "TOP", badgeColor: "from-[#f97316] to-[#ef4444]" },
  { name: "Dolly Out", badge: "TOP", badgeColor: "from-[#f97316] to-[#ef4444]" },
  { name: "Orbit Left", badge: null, badgeColor: "" },
  { name: "Crane Up", badge: "MIXED", badgeColor: "from-[#a855f7] to-[#7c3aed]" },
  { name: "Pan Right", badge: null, badgeColor: "" },
  { name: "Tilt Down", badge: "TOP", badgeColor: "from-[#f97316] to-[#ef4444]" },
  { name: "Steadicam", badge: null, badgeColor: "" },
  { name: "FPV Drone", badge: "MIXED", badgeColor: "from-[#a855f7] to-[#7c3aed]" },
  { name: "Whip Pan", badge: null, badgeColor: "" },
  { name: "Push In", badge: "TOP", badgeColor: "from-[#f97316] to-[#ef4444]" },
  { name: "Tracking Shot", badge: null, badgeColor: "" },
  { name: "Vertigo Effect", badge: "MIXED", badgeColor: "from-[#a855f7] to-[#7c3aed]" },
]

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
        {/* Start/End Frame */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("videoPage.startFrame")}
            </label>
            <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 transition-colors hover:border-white/20 cursor-pointer">
              <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                <Upload className="h-6 w-6 opacity-40" />
                <span className="text-xs">Upload</span>
              </div>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("videoPage.endFrame")}
            </label>
            <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 transition-colors hover:border-white/20 cursor-pointer">
              <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                <Upload className="h-6 w-6 opacity-40" />
                <span className="text-xs">Upload</span>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-shot */}
        <div>
          <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t("videoPage.multiShot")}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setShots(n)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  shots === n
                    ? "bg-[#14b8a6] text-white"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                }`}
              >
                {t("videoPage.shot")} {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col gap-6">
        {/* Preview */}
        <div className="flex aspect-video items-center justify-center rounded-2xl border border-white/5 bg-[#111827]/30">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Play className="h-12 w-12 opacity-20" />
          </div>
        </div>

        {/* Prompt */}
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t("videoPage.prompt")}
          rows={3}
          className="resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#14b8a6]/50 focus:outline-none"
        />
      </div>

      {/* Bottom controls */}
      <div className="col-span-1 lg:col-span-2">
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/5 bg-[#111827]/50 p-4">
          {/* Model */}
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">{t("videoPage.model")}</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground focus:outline-none"
            >
              {videoModels.map((m) => (
                <option key={m} value={m} className="bg-[#111827]">{m}</option>
              ))}
            </select>
          </div>
          {/* Duration */}
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">{t("videoPage.duration")}</label>
            <div className="flex gap-1">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    duration === d
                      ? "bg-[#14b8a6] text-white"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          {/* Aspect */}
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">{t("videoPage.aspect")}</label>
            <div className="flex gap-1">
              {aspects.map((a) => (
                <button
                  key={a}
                  onClick={() => setAspect(a)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    aspect === a
                      ? "bg-[#14b8a6] text-white"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          {/* Quality */}
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">{t("videoPage.qualityLabel")}</label>
            <div className="flex gap-1">
              {qualityOptions.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    quality === q
                      ? "bg-[#14b8a6] text-white"
                      : "bg-white/5 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
          {/* Generate */}
          <div className="ml-auto">
            <button className="rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] px-8 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#14b8a6]/25">
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
      {/* Upload area */}
      <div className="flex aspect-video max-h-[400px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 transition-colors hover:border-white/20 cursor-pointer">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Upload className="h-12 w-12 opacity-30" />
          <span className="text-sm">{t("videoPage.uploadVideo")}</span>
        </div>
      </div>

      {/* Image slots */}
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 cursor-pointer hover:border-white/20 transition-colors"
          >
            <Plus className="h-5 w-5 text-muted-foreground opacity-40" />
          </div>
        ))}
      </div>

      {/* Edit prompt */}
      <textarea
        placeholder={t("videoPage.editPrompt")}
        rows={3}
        className="resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#14b8a6]/50 focus:outline-none"
      />

      <button className="self-end rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] px-8 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#14b8a6]/25">
        {t("videoPage.generateVideo")}
      </button>
    </div>
  )
}

function MotionTab() {
  const { t } = useI18n()
  const [activeCategory, setActiveCategory] = useState("all")

  const categoryLabels: Record<string, string> = {
    all: t("videoPage.all"),
    trending: t("videoPage.trending"),
    effects: t("videoPage.effects"),
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("videoPage.search")}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#14b8a6]/50 focus:outline-none"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2">
        {presetCategories.map((cat) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-[#14b8a6] text-white"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {categoryLabels[cat.id]}
            </button>
          )
        })}
      </div>

      {/* Preset grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {presets.map((preset) => (
          <div
            key={preset.name}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-[#111827]/50 transition-all hover:-translate-y-0.5 hover:border-white/10"
          >
            <div className="aspect-video bg-gradient-to-br from-[#1e293b] to-[#0f172a]">
              <div className="flex h-full items-center justify-center">
                <Video className="h-8 w-8 text-muted-foreground opacity-20" />
              </div>
              {preset.badge && (
                <span
                  className={`absolute right-2 top-2 rounded bg-gradient-to-r ${preset.badgeColor} px-1.5 py-0.5 text-[10px] font-bold text-white`}
                >
                  {preset.badge}
                </span>
              )}
            </div>
            <div className="p-2.5">
              <span className="text-xs font-medium text-foreground">
                {preset.name}
              </span>
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
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      {/* Tabs */}
      <div className="mb-8 flex gap-1 rounded-xl bg-[#111827]/50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-[#14b8a6] text-white shadow-lg shadow-[#14b8a6]/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in">
        {activeTab === "create" && <CreateTab />}
        {activeTab === "edit" && <EditTab />}
        {activeTab === "motion" && <MotionTab />}
      </div>
    </div>
  )
}
