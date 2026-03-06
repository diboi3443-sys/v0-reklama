"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { ArrowLeft, ArrowRight, User, Sparkles, Cat, Check, Loader2 } from "lucide-react"

type CharacterType = "human" | "fantasy" | "animal" | "custom"

const typeIcons = {
  human: User,
  fantasy: Sparkles,
  animal: Cat,
  custom: Sparkles,
}

const hairColors = ["#1a1a1a", "#4a3728", "#8b4513", "#d4a853", "#e8c39e", "#c0c0c0", "#ff6b6b", "#00d4ff"]
const eyeColors = ["#4a3728", "#2e8b57", "#4169e1", "#808080", "#d4a853", "#00d4ff"]
const skinTones = ["#f5deb3", "#d2b48c", "#c19a6b", "#8b7355", "#6b4226", "#3d2314"]

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all ${
            i < current
              ? "w-8 bg-[#D4A853]"
              : i === current
              ? "w-8 bg-[#D4A853]/50"
              : "w-2 bg-[#D4A853]/20"
          }`}
        />
      ))}
    </div>
  )
}

function ColorPicker({
  colors,
  selected,
  onChange,
}: {
  colors: string[]
  selected: string
  onChange: (color: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onChange(color)}
          className={`h-8 w-8 rounded-full border-2 transition-all ${
            selected === color
              ? "border-[#D4A853] ring-2 ring-[#D4A853]/30"
              : "border-transparent hover:border-[#D4A853]/30"
          }`}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-[#D4A853] text-[#050507] shadow-lg shadow-[#D4A853]/20"
          : "border border-[#D4A853]/10 bg-[#D4A853]/5 text-muted-foreground hover:border-[#D4A853]/20 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  )
}

export function CharacterBuilderContent() {
  const { t } = useI18n()
  const [step, setStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null)

  // Form state
  const [name, setName] = useState("")
  const [type, setType] = useState<CharacterType>("human")
  const [gender, setGender] = useState("female")
  const [age, setAge] = useState(25)
  const [ethnicity, setEthnicity] = useState("")
  const [hairColor, setHairColor] = useState(hairColors[2])
  const [eyeColor, setEyeColor] = useState(eyeColors[2])
  const [skinTone, setSkinTone] = useState(skinTones[1])
  const [faceType, setFaceType] = useState("oval")
  const [bodyType, setBodyType] = useState("athletic")
  const [traits, setTraits] = useState<string[]>([])

  const ethnicityOptions = t("characterBuilder.ethnicityOptions").split(",")
  const types: CharacterType[] = ["human", "fantasy", "animal", "custom"]
  const genders = ["male", "female", "other"]
  const faceTypes = ["oval", "round", "square", "heart"]
  const bodyTypes = ["slim", "athletic", "curvy"]
  const traitOptions = ["tattoos", "glasses", "scars", "freckles"]

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  const toggleTrait = (trait: string) => {
    setTraits((prev) =>
      prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait]
    )
  }

  const variantImages = [
    "/images/influencer-1.jpg",
    "/images/influencer-5.jpg",
    "/images/influencer-2.jpg",
    "/images/influencer-6.jpg",
  ]

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/influencers"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
              {t("characterBuilder.title")}
            </h1>
          </div>
        </div>
        <StepIndicator current={step} total={3} />
      </div>

      {/* Step 1: Basic Info */}
      {step === 0 && (
        <div className="animate-fade-in space-y-8">
          <div className="glass-card rounded-2xl p-6">
            <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
              {t("characterBuilder.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("characterBuilder.namePlaceholder")}
              className="w-full rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-[#D4A853]/30 focus:outline-none"
            />
          </div>

          <div className="glass-card rounded-2xl p-6">
            <label className="mb-4 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
              {t("characterBuilder.type")}
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {types.map((t_type) => {
                const Icon = typeIcons[t_type]
                return (
                  <button
                    key={t_type}
                    onClick={() => setType(t_type)}
                    className={`flex flex-col items-center gap-3 rounded-xl p-4 transition-all ${
                      type === t_type
                        ? "border border-[#D4A853]/30 bg-[#D4A853]/10 text-[#D4A853]"
                        : "border border-[#D4A853]/10 bg-[#D4A853]/5 text-muted-foreground hover:border-[#D4A853]/20 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-8 w-8" />
                    <span className="text-sm font-medium">{t(`influencersPage.${t_type}`)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="glass-card rounded-2xl p-6">
              <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                {t("characterBuilder.gender")}
              </label>
              <div className="flex flex-wrap gap-2">
                {genders.map((g) => (
                  <OptionButton key={g} active={gender === g} onClick={() => setGender(g)}>
                    {t(`characterBuilder.${g}`)}
                  </OptionButton>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                {t("characterBuilder.age")}: {age}
              </label>
              <input
                type="range"
                min={18}
                max={60}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-[#D4A853]"
              />
            </div>

            <div className="glass-card rounded-2xl p-6">
              <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                {t("characterBuilder.ethnicity")}
              </label>
              <select
                value={ethnicity}
                onChange={(e) => setEthnicity(e.target.value)}
                className="w-full rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5 px-3 py-2.5 text-sm text-foreground focus:outline-none"
              >
                <option value="" className="bg-[#0c0c10]">—</option>
                {ethnicityOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#0c0c10]">{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Appearance */}
      {step === 1 && (
        <div className="animate-fade-in space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="glass-card rounded-2xl p-6">
              <label className="mb-4 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                {t("characterBuilder.hairColor")}
              </label>
              <ColorPicker colors={hairColors} selected={hairColor} onChange={setHairColor} />
            </div>
            <div className="glass-card rounded-2xl p-6">
              <label className="mb-4 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                {t("characterBuilder.eyeColor")}
              </label>
              <ColorPicker colors={eyeColors} selected={eyeColor} onChange={setEyeColor} />
            </div>
            <div className="glass-card rounded-2xl p-6">
              <label className="mb-4 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                {t("characterBuilder.skinTone")}
              </label>
              <ColorPicker colors={skinTones} selected={skinTone} onChange={setSkinTone} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="glass-card rounded-2xl p-6">
              <label className="mb-4 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                {t("characterBuilder.faceType")}
              </label>
              <div className="flex flex-wrap gap-2">
                {faceTypes.map((f) => (
                  <OptionButton key={f} active={faceType === f} onClick={() => setFaceType(f)}>
                    {t(`characterBuilder.${f}`)}
                  </OptionButton>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <label className="mb-4 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                {t("characterBuilder.bodyType")}
              </label>
              <div className="flex flex-wrap gap-2">
                {bodyTypes.map((b) => (
                  <OptionButton key={b} active={bodyType === b} onClick={() => setBodyType(b)}>
                    {t(`characterBuilder.${b}`)}
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <label className="mb-4 block text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
              {t("characterBuilder.specialTraits")}
            </label>
            <div className="flex flex-wrap gap-2">
              {traitOptions.map((trait) => (
                <button
                  key={trait}
                  onClick={() => toggleTrait(trait)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    traits.includes(trait)
                      ? "bg-[#D4A853] text-[#050507]"
                      : "border border-[#D4A853]/10 bg-[#D4A853]/5 text-muted-foreground hover:border-[#D4A853]/20"
                  }`}
                >
                  {traits.includes(trait) && <Check className="h-4 w-4" />}
                  {t(`characterBuilder.${trait}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Generate */}
      {step === 2 && (
        <div className="animate-fade-in space-y-8">
          {!isGenerating && selectedVariant === null && (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#D4A853]/10 bg-[#D4A853]/5">
                <Sparkles className="h-10 w-10 text-[#D4A853]/40" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{name || "Character"}</h3>
              <p className="mt-2 text-muted-foreground">
                {t(`influencersPage.${type}`)} • {t(`characterBuilder.${gender}`)} • {age}
              </p>
              <button
                onClick={handleGenerate}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-8 py-4 text-base font-semibold text-[#050507] shadow-lg shadow-[#D4A853]/15 transition-all hover:shadow-[#D4A853]/25"
              >
                <Sparkles className="h-5 w-5" />
                {t("characterBuilder.generateVariants")}
              </button>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center py-20 text-center">
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#D4A853]" />
              <p className="text-muted-foreground">{t("characterBuilder.creating")}</p>
            </div>
          )}

          {!isGenerating && selectedVariant === null && (
            <div className="grid grid-cols-2 gap-4">
              {variantImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedVariant(i)}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-[#D4A853]/10 transition-all hover:border-[#D4A853]/30"
                >
                  <Image src={img} alt={`Variant ${i + 1}`} fill className="object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="rounded-lg bg-[#D4A853] px-4 py-2 text-sm font-semibold text-[#050507]">
                      {t("characterBuilder.selectVariant")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedVariant !== null && (
            <div className="text-center">
              <div className="relative mx-auto mb-6 aspect-square max-w-md overflow-hidden rounded-2xl border border-[#D4A853]/20">
                <Image src={variantImages[selectedVariant]} alt="Selected" fill className="object-cover" />
              </div>
              <Link
                href={`/influencers/new/studio`}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-8 py-4 text-base font-semibold text-[#050507] shadow-lg shadow-[#D4A853]/15"
              >
                Open Studio
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground disabled:opacity-30"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("characterBuilder.back")}
        </button>
        {step < 2 && (
          <button
            onClick={() => setStep((s) => Math.min(2, s + 1))}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-5 py-2.5 text-sm font-semibold text-[#050507] shadow-lg shadow-[#D4A853]/15"
          >
            {t("characterBuilder.next")}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
