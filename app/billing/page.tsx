'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/app-shell'
import { createClient } from '@/lib/supabase-browser'
import { CreditCard, Calendar, TrendingUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function BillingPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Get user session
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Fetch user data
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      setUser(userData)

      // Fetch active subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      setSubscription(subData)

      // Fetch payment history
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setPayments(paymentsData || [])

    } catch (error) {
      console.error('Failed to fetch billing data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-muted-foreground">Загрузка...</div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Биллинг</h1>
            <p className="mt-2 text-muted-foreground">
              Управляйте подпиской и балансом credits
            </p>
          </div>
          <Link
            href="/pricing"
            className="rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#E55A00] px-6 py-3 font-semibold text-[#050507] shadow-lg transition-all hover:shadow-xl"
          >
            Купить credits
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Credits */}
          <div className="rounded-xl border border-[#FF6B00]/10 bg-[#FF6B00]/5 p-6">
            <div className="flex items-center justify-between">
              <CreditCard className="h-8 w-8 text-[#FF6B00]" />
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold text-foreground">
                {user?.credits || 0}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Доступно credits
              </div>
            </div>
          </div>

          {/* Tier */}
          <div className="rounded-xl border border-[#FF6B00]/10 bg-[#FF6B00]/5 p-6">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-8 w-8 text-[#FF6B00]" />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-foreground">
                {user?.tier === 'free' && '🆓 FREE'}
                {user?.tier === 'starter' && '🚀 STARTER'}
                {user?.tier === 'pro' && '⭐ PRO'}
                {user?.tier === 'studio' && '💎 STUDIO'}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Текущий план
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="rounded-xl border border-[#FF6B00]/10 bg-[#FF6B00]/5 p-6">
            <div className="flex items-center justify-between">
              <Calendar className="h-8 w-8 text-[#FF6B00]" />
            </div>
            <div className="mt-4">
              {subscription ? (
                <>
                  <div className="text-sm font-semibold text-foreground">
                    Активна до
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {new Date(subscription.expires_at).toLocaleDateString('ru-RU')}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-semibold text-foreground">
                    Нет подписки
                  </div>
                  <Link
                    href="/pricing"
                    className="mt-2 text-sm text-[#FF6B00] hover:underline"
                  >
                    Оформить →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground">История платежей</h2>

          {payments.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[#FF6B00]/10 bg-[#FF6B00]/3 p-12 text-center">
              <p className="text-muted-foreground">Платежей пока нет</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-xl border border-[#FF6B00]/10 bg-[#FF6B00]/3 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#FF6B00]/20">
                      <CreditCard className="h-6 w-6 text-[#FF6B00]" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {payment.type === 'credits' ? 'Покупка credits' : 'Подписка'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(payment.created_at).toLocaleString('ru-RU')}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {payment.amount.toLocaleString('ru-RU')} ₽
                    </div>
                    <div
                      className={`text-sm ${
                        payment.status === 'succeeded'
                          ? 'text-green-500'
                          : payment.status === 'pending'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      }`}
                    >
                      {payment.status === 'succeeded' && '✓ Оплачено'}
                      {payment.status === 'pending' && '⏳ В процессе'}
                      {payment.status === 'canceled' && '✗ Отменено'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manage Subscription */}
        {subscription && (
          <div className="mt-12 rounded-xl border border-[#FF6B00]/10 bg-[#FF6B00]/5 p-8">
            <h3 className="text-lg font-bold text-foreground">
              Управление подпиской
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Ваша подписка активна до{' '}
              {new Date(subscription.expires_at).toLocaleDateString('ru-RU')}
            </p>

            <div className="mt-6 flex gap-4">
              <Link
                href="/pricing"
                className="rounded-lg border border-[#FF6B00]/20 bg-[#FF6B00]/5 px-6 py-2 text-sm font-semibold text-foreground transition-all hover:bg-[#FF6B00]/10"
              >
                Изменить план
              </Link>
              <button className="rounded-lg border border-red-500/20 bg-red-500/5 px-6 py-2 text-sm font-semibold text-red-500 transition-all hover:bg-red-500/10">
                Отменить подписку
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
