"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Sparkles, Menu, X } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { LanguageSwitcher } from "./language-switcher"
import {
  ImageMegaMenu,
  VideoMegaMenu,
  AudioMegaMenu,
  EditMegaMenu,
  CharacterMegaMenu,
} from "./mega-menu"

type NavItem = {
  key: string
  label: string
  href: string
  badge?: string
  megaMenu?: React.ReactNode
}

function NavLink({
  item,
  isActive,
  onHover,
  onLeave,
}: {
  item: NavItem
  isActive: boolean
  onHover: () => void
  onLeave: () => void
}) {
  return (
    <div
      className="relative"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link
        href={item.href}
        className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {item.label}
        {item.badge && (
          <span className="rounded bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
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
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const b = t("badges.new")
  const navItems: NavItem[] = [
    {
      key: "image",
      label: t("nav.image"),
      href: "/image",
      badge: b,
      megaMenu: <ImageMegaMenu />,
    },
    {
      key: "video",
      label: t("nav.video"),
      href: "/create/video",
      megaMenu: <VideoMegaMenu />,
    },
    {
      key: "audio",
      label: t("nav.audio"),
      href: "#",
      badge: b,
      megaMenu: <AudioMegaMenu />,
    },
    {
      key: "edit",
      label: t("nav.edit"),
      href: "#",
      megaMenu: <EditMegaMenu />,
    },
    {
      key: "character",
      label: t("nav.character"),
      href: "#",
      megaMenu: <CharacterMegaMenu />,
    },
    {
      key: "moodboard",
      label: t("nav.moodboard"),
      href: "#",
      badge: b,
    },
    {
      key: "cinema",
      label: t("nav.cinemaStudio"),
      href: "#",
    },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0f1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0d9488]">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">SoulGen</span>
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
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher />
          <Link
            href="/pricing"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.pricing")}
          </Link>
          <Link
            href="/auth/sign-in"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.login")}
          </Link>
          <Link
            href="/auth/sign-in"
            className="rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-[#14b8a6]/25"
          >
            {t("nav.signUp")}
          </Link>
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
        <div className="animate-fade-in border-t border-white/5 bg-[#0a0f1a]/95 px-4 pb-6 pt-4 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
                {item.badge && (
                  <span className="rounded bg-gradient-to-r from-[#14b8a6] to-[#3b82f6] px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/pricing"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              onClick={() => setMobileOpen(false)}
            >
              {t("nav.pricing")}
            </Link>
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <LanguageSwitcher />
            <Link
              href="/auth/sign-in"
              className="rounded-xl bg-gradient-to-r from-[#14b8a6] to-[#0d9488] px-4 py-2.5 text-center text-sm font-semibold text-white"
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
