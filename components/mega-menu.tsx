"use client"

import { useI18n } from "@/lib/i18n"
import {
  ImageIcon, Video, Mic2, Pencil, User, Sparkles, Palette, Wand2,
  ZoomIn, Copy, Camera, Volume2, Film, Layers, Scissors, SunMedium,
  Heart, Wind, Smile, Move, Users, Clapperboard, FileText, ArrowRight,
  Globe2, Languages, CircleDot,
} from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

type MegaItem = {
  icon: ReactNode
  title: string
  desc: string
  badge?: { text: string; variant: "gold" | "cyan" }
  href: string
}

function MenuItemCard({ item }: { item: MegaItem }) {
  return (
    <Link
      href={item.href}
      className="group flex gap-3 rounded-xl p-3 transition-all hover:bg-[#FF6B00]/5"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#FF6B00]/10 bg-[#FF6B00]/5 text-[#FF6B00] transition-colors group-hover:border-[#FF6B00]/20 group-hover:bg-[#FF6B00]/10">
        {item.icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground">{item.title}</span>
          {item.badge && (
            <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
              item.badge.variant === "gold"
                ? "bg-[#FF6B00]/15 text-[#FF6B00]"
                : "bg-[#00D4FF]/15 text-[#00D4FF]"
            }`}>
              {item.badge.text}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
      </div>
    </Link>
  )
}

function MenuSection({ title, items }: { title: string; items: MegaItem[] }) {
  return (
    <div>
      <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF6B00]/40">
        {title}
      </h4>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => <MenuItemCard key={item.title} item={item} />)}
      </div>
    </div>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-[#FF6B00]/5 hover:text-foreground"
    >
      <ArrowRight className="h-3 w-3 text-[#FF6B00]/40" />
      {label}
    </Link>
  )
}

const badgeNew = (text: string) => ({ text, variant: "gold" as const })
const badgePopular = (text: string) => ({ text, variant: "cyan" as const })

export function ImageMegaMenu() {
  const { t } = useI18n()
  const b = t("badges.new")
  const bp = t("badges.popular")

  const models: MegaItem[] = [
    { icon: <Sparkles className="h-5 w-5" />, title: t("megaImage.nanoBanana2"), desc: t("megaImage.nanoBanana2Desc"), badge: badgeNew(b), href: "/image" },
    { icon: <ImageIcon className="h-5 w-5" />, title: t("megaImage.nanoBananaPro"), desc: t("megaImage.nanoBananaProDesc"), badge: badgePopular(bp), href: "/image" },
    { icon: <User className="h-5 w-5" />, title: t("megaImage.soul2"), desc: t("megaImage.soul2Desc"), badge: badgeNew(b), href: "/image" },
    { icon: <Wand2 className="h-5 w-5" />, title: t("megaImage.flux2Pro"), desc: t("megaImage.flux2ProDesc"), href: "/image" },
    { icon: <Palette className="h-5 w-5" />, title: t("megaImage.seedream5"), desc: t("megaImage.seedream5Desc"), href: "/image" },
  ]
  const features: MegaItem[] = [
    { icon: <Layers className="h-5 w-5" />, title: t("megaImage.soulMoodboard"), desc: t("megaImage.soulMoodboardDesc"), href: "/image" },
    { icon: <Palette className="h-5 w-5" />, title: t("megaImage.soulHex"), desc: t("megaImage.soulHexDesc"), badge: badgeNew(b), href: "/image" },
    { icon: <Pencil className="h-5 w-5" />, title: t("megaImage.brushEdit"), desc: t("megaImage.brushEditDesc"), href: "/image" },
    { icon: <ZoomIn className="h-5 w-5" />, title: t("megaImage.upscale"), desc: t("megaImage.upscaleDesc"), href: "/image" },
    { icon: <Copy className="h-5 w-5" />, title: t("megaImage.styleCopy"), desc: t("megaImage.styleCopyDesc"), href: "/image" },
  ]

  return (
    <div className="animate-mega-menu absolute left-1/2 top-full z-50 mt-2 w-[920px] -translate-x-1/2 rounded-2xl border border-[#FF6B00]/10 bg-[#0c0c10]/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl">
      <div className="grid grid-cols-3 gap-6">
        <MenuSection title={t("mega.models")} items={models} />
        <MenuSection title={t("mega.features")} items={features} />
        <div>
          <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF6B00]/40">{t("mega.quickLinks")}</h4>
          <div className="flex flex-col gap-0.5">
            <QuickLink href="/image" label={t("megaImage.photodump")} />
            <QuickLink href="/image" label={t("nav.moodboard")} />
            <QuickLink href="/image" label={t("megaImage.community")} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function VideoMegaMenu() {
  const { t } = useI18n()
  const b = t("badges.new")
  const bp = t("badges.popular")

  const models: MegaItem[] = [
    { icon: <Video className="h-5 w-5" />, title: t("megaVideo.kling3"), desc: t("megaVideo.kling3Desc"), badge: badgePopular(bp), href: "/create/video" },
    { icon: <Film className="h-5 w-5" />, title: t("megaVideo.kling26"), desc: t("megaVideo.kling26Desc"), badge: badgeNew(b), href: "/create/video" },
    { icon: <Sparkles className="h-5 w-5" />, title: t("megaVideo.grokImagine"), desc: t("megaVideo.grokImagineDesc"), href: "/create/video" },
    { icon: <CircleDot className="h-5 w-5" />, title: t("megaVideo.sora2"), desc: t("megaVideo.sora2Desc"), href: "/create/video" },
    { icon: <Globe2 className="h-5 w-5" />, title: t("megaVideo.veo31"), desc: t("megaVideo.veo31Desc"), href: "/create/video" },
    { icon: <Clapperboard className="h-5 w-5" />, title: t("megaVideo.wan25"), desc: t("megaVideo.wan25Desc"), href: "/create/video" },
  ]
  const features: MegaItem[] = [
    { icon: <Move className="h-5 w-5" />, title: t("megaVideo.motionControl"), desc: t("megaVideo.motionControlDesc"), href: "/create/video" },
    { icon: <Volume2 className="h-5 w-5" />, title: t("megaVideo.nativeAudio"), desc: t("megaVideo.nativeAudioDesc"), badge: badgeNew(b), href: "/create/video" },
    { icon: <Layers className="h-5 w-5" />, title: t("megaVideo.multiShot"), desc: t("megaVideo.multiShotDesc"), href: "/create/video" },
    { icon: <Sparkles className="h-5 w-5" />, title: t("megaVideo.vfxEffects"), desc: t("megaVideo.vfxEffectsDesc"), href: "/create/video" },
    { icon: <Film className="h-5 w-5" />, title: t("megaVideo.transitions"), desc: t("megaVideo.transitionsDesc"), href: "/create/video" },
  ]

  return (
    <div className="animate-mega-menu absolute left-1/2 top-full z-50 mt-2 w-[920px] -translate-x-1/2 rounded-2xl border border-[#FF6B00]/10 bg-[#0c0c10]/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl">
      <div className="grid grid-cols-3 gap-6">
        <MenuSection title={t("mega.models")} items={models} />
        <MenuSection title={t("mega.features")} items={features} />
        <div>
          <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF6B00]/40">{t("mega.quickLinks")}</h4>
          <div className="flex flex-col gap-0.5">
            <QuickLink href="/create/video" label={t("megaVideo.cinemaStudio")} />
            <QuickLink href="/create/video" label={t("megaVideo.motionControl")} />
            <QuickLink href="/create/video" label={t("megaVideo.multiShot")} />
            <QuickLink href="/create/video" label={t("megaVideo.templates")} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function AudioMegaMenu() {
  const { t } = useI18n()
  const b = t("badges.new")

  const voiceCloning: MegaItem[] = [
    { icon: <Mic2 className="h-5 w-5" />, title: t("megaAudio.elevenLabs"), desc: t("megaAudio.elevenLabsDesc"), href: "#" },
    { icon: <Volume2 className="h-5 w-5" />, title: t("megaAudio.vibeVoice"), desc: t("megaAudio.vibeVoiceDesc"), badge: badgeNew(b), href: "#" },
  ]
  const synthesis: MegaItem[] = [
    { icon: <Languages className="h-5 w-5" />, title: t("megaAudio.multilingual"), desc: t("megaAudio.multilingualDesc"), href: "#" },
    { icon: <FileText className="h-5 w-5" />, title: t("megaAudio.tts"), desc: t("megaAudio.ttsDesc"), href: "#" },
    { icon: <Globe2 className="h-5 w-5" />, title: t("megaAudio.localization"), desc: t("megaAudio.localizationDesc"), href: "#" },
    { icon: <Mic2 className="h-5 w-5" />, title: t("megaAudio.dubbing"), desc: t("megaAudio.dubbingDesc"), href: "#" },
  ]

  return (
    <div className="animate-mega-menu absolute left-1/2 top-full z-50 mt-2 w-[700px] -translate-x-1/2 rounded-2xl border border-[#FF6B00]/10 bg-[#0c0c10]/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl">
      <div className="grid grid-cols-2 gap-6">
        <MenuSection title={t("mega.voiceCloning")} items={voiceCloning} />
        <MenuSection title={t("mega.synthesis")} items={synthesis} />
      </div>
    </div>
  )
}

export function EditMegaMenu() {
  const { t } = useI18n()
  const bp = t("badges.popular")

  const faceIdentity: MegaItem[] = [
    { icon: <Smile className="h-5 w-5" />, title: t("megaEdit.faceSwap"), desc: t("megaEdit.faceSwapDesc"), badge: badgePopular(bp), href: "#" },
    { icon: <Mic2 className="h-5 w-5" />, title: t("megaEdit.lipsync"), desc: t("megaEdit.lipsyncDesc"), href: "#" },
    { icon: <User className="h-5 w-5" />, title: t("megaEdit.soulId"), desc: t("megaEdit.soulIdDesc"), href: "#" },
  ]
  const videoEditing: MegaItem[] = [
    { icon: <Pencil className="h-5 w-5" />, title: t("megaEdit.inpaint"), desc: t("megaEdit.inpaintDesc"), href: "#" },
    { icon: <Scissors className="h-5 w-5" />, title: t("megaEdit.videoEdit"), desc: t("megaEdit.videoEditDesc"), href: "#" },
    { icon: <Film className="h-5 w-5" />, title: t("megaEdit.recast"), desc: t("megaEdit.recastDesc"), href: "#" },
  ]
  const imageEditing: MegaItem[] = [
    { icon: <SunMedium className="h-5 w-5" />, title: t("megaEdit.relight"), desc: t("megaEdit.relightDesc"), href: "#" },
    { icon: <Heart className="h-5 w-5" />, title: t("megaEdit.skinEnhancer"), desc: t("megaEdit.skinEnhancerDesc"), href: "#" },
    { icon: <Wind className="h-5 w-5" />, title: t("megaEdit.atmosphere"), desc: t("megaEdit.atmosphereDesc"), href: "#" },
  ]

  return (
    <div className="animate-mega-menu absolute left-1/2 top-full z-50 mt-2 w-[920px] -translate-x-1/2 rounded-2xl border border-[#FF6B00]/10 bg-[#0c0c10]/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl">
      <div className="grid grid-cols-3 gap-6">
        <MenuSection title={t("mega.faceIdentity")} items={faceIdentity} />
        <MenuSection title={t("mega.videoEditing")} items={videoEditing} />
        <MenuSection title={t("mega.imageEditing")} items={imageEditing} />
      </div>
    </div>
  )
}

export function CharacterMegaMenu() {
  const { t } = useI18n()
  const b = t("badges.new")

  const items: MegaItem[] = [
    { icon: <User className="h-5 w-5" />, title: t("megaCharacter.soulId"), desc: t("megaCharacter.soulIdDesc"), href: "/influencers" },
    { icon: <Sparkles className="h-5 w-5" />, title: t("megaCharacter.soul2"), desc: t("megaCharacter.soul2Desc"), badge: badgeNew(b), href: "/influencers" },
    { icon: <Users className="h-5 w-5" />, title: t("megaCharacter.aiInfluencer"), desc: t("megaCharacter.aiInfluencerDesc"), badge: badgeNew(b), href: "/influencers" },
    { icon: <Move className="h-5 w-5" />, title: t("megaCharacter.motionTransfer"), desc: t("megaCharacter.motionTransferDesc"), href: "/influencers" },
    { icon: <Camera className="h-5 w-5" />, title: t("megaCharacter.photodump"), desc: t("megaCharacter.photodumpDesc"), href: "/influencers" },
    { icon: <Wand2 className="h-5 w-5" />, title: t("megaCharacter.charGenerator"), desc: t("megaCharacter.charGeneratorDesc"), href: "/influencers/create" },
  ]

  return (
    <div className="animate-mega-menu absolute left-1/2 top-full z-50 mt-2 w-[480px] -translate-x-1/2 rounded-2xl border border-[#FF6B00]/10 bg-[#0c0c10]/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl">
      <div className="grid grid-cols-1 gap-0.5">
        {items.map((item) => <MenuItemCard key={item.title} item={item} />)}
      </div>
    </div>
  )
}
