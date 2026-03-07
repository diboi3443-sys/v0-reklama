"use client"

import type { ReactNode } from "react"
import { PromoBanner } from "./promo-banner"
import { Header } from "./header-simple"
import { Footer } from "./footer-simple"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PromoBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
