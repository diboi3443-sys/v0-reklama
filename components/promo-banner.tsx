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
    <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#D4A853]/10 via-[#D4A853]/20 to-[#00D4FF]/10 px-4 py-2.5 text-sm backdrop-blur-sm">
      <div className="absolute inset-0 bg-[#050507]/60" />
      <div className="relative flex items-center gap-3">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4A853]/20">
          <Sparkles className="h-3 w-3 text-[#D4A853]" />
        </span>
        <span className="font-medium text-[#f0ece4]/80">{t("promo.text")}</span>
        <Link
          href="/create/video"
          className="rounded-full border border-[#D4A853]/30 bg-[#D4A853]/10 px-4 py-1 text-xs font-semibold text-[#D4A853] transition-all hover:bg-[#D4A853]/20 hover:border-[#D4A853]/50"
        >
          {t("promo.cta")}
        </Link>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="relative rounded-full p-1 text-[#f0ece4]/30 transition-colors hover:text-[#f0ece4]/60"
        aria-label="Close banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
