"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n"
import {
  Sparkles,
  ImageIcon,
  Wand2,
  Palette,
  User,
  Check,
  Plus,
} from "lucide-react"

const models = [
  { id: "nanoBanana2", icon: Sparkles, gradient: "from-[#14b8a6] to-[#3b82f6]" },
  { id: "soul2", icon: User, gradient: "from-[#ec4899] to-[#db2777]" },
  { id: "flux2Pro", icon: Wand2, gradient: "from-[#a855f7] to-[#7c3aed]" },
  { id: "seedream5", icon: Palette, gradient: "from-[#f97316] to-[#ea580c]" },
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

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full border-b border-white/5 bg-[#0d1321] p-4 lg:w-[280px] lg:border-b-0 lg:border-r lg:overflow-y-auto">
        {/* Model selector */}
        <h3 className="mb-3 text-sm font-semibold text-foreground">
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
                className={`flex items-center gap-3 rounded-xl border-2 p-3 transition-all ${
                  isActive
                    ? "border-[#14b8a6] bg-[#14b8a6]/10"
                    : "border-transparent hover:border-[#14b8a6]/30 hover:bg-white/5"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${model.gradient} text-white`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-medium text-foreground">
                    {t(`megaImage.${model.id}`)}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {t(`megaImage.${model.id}Desc`).slice(0, 30)}...
                  </p>
                </div>
                {isActive && (
                  <Check className="ml-auto h-4 w-4 text-[#14b8a6]" />
                )}
              </button>
            )
          })}
        </div>

        {/* Aspect Ratio */}
        <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">
          {t("imagePage.aspectRatio")}
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {aspects.map((a) => (
            <button
              key={a}
              onClick={() => setSelectedAspect(a)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                selectedAspect === a
                  ? "bg-[#14b8a6] text-white"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Quality */}
        <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">
          {t("imagePage.quality")}
        </h3>
        <div className="flex gap-2">
          {qualities.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuality(q)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                selectedQuality === q
                  ? "bg-[#14b8a6] text-white"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              }`}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Number of images */}
        <h3 className="mb-3 mt-6 text-sm font-semibold text-foreground">
          {t("imagePage.numberOfImages")}
        </h3>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => setNumImages(n)}
              className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                numImages === n
                  ? "bg-[#14b8a6] text-white"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
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
          <div className="flex h-full w-full max-w-2xl items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#111827]/30">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <ImageIcon className="h-16 w-16 opacity-20" />
              <span className="text-sm">{t("imagePage.title")}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 bg-[#0d1321]/80 p-4 backdrop-blur-xl">
          <div className="mx-auto flex max-w-4xl flex-col gap-3">
            <div className="flex items-center gap-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("imagePage.prompt")}
                rows={2}
                className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#14b8a6]/50 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEnhance(!enhance)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    enhance
                      ? "bg-[#14b8a6]/20 text-[#14b8a6]"
                      : "bg-white/5 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  {t("imagePage.enhance")}
                </button>
                <button className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
                  <Plus className="h-3.5 w-3.5" />
                  {t("imagePage.elements")}
                </button>
              </div>
              <button className="rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] px-8 py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#14b8a6]/25">
                {t("imagePage.generate")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
