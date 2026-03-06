"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import {
  ArrowLeft, Play, Sparkles, Clock, CheckCircle, XCircle,
  ZoomIn, Move, RotateCcw, MoveHorizontal, ArrowUp, ArrowDown,
  Circle, Target, Camera, Hand, CornerDownRight, ArrowRightCircle,
} from "lucide-react"

const cameraMotions = [
  { id: "zoom", icon: ZoomIn },
  { id: "pan", icon: MoveHorizontal },
  { id: "orbit", icon: RotateCcw },
  { id: "dolly", icon: Move },
  { id: "crane", icon: ArrowUp },
  { id: "tilt", icon: ArrowDown },
  { id: "static", icon: Circle },
  { id: "tracking", icon: Target },
  { id: "fpv", icon: Camera },
  { id: "handheld", icon: Hand },
  { id: "arc", icon: CornerDownRight },
  { id: "push", icon: ArrowRightCircle },
]

const durations = ["3s", "5s", "10s"]
const aspects = ["9:16", "1:1", "16:9"]

type VideoHistoryItem = {
  id: string
  thumbnail: string
  date: string
  status: "processing" | "completed" | "failed"
}

const mockHistory: VideoHistoryItem[] = [
  { id: "1", thumbnail: "/images/gallery-1.jpg", date: "2024-01-15", status: "completed" },
  { id: "2", thumbnail: "/images/gallery-2.jpg", date: "2024-01-14", status: "completed" },
  { id: "3", thumbnail: "/images/gallery-3.jpg", date: "2024-01-13", status: "processing" },
  { id: "4", thumbnail: "/images/gallery-4.jpg", date: "2024-01-12", status: "failed" },
]

function MotionButton({
  motion,
  active,
  onClick,
  label,
}: {
  motion: typeof cameraMotions[0]
  active: boolean
  onClick: () => void
  label: string
}) {
  const Icon = motion.icon
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all ${
        active
          ? "bg-[#D4A853] text-[#050507] shadow-lg shadow-[#D4A853]/20"
          : "border border-[#D4A853]/10 bg-[#D4A853]/5 text-muted-foreground hover:border-[#D4A853]/20 hover:text-foreground"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  )
}

function SegmentedButton({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5 p-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
            selected === opt
              ? "bg-[#D4A853] text-[#050507] shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: VideoHistoryItem["status"] }) {
  const { t } = useI18n()
  const config = {
    processing: { icon: Clock, color: "text-[#00D4FF]", bg: "bg-[#00D4FF]/10" },
    completed: { icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    failed: { icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
  }
  const { icon: Icon, color, bg } = config[status]
  return (
    <div className={`flex items-center gap-1 rounded-lg px-2 py-1 ${bg}`}>
      <Icon className={`h-3 w-3 ${color}`} />
      <span className={`text-[10px] font-medium ${color}`}>{t(`characterStudio.${status}`)}</span>
    </div>
  )
}

export function CharacterStudioContent({ characterId }: { characterId: string }) {
  const { t } = useI18n()
  const [prompt, setPrompt] = useState("")
  const [selectedMotion, setSelectedMotion] = useState("zoom")
  const [duration, setDuration] = useState("5s")
  const [aspect, setAspect] = useState("9:16")

  // Mock character data
  const character = {
    id: characterId,
    name: "Sophia",
    image: "/images/influencer-1.jpg",
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Left Panel - Controls */}
      <div className="flex w-full flex-col border-b border-[#D4A853]/5 bg-[#0c0c10]/50 p-6 lg:w-[320px] lg:border-b-0 lg:border-r">
        {/* Back link */}
        <Link
          href="/influencers"
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("influencersPage.title")}
        </Link>

        {/* Reference photo */}
        <div className="mb-6">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/40">
            {t("characterStudio.reference")}
          </label>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#D4A853]/10">
            <Image src={character.image} alt={character.name} fill className="object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050507]/80 to-transparent p-3">
              <span className="text-sm font-semibold text-foreground">{character.name}</span>
            </div>
          </div>
        </div>

        {/* Prompt */}
        <div className="mb-6">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/40">
            {t("characterStudio.prompt")}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t("characterStudio.promptPlaceholder")}
            rows={4}
            className="w-full resize-none rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#D4A853]/30 focus:outline-none"
          />
        </div>

        {/* Camera motion */}
        <div className="mb-6">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/40">
            {t("characterStudio.cameraMotion")}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {cameraMotions.map((motion) => (
              <MotionButton
                key={motion.id}
                motion={motion}
                active={selectedMotion === motion.id}
                onClick={() => setSelectedMotion(motion.id)}
                label={t(`characterStudio.${motion.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-6">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/40">
            {t("characterStudio.duration")}
          </label>
          <SegmentedButton options={durations} selected={duration} onChange={setDuration} />
        </div>

        {/* Aspect */}
        <div className="mb-6">
          <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/40">
            {t("characterStudio.aspect")}
          </label>
          <SegmentedButton options={aspects} selected={aspect} onChange={setAspect} />
        </div>

        {/* Generate button */}
        <button className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-6 py-3.5 text-sm font-semibold text-[#050507] shadow-lg shadow-[#D4A853]/15 transition-all hover:shadow-[#D4A853]/25">
          <Sparkles className="h-4 w-4" />
          {t("characterStudio.generate")}
        </button>
      </div>

      {/* Center - Video Preview */}
      <div className="flex flex-1 items-center justify-center bg-[#050507] p-6">
        <div
          className={`relative overflow-hidden rounded-2xl border border-[#D4A853]/10 bg-[#0c0c10] ${
            aspect === "9:16" ? "aspect-[9/16] max-h-[70vh]" : aspect === "1:1" ? "aspect-square max-h-[60vh]" : "aspect-video max-h-[50vh]"
          } w-full max-w-2xl`}
        >
          <Image src="/images/hero-bg.jpg" alt="Video preview" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#D4A853]/10 bg-[#050507]/50 backdrop-blur-xl">
              <Play className="h-10 w-10 text-[#D4A853]/40" />
            </div>
            <span className="text-sm text-muted-foreground">Your video will appear here</span>
          </div>
        </div>
      </div>

      {/* Right Panel - History */}
      <div className="hidden w-[280px] flex-col border-l border-[#D4A853]/5 bg-[#0c0c10]/50 p-6 xl:flex">
        <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/40">
          {t("characterStudio.history")}
        </h3>

        {mockHistory.length > 0 ? (
          <div className="flex flex-col gap-3 overflow-y-auto">
            {mockHistory.map((item) => (
              <div
                key={item.id}
                className="group flex gap-3 rounded-xl border border-[#D4A853]/5 bg-[#D4A853]/3 p-2 transition-all hover:border-[#D4A853]/15"
              >
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image src={item.thumbnail} alt="" fill className="object-cover" />
                  {item.status === "completed" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#050507]/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Play className="h-4 w-4 text-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <Clock className="mb-2 h-8 w-8 text-[#D4A853]/20" />
            <span className="text-sm text-muted-foreground">{t("characterStudio.noHistory")}</span>
          </div>
        )}
      </div>
    </div>
  )
}
