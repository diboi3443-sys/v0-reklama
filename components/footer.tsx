"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function Footer() {
  const { t } = useI18n()

  const sections = [
    {
      title: t("footer.product"),
      links: [
        { label: t("nav.image"), href: "/image" },
        { label: t("nav.video"), href: "/create/video" },
        { label: t("nav.audio"), href: "#" },
        { label: t("nav.edit"), href: "#" },
        { label: t("nav.pricing"), href: "/pricing" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.about"), href: "#" },
        { label: t("footer.careers"), href: "#" },
        { label: t("footer.blog"), href: "#" },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { label: t("footer.docs"), href: "#" },
        { label: t("footer.support"), href: "#" },
        { label: t("megaImage.community"), href: "#" },
      ],
    },
    {
      title: t("footer.legal"),
      links: [
        { label: t("footer.privacy"), href: "#" },
        { label: t("footer.terms"), href: "#" },
      ],
    },
  ]

  return (
    <footer className="relative border-t border-[#D4A853]/5 bg-[#030305]">
      {/* Subtle gold glow at top */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#D4A853]/20 to-transparent" />
      <div className="mx-auto max-w-[1440px] px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4A853] to-[#B8922F]">
                <Sparkles className="h-4.5 w-4.5 text-[#050507]" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Soul<span className="text-[#D4A853]">Gen</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("hero.subtitle").slice(0, 100)}...
            </p>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4A853]/50">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-[#D4A853]/5 pt-8 md:flex-row md:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SoulGen AI. {t("footer.copyright")}
          </p>
          <div className="flex gap-6">
            {["Twitter", "Discord", "GitHub"].map((s) => (
              <Link key={s} href="#" className="text-xs text-muted-foreground transition-colors hover:text-[#D4A853]">{s}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
