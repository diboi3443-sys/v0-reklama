"use client"

import { useI18n, type Locale } from "@/lib/i18n"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  const toggle = () => {
    setLocale(locale === "en" ? "ru" : "en")
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase font-medium">{locale}</span>
    </button>
  )
}
