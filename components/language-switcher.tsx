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
      className="flex items-center gap-1.5 rounded-full border border-[#D4A853]/10 bg-[#D4A853]/5 px-3 py-1.5 text-sm text-[#D4A853]/70 transition-all hover:border-[#D4A853]/25 hover:text-[#D4A853] hover:bg-[#D4A853]/10"
      aria-label="Switch language"
    >
      <Globe className="h-3.5 w-3.5" />
      <span className="uppercase font-semibold text-xs tracking-wider">{locale}</span>
    </button>
  )
}
