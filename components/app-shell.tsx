"use client"

import type { ReactNode } from "react"
import { I18nProvider } from "@/lib/i18n"
import { PromoBanner } from "./promo-banner"
import { Header } from "./header"
import { Footer } from "./footer"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <div className="flex min-h-screen flex-col">
        <PromoBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </I18nProvider>
  )
}
