"use client"

import { useState } from "react"
import { X, Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import Link from "next/link"

export function PromoBanner() {
  const [visible, setVisible] = useState(true)
  const { t } = useI18n()

  if (!visible) return null

  return (
    <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-[#14b8a6] via-[#3b82f6] to-[#f97316] px-4 py-2 text-sm font-medium text-white">
      <Sparkles className="h-4 w-4" />
      <span>{t("promo.text")}</span>
      <Link
        href="/create/video"
        className="ml-2 rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
      >
        {t("promo.cta")}
      </Link>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-white/70 transition-colors hover:text-white"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
