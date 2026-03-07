'use client'

import { useState } from 'react'
import { AppShell } from '@/components/app-shell'
import { Check, Zap, Crown, Sparkles } from 'lucide-react'
import { PRICING } from '@/lib/yookassa'
import { toast } from 'sonner'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const [mode, setMode] = useState<'credits' | 'subscription'>('subscription')

  const handlePurchase = async (
    type: 'credits' | 'subscription',
    itemId: string
  ) => {
    try {
      setLoading(itemId)

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, itemId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment')
      }

      const data = await response.json()

      // Redirect to YooKassa payment page
      window.location.href = data.confirmationUrl

    } catch (error: any) {
      console.error('Payment error:', error)
      
      // Check if it's a mock error (YooKassa not configured)
      if (error.message?.includes('временно недоступна')) {
        toast.error('💳 Платёжная система скоро заработает!\n\nМы настраиваем YooKassa. Загляните через пару дней! 🚀', {
          duration: 5000,
        })
      } else {
        toast.error(error.message || 'Ошибка создания платежа')
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">
            Тарифы и цены
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Выберите подходящий план для ваших задач
          </p>
          
          {/* Temporary notice */}
          <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
            <div className="flex items-center justify-center gap-2 text-yellow-500">
              <span className="text-xl">⚡</span>
              <span className="font-semibold">Платёжная система в разработке</span>
            </div>
            <p className="mt-2 text-sm text-yellow-500/80">
              Мы настраиваем приём платежей. Пока можете бесплатно тестировать все функции!
            </p>
          </div>
        </div>

        {/* Toggle: Credits vs Subscriptions */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5 p-1">
            <button
              onClick={() => setMode('subscription')}
              className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                mode === 'subscription'
                  ? 'bg-gradient-to-r from-[#D4A853] to-[#B8922F] text-[#050507] shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Подписки
            </button>
            <button
              onClick={() => setMode('credits')}
              className={`rounded-lg px-6 py-2 text-sm font-semibold transition-all ${
                mode === 'credits'
                  ? 'bg-gradient-to-r from-[#D4A853] to-[#B8922F] text-[#050507] shadow-lg'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Разовая покупка
            </button>
          </div>
        </div>

        {/* Subscriptions */}
        {mode === 'subscription' && (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {Object.entries(PRICING.subscriptions).map(([key, plan]) => (
              <div
                key={key}
                className={`relative rounded-2xl border p-8 transition-all ${
                  plan.popular
                    ? 'border-[#D4A853] bg-[#D4A853]/5 shadow-lg shadow-[#D4A853]/10'
                    : 'border-[#D4A853]/10 bg-[#D4A853]/3'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="rounded-full bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-4 py-1 text-xs font-bold text-[#050507]">
                      ПОПУЛЯРНЫЙ
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-4">
                  {key === 'starter' && <Zap className="h-10 w-10 text-[#D4A853]" />}
                  {key === 'pro' && <Sparkles className="h-10 w-10 text-[#D4A853]" />}
                  {key === 'studio' && <Crown className="h-10 w-10 text-[#D4A853]" />}
                </div>

                {/* Plan name */}
                <h3 className="text-2xl font-bold text-foreground">{plan.label}</h3>

                {/* Price */}
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-muted-foreground">/месяц</span>
                </div>

                {/* Features */}
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="h-5 w-5 shrink-0 text-[#D4A853]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handlePurchase('subscription', key)}
                  disabled={loading === key}
                  className={`mt-8 w-full rounded-xl px-6 py-3 font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#D4A853] to-[#B8922F] text-[#050507] shadow-lg hover:shadow-xl'
                      : 'border border-[#D4A853]/20 bg-[#D4A853]/5 text-foreground hover:bg-[#D4A853]/10'
                  }`}
                >
                  {loading === key ? 'Загрузка...' : 'Выбрать план'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Credits */}
        {mode === 'credits' && (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {Object.entries(PRICING.credits).map(([key, pack]) => (
              <div
                key={key}
                className={`relative rounded-2xl border p-8 transition-all ${
                  pack.popular
                    ? 'border-[#D4A853] bg-[#D4A853]/5 shadow-lg shadow-[#D4A853]/10'
                    : 'border-[#D4A853]/10 bg-[#D4A853]/3'
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="rounded-full bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-4 py-1 text-xs font-bold text-[#050507]">
                      ВЫГОДНО
                    </div>
                  </div>
                )}

                {/* Plan name */}
                <h3 className="text-2xl font-bold text-foreground">{pack.label}</h3>

                {/* Credits */}
                <div className="mt-4">
                  <span className="text-5xl font-bold text-[#D4A853]">
                    {pack.credits}
                  </span>
                  <span className="ml-2 text-muted-foreground">credits</span>
                </div>

                {/* Description */}
                <p className="mt-2 text-sm text-muted-foreground">{pack.description}</p>

                {/* Price */}
                <div className="mt-6">
                  <span className="text-3xl font-bold text-foreground">
                    {pack.price.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                {/* Price per credit */}
                <div className="mt-2 text-xs text-muted-foreground">
                  {(pack.price / pack.credits).toFixed(1)} ₽ за генерацию
                </div>

                {/* CTA */}
                <button
                  onClick={() => handlePurchase('credits', key)}
                  disabled={loading === key}
                  className={`mt-8 w-full rounded-xl px-6 py-3 font-semibold transition-all ${
                    pack.popular
                      ? 'bg-gradient-to-r from-[#D4A853] to-[#B8922F] text-[#050507] shadow-lg hover:shadow-xl'
                      : 'border border-[#D4A853]/20 bg-[#D4A853]/5 text-foreground hover:bg-[#D4A853]/10'
                  }`}
                >
                  {loading === key ? 'Загрузка...' : 'Купить'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Free tier info */}
        <div className="mt-16 rounded-2xl border border-[#D4A853]/10 bg-[#D4A853]/5 p-8 text-center">
          <h3 className="text-xl font-bold text-foreground">
            🎁 Бесплатный план
          </h3>
          <p className="mt-2 text-muted-foreground">
            Получите 10 генераций в день бесплатно. Без кредитной карты.
          </p>
          <a
            href="/auth/signin"
            className="mt-4 inline-block rounded-lg border border-[#D4A853]/20 px-6 py-2 text-sm font-semibold text-foreground transition-all hover:bg-[#D4A853]/10"
          >
            Начать бесплатно
          </a>
        </div>
      </div>
    </AppShell>
  )
}
