"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"
import { Sparkles, Video, Mic2, ImageIcon, ArrowRight } from "lucide-react"

function SocialButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#FF6B00]/10 bg-[#FF6B00]/3 px-4 py-3.5 text-sm font-medium text-foreground transition-all hover:border-[#FF6B00]/20 hover:bg-[#FF6B00]/5">
      {icon}
      {label}
    </button>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
}

function MicrosoftIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
      <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
      <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
      <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
    </svg>
  )
}

const featureIcons = [ImageIcon, Video, Mic2]

export function AuthContent() {
  const { t } = useI18n()
  const [email, setEmail] = useState("")

  const features = [
    { title: t("authPage.feature1Title"), desc: t("authPage.feature1Desc"), icon: featureIcons[0] },
    { title: t("authPage.feature2Title"), desc: t("authPage.feature2Desc"), icon: featureIcons[1] },
    { title: t("authPage.feature3Title"), desc: t("authPage.feature3Desc"), icon: featureIcons[2] },
  ]

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Left cinematic panel */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/images/gallery-1.jpg"
          alt="AI generated art"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-[#050507]/30 to-[#050507]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-transparent to-[#050507]/50" />

        {/* Overlay content */}
        <div className="relative flex h-full flex-col justify-end p-12">
          <div className="flex flex-col gap-4">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="flex items-start gap-4 rounded-2xl border border-[#FF6B00]/10 bg-[#050507]/60 p-4 backdrop-blur-xl">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FF6B00]/15 bg-[#FF6B00]/5">
                    <Icon className="h-5 w-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{f.title}</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#E55A00] shadow-lg shadow-[#FF6B00]/15">
                <Sparkles className="h-5 w-5 text-[#050507]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Soul<span className="text-[#FF6B00]">Gen</span>
              </span>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-[#FF6B00]/10 bg-gradient-to-b from-[#0c0c10] to-[#050507] p-8 backdrop-blur-2xl">
            <h1 className="mb-8 text-center font-serif text-2xl font-bold text-foreground">
              {t("authPage.signIn")}
            </h1>

            <div className="flex flex-col gap-3">
              <SocialButton label={t("authPage.continueWithGoogle")} icon={<GoogleIcon />} />
              <SocialButton label={t("authPage.continueWithApple")} icon={<AppleIcon />} />
              <SocialButton label={t("authPage.continueWithMicrosoft")} icon={<MicrosoftIcon />} />
            </div>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FF6B00]/15 to-transparent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#FF6B00]/40">{t("authPage.or")}</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FF6B00]/15 to-transparent" />
            </div>

            <div className="flex flex-col gap-4">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#FF6B00]/50">
                {t("authPage.email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("authPage.emailPlaceholder")}
                className="rounded-xl border border-[#FF6B00]/10 bg-[#FF6B00]/3 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-[#FF6B00]/30 focus:outline-none transition-colors"
              />
              <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#E55A00] px-4 py-3.5 text-sm font-semibold text-[#050507] shadow-lg shadow-[#FF6B00]/15 transition-all hover:shadow-[#FF6B00]/25">
                {t("authPage.continue")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("authPage.noAccount")}{" "}
              <Link href="/auth/sign-in" className="font-semibold text-[#FF6B00] hover:underline">
                {t("authPage.signUp")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
