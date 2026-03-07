"use client"

import { useI18n } from "@/lib/i18n"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  const toggle = () => {
    setLocale(locale === "en" ? "ru" : "en")
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-full border border-[#FF6B00]/10 bg-[#FF6B00]/5 px-3 py-1.5 text-sm text-[#FF6B00]/70 transition-all hover:border-[#FF6B00]/25 hover:text-[#FF6B00] hover:bg-[#FF6B00]/10"
      aria-label="Switch language"
    >
      <Globe className="h-3.5 w-3.5" />
      <span className="uppercase font-semibold text-xs tracking-wider">{locale}</span>
    </button>
  )
}
