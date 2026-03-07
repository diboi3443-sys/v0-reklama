"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { UserMenu } from "./user-menu"

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#FF6B00]/5 bg-[#050507]/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#E55A00] shadow-lg shadow-[#FF6B00]/10 transition-shadow group-hover:shadow-[#FF6B00]/25">
            <Sparkles className="h-4.5 w-4.5 text-[#050507]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            v0-<span className="text-[#FF6B00]">reklama</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 lg:flex">
          <Link
            href="/image"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#f0ece4]/70 transition-colors hover:bg-[#FF6B00]/10 hover:text-[#f0ece4]"
          >
            Изображения
          </Link>
          <Link
            href="/create/video"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#f0ece4]/70 transition-colors hover:bg-[#FF6B00]/10 hover:text-[#f0ece4]"
          >
            Видео
          </Link>
          <Link
            href="/presets"
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-[#f0ece4]/70 transition-colors hover:bg-[#FF6B00]/10 hover:text-[#f0ece4]"
          >
            Presets
            <span className="rounded bg-[#FF6B00]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FF6B00]">
              400+
            </span>
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#f0ece4]/70 transition-colors hover:text-[#f0ece4]"
          >
            Тарифы
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
