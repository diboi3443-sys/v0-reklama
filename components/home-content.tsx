"use client"

import Link from "next/link"
import {
  ImageIcon,
  Video,
  Mic2,
  Pencil,
  User,
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  Star,
} from "lucide-react"
import { useI18n } from "@/lib/i18n"

function HeroSection() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#14b8a6]/5 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-[#f97316]/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-[#14b8a6]" />
          <span>{"Cinema Studio 2.0"}</span>
        </div>
        <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          <span className="bg-gradient-to-r from-[#14b8a6] via-[#3b82f6] to-[#f97316] bg-clip-text text-transparent">
            {t("hero.title")}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          {t("hero.subtitle")}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/image"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] px-8 py-3.5 text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#14b8a6]/25"
          >
            {t("hero.ctaPrimary")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] px-8 py-3.5 text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#f97316]/25"
          >
            <Play className="h-4 w-4" />
            {t("hero.ctaSecondary")}
          </Link>
        </div>
      </div>
    </section>
  )
}

const toolIcons = {
  image: ImageIcon,
  video: Video,
  audio: Mic2,
  edit: Pencil,
  soulId: User,
}

const toolGradients = [
  "from-[#14b8a6] to-[#0d9488]",
  "from-[#3b82f6] to-[#2563eb]",
  "from-[#f97316] to-[#ea580c]",
  "from-[#a855f7] to-[#7c3aed]",
  "from-[#ec4899] to-[#db2777]",
]

const toolHrefs = ["/image", "/create/video", "#", "#", "#"]

function ToolsSection() {
  const { t } = useI18n()
  const tools = [
    { key: "image" as const, title: t("tools.image"), desc: t("tools.imageDesc") },
    { key: "video" as const, title: t("tools.video"), desc: t("tools.videoDesc") },
    { key: "audio" as const, title: t("tools.audio"), desc: t("tools.audioDesc") },
    { key: "edit" as const, title: t("tools.edit"), desc: t("tools.editDesc") },
    { key: "soulId" as const, title: t("tools.soulId"), desc: t("tools.soulIdDesc") },
  ]

  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t("tools.title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            {t("tools.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tools.map((tool, i) => {
            const Icon = toolIcons[tool.key]
            return (
              <Link
                key={tool.key}
                href={toolHrefs[i]}
                className="group rounded-2xl border border-white/5 bg-[#111827]/50 p-6 transition-all hover:-translate-y-1 hover:border-[#14b8a6]/30 hover:bg-[#111827]"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${toolGradients[i]} text-white`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {tool.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tool.desc}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const featuredModels = [
  { name: "Kling 3.0", tag: "Video", color: "from-[#f97316] to-[#ef4444]" },
  { name: "Nano Banana 2", tag: "Image", color: "from-[#14b8a6] to-[#3b82f6]" },
  { name: "Sora 2", tag: "Video", color: "from-[#a855f7] to-[#7c3aed]" },
  { name: "Soul 2.0", tag: "Character", color: "from-[#ec4899] to-[#db2777]" },
  { name: "Google Veo 3.1", tag: "Video", color: "from-[#3b82f6] to-[#2563eb]" },
  { name: "Seedream 5.0", tag: "Image", color: "from-[#14b8a6] to-[#0d9488]" },
]

function ModelsSection() {
  const { t } = useI18n()
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t("models.title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            {t("models.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredModels.map((model) => (
            <div
              key={model.name}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#111827]/50 transition-all hover:-translate-y-1 hover:border-white/10"
            >
              <div className="aspect-video w-full bg-gradient-to-br from-[#1e293b] to-[#0f172a]">
                <div className="flex h-full items-center justify-center">
                  <div className={`rounded-full bg-gradient-to-r ${model.color} p-4`}>
                    {model.tag === "Video" ? (
                      <Video className="h-8 w-8 text-white" />
                    ) : model.tag === "Character" ? (
                      <User className="h-8 w-8 text-white" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-white" />
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{model.name}</h3>
                  <span
                    className={`rounded-full bg-gradient-to-r ${model.color} px-2.5 py-0.5 text-xs font-semibold text-white`}
                  >
                    {model.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function GallerySection() {
  const { t } = useI18n()
  const placeholders = Array.from({ length: 8 }, (_, i) => i)

  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1400px] px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t("gallery.title")}
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            {t("gallery.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {placeholders.map((i) => (
            <div
              key={i}
              className="group aspect-square overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-[#1e293b] to-[#0f172a] transition-all hover:border-white/10"
            >
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Star className="h-6 w-6 opacity-30" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  const { t } = useI18n()
  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-[#111827] to-[#0a0f1a] p-12 md:p-16">
          <Zap className="mx-auto mb-6 h-12 w-12 text-[#14b8a6]" />
          <h2 className="text-3xl font-bold text-foreground md:text-4xl text-balance">
            {t("cta.title")}
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            {t("cta.subtitle")}
          </p>
          <Link
            href="/auth/sign-in"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] px-8 py-3.5 text-base font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#14b8a6]/25"
          >
            {t("cta.button")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function HomeContent() {
  return (
    <>
      <HeroSection />
      <ToolsSection />
      <ModelsSection />
      <GallerySection />
      <CtaSection />
    </>
  )
}
