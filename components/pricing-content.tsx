"use client"

import { useState } from "react"
import { useI18n } from "@/lib/i18n"
import { Check, Sparkles, Crown, Zap, Star, Rocket } from "lucide-react"
import Link from "next/link"

type Plan = {
  key: string
  icon: React.ElementType
  iconGradient: string
  highlight?: "popular" | "best"
  borderColor: string
}

const plans: Plan[] = [
  { key: "free", icon: Star, iconGradient: "from-[#94a3b8] to-[#64748b]", borderColor: "border-white/5" },
  { key: "basic", icon: Zap, iconGradient: "from-[#3b82f6] to-[#2563eb]", borderColor: "border-white/5" },
  { key: "pro", icon: Sparkles, iconGradient: "from-[#14b8a6] to-[#0d9488]", highlight: "popular", borderColor: "border-[#14b8a6]/50" },
  { key: "ultimate", icon: Crown, iconGradient: "from-[#a855f7] to-[#7c3aed]", borderColor: "border-white/5" },
  { key: "creator", icon: Rocket, iconGradient: "from-[#f97316] to-[#ea580c]", highlight: "best", borderColor: "border-[#f97316]/50" },
]

export function PricingContent() {
  const { t } = useI18n()
  const [annual, setAnnual] = useState(false)

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-foreground md:text-5xl text-balance">
          {t("pricingPage.title")}
        </h1>
        <p className="mt-4 text-muted-foreground text-pretty">
          {t("pricingPage.subtitle")}
        </p>

        {/* Toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span
            className={`text-sm font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}
          >
            {t("pricingPage.monthly")}
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative h-7 w-12 rounded-full bg-[#14b8a6]/20 transition-colors"
            aria-label="Toggle pricing"
          >
            <div
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-[#14b8a6] transition-all ${
                annual ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
          <span
            className={`text-sm font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}
          >
            {t("pricingPage.annual")}
          </span>
          {annual && (
            <span className="rounded-full bg-[#14b8a6]/20 px-2.5 py-0.5 text-xs font-semibold text-[#14b8a6]">
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

          return (
            <div
              key={plan.key}
              className={`relative flex flex-col rounded-2xl border ${plan.borderColor} bg-[#111827]/50 p-6 transition-all hover:-translate-y-1 ${
                plan.highlight === "popular"
                  ? "shadow-lg shadow-[#14b8a6]/10"
                  : plan.highlight === "best"
                    ? "shadow-lg shadow-[#f97316]/10"
                    : ""
              }`}
            >
              {plan.highlight === "popular" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#14b8a6] to-[#0d9488] px-3 py-0.5 text-xs font-bold text-white">
                  {t("pricingPage.mostPopular")}
                </div>
              )}
              {plan.highlight === "best" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c] px-3 py-0.5 text-xs font-bold text-white">
                  {t("pricingPage.bestValue")}
                </div>
              )}

              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${plan.iconGradient} text-white`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">{price}</span>
                {plan.key !== "free" && (
                  <span className="text-sm text-muted-foreground">
                    {t("pricingPage.perMonth")}
                  </span>
                )}
              </div>

              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#14b8a6]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/sign-in"
                className={`mt-6 rounded-xl py-2.5 text-center text-sm font-semibold transition-all hover:scale-[1.02] ${
                  plan.key === "free"
                    ? "bg-white/5 text-foreground hover:bg-white/10"
                    : plan.highlight === "popular"
                      ? "bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white hover:shadow-lg hover:shadow-[#14b8a6]/25"
                      : plan.highlight === "best"
                        ? "bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white hover:shadow-lg hover:shadow-[#f97316]/25"
                        : "bg-white/10 text-foreground hover:bg-white/15"
                }`}
              >
                {plan.key === "free"
                  ? t("pricingPage.currentPlan")
                  : t("pricingPage.getStarted")}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
