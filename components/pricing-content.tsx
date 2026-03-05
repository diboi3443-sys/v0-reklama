"use client"

import { useState } from "react"
import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { Check, Sparkles, Crown, Zap, Star, Rocket } from "lucide-react"
import Link from "next/link"

type Plan = {
  key: string
  icon: React.ElementType
  variant: "default" | "gold" | "cyan"
  highlight?: "popular" | "best"
}

const plans: Plan[] = [
  { key: "free", icon: Star, variant: "default" },
  { key: "basic", icon: Zap, variant: "default" },
  { key: "pro", icon: Sparkles, variant: "gold", highlight: "popular" },
  { key: "ultimate", icon: Crown, variant: "default" },
  { key: "creator", icon: Rocket, variant: "cyan", highlight: "best" },
]

export function PricingContent() {
  const { t } = useI18n()
  const [annual, setAnnual] = useState(false)

  return (
    <div className="relative">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image src="/images/pricing-bg.jpg" alt="" fill className="object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-[#050507]/90 to-[#050507]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 py-20">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4A853]/50">Pricing</p>
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-5xl text-balance">
            {t("pricingPage.title")}
          </h1>
          <p className="mt-5 text-muted-foreground text-pretty leading-relaxed">
            {t("pricingPage.subtitle")}
          </p>

          {/* Toggle */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
              {t("pricingPage.monthly")}
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative h-8 w-14 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 transition-colors"
              aria-label="Toggle pricing"
            >
              <div className={`absolute top-1 h-6 w-6 rounded-full bg-gradient-to-r from-[#D4A853] to-[#B8922F] shadow-lg shadow-[#D4A853]/20 transition-all ${
                annual ? "left-[30px]" : "left-1"
              }`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? "text-foreground" : "text-muted-foreground"}`}>
              {t("pricingPage.annual")}
            </span>
            {annual && (
              <span className="rounded-full border border-[#D4A853]/20 bg-[#D4A853]/10 px-3 py-1 text-xs font-semibold text-[#D4A853]">
                {t("pricingPage.save20")}
              </span>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {plans.map((plan) => {
            const Icon = plan.icon
            const name = t(`pricingPage.${plan.key}`)
            const price = annual && plan.key !== "free"
              ? t(`pricingPage.${plan.key}PriceAnnual`)
              : t(`pricingPage.${plan.key}Price`)
            const features = t(`pricingPage.${plan.key}Features`).split(",")

            const isGold = plan.highlight === "popular"
            const isCyan = plan.highlight === "best"

            return (
              <div
                key={plan.key}
                className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  isGold
                    ? "border-[#D4A853]/20 bg-gradient-to-b from-[#D4A853]/5 to-[#0c0c10] shadow-2xl shadow-[#D4A853]/5"
                    : isCyan
                      ? "border-[#00D4FF]/20 bg-gradient-to-b from-[#00D4FF]/5 to-[#0c0c10] shadow-2xl shadow-[#00D4FF]/5"
                      : "glass-card"
                }`}
              >
                {/* Card background image for highlighted plans */}
                {(isGold || isCyan) && (
                  <div className="absolute inset-0 opacity-5">
                    <Image src={isGold ? "/images/gallery-4.jpg" : "/images/gallery-7.jpg"} alt="" fill className="object-cover" />
                  </div>
                )}

                {isGold && (
                  <div className="relative z-10 -mx-6 -mt-6 mb-6">
                    <div className="bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#050507]">
                      {t("pricingPage.mostPopular")}
                    </div>
                  </div>
                )}
                {isCyan && (
                  <div className="relative z-10 -mx-6 -mt-6 mb-6">
                    <div className="bg-gradient-to-r from-[#00D4FF] to-[#00B0D4] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#050507]">
                      {t("pricingPage.bestValue")}
                    </div>
                  </div>
                )}

                <div className="relative z-10">
                  <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${
                    isGold
                      ? "border-[#D4A853]/20 bg-[#D4A853]/10 text-[#D4A853]"
                      : isCyan
                        ? "border-[#00D4FF]/20 bg-[#00D4FF]/10 text-[#00D4FF]"
                        : "border-[#D4A853]/10 bg-[#D4A853]/5 text-muted-foreground"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-lg font-semibold text-foreground">{name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className={`text-3xl font-bold ${
                      isGold ? "text-[#D4A853]" : isCyan ? "text-[#00D4FF]" : "text-foreground"
                    }`}>{price}</span>
                    {plan.key !== "free" && (
                      <span className="text-sm text-muted-foreground">{t("pricingPage.perMonth")}</span>
                    )}
                  </div>

                  <ul className="mt-6 flex flex-1 flex-col gap-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className={`mt-0.5 h-4 w-4 shrink-0 ${
                          isGold ? "text-[#D4A853]" : isCyan ? "text-[#00D4FF]" : "text-[#D4A853]/50"
                        }`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/auth/sign-in"
                    className={`mt-6 block rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                      plan.key === "free"
                        ? "border border-[#D4A853]/5 bg-[#D4A853]/3 text-muted-foreground hover:border-[#D4A853]/15 hover:text-foreground"
                        : isGold
                          ? "bg-gradient-to-r from-[#D4A853] to-[#B8922F] text-[#050507] shadow-lg shadow-[#D4A853]/15 hover:shadow-[#D4A853]/30"
                          : isCyan
                            ? "bg-gradient-to-r from-[#00D4FF] to-[#00B0D4] text-[#050507] shadow-lg shadow-[#00D4FF]/15 hover:shadow-[#00D4FF]/30"
                            : "border border-[#D4A853]/10 bg-[#D4A853]/5 text-foreground hover:bg-[#D4A853]/10"
                    }`}
                  >
                    {plan.key === "free" ? t("pricingPage.currentPlan") : t("pricingPage.getStarted")}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
