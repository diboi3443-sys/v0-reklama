"use client"

import { useState } from "react"
import { X, Sparkles } from "lucide-react"
import Link from "next/link"

export function PromoBanner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF6B00]/10 via-[#FF6B00]/20 to-[#00D4FF]/10 px-4 py-2.5 text-sm backdrop-blur-sm">
      <div className="absolute inset-0 bg-[#050507]/60" />
      <div className="relative flex items-center gap-3">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B00]/20">
          <Sparkles className="h-3 w-3 text-[#FF6B00]" />
        </span>
        <span className="font-medium text-[#f0ece4]/80">
          🎁 Новые пресеты для видео — создавайте кинематографичный контент за 1 клик
        </span>
        <Link
          href="/presets"
          className="rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-4 py-1 text-xs font-semibold text-[#FF6B00] transition-all hover:bg-[#FF6B00]/20 hover:border-[#FF6B00]/50"
        >
          Попробовать
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
