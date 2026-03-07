"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Sparkles, Menu, X } from "lucide-react"
// import { useI18n } from "@/lib/i18n"
// import { LanguageSwitcher } from "./language-switcher"
import { UserMenu } from "./user-menu"
import {
  ImageMegaMenu, VideoMegaMenu, AudioMegaMenu, EditMegaMenu, CharacterMegaMenu,
} from "./mega-menu"

type NavItem = {
  key: string
  label: string
  href: string
  badge?: string
  megaMenu?: React.ReactNode
}

function NavLink({
  item, isActive, onHover, onLeave,
}: {
  item: NavItem; isActive: boolean; onHover: () => void; onLeave: () => void
}) {
  return (
    <div className="relative" onMouseEnter={onHover} onMouseLeave={onLeave}>
      <Link
        href={item.href}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium tracking-wide transition-all ${
          isActive ? "text-[#FF6B00]" : "text-[#f0ece4]/50 hover:text-[#f0ece4]/80"
        }`}
      >
        {item.label}
        {item.badge && (
          <span className="rounded bg-[#FF6B00]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FF6B00]">
            {item.badge}
          </span>
        )}
      </Link>
      {isActive && item.megaMenu}
    </div>
  )
}

export function Header() {
  const { t } = useI18n()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleHover = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(key)
  }

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150)
  }

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [])

  const b = t("badges.new")
  const navItems: NavItem[] = [
    { key: "image", label: t("nav.image"), href: "/image", badge: b, megaMenu: <ImageMegaMenu /> },
    { key: "video", label: t("nav.video"), href: "/create/video", megaMenu: <VideoMegaMenu /> },
    { key: "presets", label: "Presets", href: "/presets", badge: "400+" },
    { key: "audio", label: t("nav.audio"), href: "#", badge: b, megaMenu: <AudioMegaMenu /> },
    { key: "edit", label: t("nav.edit"), href: "#", megaMenu: <EditMegaMenu /> },
    { key: "character", label: t("nav.character"), href: "/influencers", megaMenu: <CharacterMegaMenu /> },
    { key: "moodboard", label: t("nav.moodboard"), href: "#", badge: b },
    { key: "cinema", label: t("nav.cinemaStudio"), href: "#" },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-[#FF6B00]/5 bg-[#050507]/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#E55A00] shadow-lg shadow-[#FF6B00]/10 transition-shadow group-hover:shadow-[#FF6B00]/25">
            <Sparkles className="h-4.5 w-4.5 text-[#050507]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Soul<span className="text-[#FF6B00]">Gen</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              item={item}
              isActive={activeMenu === item.key}
              onHover={() => handleHover(item.key)}
              onLeave={handleLeave}
            />
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Link
            href="/pricing"
            className="rounded-lg px-3 py-2 text-[13px] font-medium text-[#f0ece4]/50 transition-colors hover:text-[#f0ece4]/80"
          >
            {t("nav.pricing")}
          </Link>
          <UserMenu />
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden rounded-lg p-2 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="animate-fade-in border-t border-[#FF6B00]/5 bg-[#050507]/95 px-4 pb-6 pt-4 backdrop-blur-2xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#f0ece4]/50 transition-colors hover:bg-[#FF6B00]/5 hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
                {item.badge && (
                  <span className="rounded bg-[#FF6B00]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#FF6B00]">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/pricing"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#f0ece4]/50 transition-colors hover:bg-[#FF6B00]/5 hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav.pricing")}
            </Link>
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <LanguageSwitcher />
            <Link
              href="/auth/sign-in"
              className="rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#E55A00] px-4 py-2.5 text-center text-sm font-semibold text-[#050507]"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav.signUp")}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
