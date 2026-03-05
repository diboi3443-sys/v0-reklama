"use client"

import { useState } from "react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { Sparkles, User, Wand2, Palette, Check, Plus, ImageIcon } from "lucide-react"

const models = [
  { id: "nanoBanana2", icon: Sparkles, tag: "gold" as const, img: "/images/model-nano.jpg" },
  { id: "soul2", icon: User, tag: "cyan" as const, img: "/images/model-soul.jpg" },
  { id: "flux2Pro", icon: Wand2, tag: "gold" as const, img: "/images/model-sora.jpg" },
  { id: "seedream5", icon: Palette, tag: "cyan" as const, img: "/images/model-seedream.jpg" },
]

const aspects = ["1:1", "3:4", "4:3", "16:9", "9:16", "21:9"]
const qualities = ["1K", "2K", "4K"]

export function ImageContent() {
  const { t } = useI18n()
  const [selectedModel, setSelectedModel] = useState("nanoBanana2")
  const [selectedAspect, setSelectedAspect] = useState("1:1")
  const [selectedQuality, setSelectedQuality] = useState("2K")
  const [numImages, setNumImages] = useState(1)
  const [prompt, setPrompt] = useState("")
  const [enhance, setEnhance] = useState(false)

  const activeModel = models.find((m) => m.id === selectedModel)

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full border-b border-[#D4A853]/5 bg-[#08080b] p-5 lg:w-[320px] lg:border-b-0 lg:border-r lg:overflow-y-auto">
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
          {t("imagePage.selectModel")}
        </h3>
        <div className="flex flex-col gap-2">
          {models.map((model) => {
            const Icon = model.icon
            const isActive = selectedModel === model.id
            return (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`flex items-center gap-3 rounded-xl border p-2.5 transition-all ${
                  isActive
                    ? "border-[#D4A853]/30 bg-[#D4A853]/5 shadow-lg shadow-[#D4A853]/5"
                    : "border-[#D4A853]/5 hover:border-[#D4A853]/15 hover:bg-[#D4A853]/3"
                }`}
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                  <Image src={model.img} alt={t(`megaImage.${model.id}`)} fill className="object-cover" />
                </div>
                <div className="min-w-0 text-left">
                  <span className="text-sm font-medium text-foreground">{t(`megaImage.${model.id}`)}</span>
                  <p className="truncate text-xs text-muted-foreground">{t(`megaImage.${model.id}Desc`)}</p>
                </div>
                {isActive && <Check className="ml-auto h-4 w-4 shrink-0 text-[#D4A853]" />}
              </button>
            )
          })}
        </div>

        {/* Aspect Ratio */}
        <h3 className="mb-3 mt-6 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
          {t("imagePage.aspectRatio")}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {aspects.map((a) => (
            <button
              key={a}
              onClick={() => setSelectedAspect(a)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                selectedAspect === a
                  ? "bg-[#D4A853] text-[#050507] shadow-lg shadow-[#D4A853]/20"
                  : "border border-[#D4A853]/5 bg-[#D4A853]/3 text-muted-foreground hover:border-[#D4A853]/15 hover:text-foreground"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Quality */}
        <h3 className="mb-3 mt-6 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
          {t("imagePage.quality")}
        </h3>
        <div className="flex gap-2">
          {qualities.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuality(q)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                selectedQuality === q
                  ? "bg-[#D4A853] text-[#050507] shadow-lg shadow-[#D4A853]/20"
                  : "border border-[#D4A853]/5 bg-[#D4A853]/3 text-muted-foreground hover:border-[#D4A853]/15 hover:text-foreground"
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Number of images */}
        <h3 className="mb-3 mt-6 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
          {t("imagePage.numberOfImages")}
        </h3>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setNumImages(n)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                numImages === n
                  ? "bg-[#D4A853] text-[#050507] shadow-lg shadow-[#D4A853]/20"
                  : "border border-[#D4A853]/5 bg-[#D4A853]/3 text-muted-foreground hover:border-[#D4A853]/15 hover:text-foreground"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col">
        {/* Preview */}
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="relative h-full w-full max-w-2xl overflow-hidden rounded-2xl border border-[#D4A853]/10">
            <Image
              src={activeModel?.img || "/images/model-nano.jpg"}
              alt="Generated preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050507]/70 via-transparent to-[#050507]/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#f0ece4]/10 bg-[#050507]/50 backdrop-blur-xl">
                  <ImageIcon className="h-8 w-8 text-[#D4A853]/50" />
                </div>
                <span className="text-sm font-medium text-[#f0ece4]/50">{t("imagePage.title")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#D4A853]/5 bg-[#08080b]/80 p-5 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-4xl flex-col gap-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("imagePage.prompt")}
              rows={2}
              className="resize-none rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/3 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#D4A853]/30 focus:outline-none transition-colors"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEnhance(!enhance)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    enhance
                      ? "bg-[#D4A853]/15 text-[#D4A853] border border-[#D4A853]/30"
                      : "border border-[#D4A853]/5 bg-[#D4A853]/3 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  {t("imagePage.enhance")}
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-[#D4A853]/5 bg-[#D4A853]/3 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-[#D4A853]/15 hover:text-foreground">
                  <Plus className="h-3.5 w-3.5" />
                  {t("imagePage.elements")}
                </button>
              </div>
              <button className="rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-8 py-2.5 text-sm font-semibold text-[#050507] shadow-lg shadow-[#D4A853]/15 transition-all hover:shadow-[#D4A853]/25">
                {t("imagePage.generate")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
