"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ImageIcon, Video, Mic2, Pencil, User, ArrowRight, Play, Sparkles, Zap
} from "lucide-react"
import { useI18n } from "@/lib/i18n"

/* ─── Hero ─── */
function HeroSection() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden py-28 md:py-40">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-[#050507]/60 to-[#050507]" />
      </div>

      {/* Animated orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float absolute left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-[#D4A853]/4 blur-[150px]" />
        <div className="animate-float-delayed absolute right-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-[#00D4FF]/4 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#D4A853]/15 bg-[#D4A853]/5 px-5 py-2 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#D4A853] animate-pulse-glow" />
          <span className="text-[13px] font-medium text-[#D4A853]/80">Cinema Studio 2.0</span>
        </div>

        {/* Title */}
        <h1 className="text-balance font-serif text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl">
          <span className="text-gold-gradient">{t("hero.title")}</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-[#f0ece4]/40 md:text-xl">
          {t("hero.subtitle")}
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/image"
            className="group flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-10 py-4 text-base font-semibold text-[#050507] shadow-2xl shadow-[#D4A853]/15 transition-all hover:shadow-[#D4A853]/30"
          >
            {t("hero.ctaPrimary")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#"
            className="group flex items-center gap-2.5 rounded-2xl border border-[#f0ece4]/10 bg-[#f0ece4]/5 px-10 py-4 text-base font-semibold text-[#f0ece4]/80 backdrop-blur-sm transition-all hover:border-[#f0ece4]/20 hover:bg-[#f0ece4]/10"
          >
            <Play className="h-4 w-4 text-[#00D4FF]" />
            {t("hero.ctaSecondary")}
          </Link>
        </div>

        {/* Stats bar */}
        <div className="mx-auto mt-16 flex max-w-xl items-center justify-center gap-8 md:gap-12">
          {[
            { value: "10M+", label: "Creators" },
            { value: "50+", label: "AI Models" },
            { value: "8K", label: "Max Quality" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-[#D4A853] md:text-3xl">{stat.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Tools ─── */
const toolIcons = { image: ImageIcon, video: Video, audio: Mic2, edit: Pencil, soulId: User }
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
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4A853]/50">Creative Suite</p>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-5xl text-balance">
            {t("tools.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-pretty leading-relaxed">{t("tools.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tools.map((tool, i) => {
            const Icon = toolIcons[tool.key]
            return (
              <Link
                key={tool.key}
                href={toolHrefs[i]}
                className="glass-card glass-card-hover group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#D4A853]/0 to-[#D4A853]/0 transition-all duration-300 group-hover:from-[#D4A853]/3 group-hover:to-transparent" />
                <div className="relative">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5 text-[#D4A853] transition-colors group-hover:border-[#D4A853]/20 group-hover:bg-[#D4A853]/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{tool.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Models ─── */
const featuredModels = [
  { name: "Kling 3.0", tag: "Video", color: "gold" },
  { name: "Nano Banana 2", tag: "Image", color: "cyan" },
  { name: "Sora 2", tag: "Video", color: "gold" },
  { name: "Soul 2.0", tag: "Character", color: "cyan" },
  { name: "Google Veo 3.1", tag: "Video", color: "gold" },
  { name: "Seedream 5.0", tag: "Image", color: "cyan" },
]

function ModelsSection() {
  const { t } = useI18n()
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#00D4FF]/50">Powered by AI</p>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-5xl text-balance">{t("models.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-pretty leading-relaxed">{t("models.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredModels.map((model) => (
            <div
              key={model.name}
              className="glass-card glass-card-hover group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-video w-full bg-gradient-to-br from-[#0c0c10] to-[#161619]">
                <div className="flex h-full items-center justify-center">
                  <div className={`rounded-full p-5 ${
                    model.color === "gold"
                      ? "bg-[#D4A853]/10 text-[#D4A853]"
                      : "bg-[#00D4FF]/10 text-[#00D4FF]"
                  }`}>
                    {model.tag === "Video" ? <Video className="h-8 w-8" /> :
                     model.tag === "Character" ? <User className="h-8 w-8" /> :
                     <ImageIcon className="h-8 w-8" />}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{model.name}</h3>
                  <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    model.color === "gold"
                      ? "bg-[#D4A853]/10 text-[#D4A853]"
                      : "bg-[#00D4FF]/10 text-[#00D4FF]"
                  }`}>
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

/* ─── Gallery ─── */
function GallerySection() {
  const { t } = useI18n()
  const images = [
    "/images/gallery-1.jpg",
    "/images/gallery-2.jpg",
    "/images/gallery-3.jpg",
    "/images/gallery-4.jpg",
  ]

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4A853]/50">Showcase</p>
          <h2 className="font-serif text-3xl font-bold text-foreground md:text-5xl text-balance">{t("gallery.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-pretty leading-relaxed">{t("gallery.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-[#D4A853]/5 transition-all duration-300 hover:border-[#D4A853]/15"
            >
              <Image
                src={src}
                alt={`AI generated artwork ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
          {/* Extra placeholder slots */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className="glass-card group aspect-square overflow-hidden rounded-2xl"
            >
              <div className="flex h-full items-center justify-center">
                <Sparkles className="h-6 w-6 text-[#D4A853]/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ─── */
function CtaSection() {
  const { t } = useI18n()
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-[#D4A853]/10 bg-gradient-to-b from-[#0c0c10] to-[#050507] px-8 py-16 text-center md:px-16 md:py-24">
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[300px] w-[400px] -translate-x-1/2 rounded-full bg-[#D4A853]/5 blur-[100px]" />
          </div>

          <div className="relative">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4A853]/10 bg-[#D4A853]/5">
              <Zap className="h-8 w-8 text-[#D4A853]" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-5xl text-balance">{t("cta.title")}</h2>
            <p className="mx-auto mt-5 max-w-lg text-muted-foreground text-pretty leading-relaxed">{t("cta.subtitle")}</p>
            <Link
              href="/auth/sign-in"
              className="mt-10 inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-10 py-4 text-base font-semibold text-[#050507] shadow-2xl shadow-[#D4A853]/15 transition-all hover:shadow-[#D4A853]/30"
            >
              {t("cta.button")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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
