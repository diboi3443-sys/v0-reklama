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
    <footer className="border-t border-white/5 bg-[#070b14]">
      <div className="mx-auto max-w-[1400px] px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#14b8a6] to-[#0d9488]">
                <Sparkles className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-lg font-bold text-foreground">SoulGen</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t("hero.subtitle").slice(0, 80)}...
            </p>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2">
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
        <div className="mt-12 border-t border-white/5 pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SoulGen AI. {t("footer.copyright")}
        </div>
      </div>
    </footer>
  )
}
