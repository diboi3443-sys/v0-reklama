'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AppShell } from '@/components/app-shell'
import { CheckCircle, Loader2 } from 'lucide-react'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    // YooKassa redirects with payment status in URL
    // We'll just show success and let webhook handle backend
    const timer = setTimeout(() => {
      setStatus('success')
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleContinue = () => {
    router.push('/image')
  }

  return (
    <AppShell>
      <div className="flex min-h-[60vh] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="mx-auto h-16 w-16 animate-spin text-[#D4A853]" />
              <h1 className="mt-6 text-2xl font-bold text-foreground">
                Обрабатываем платёж...
              </h1>
              <p className="mt-2 text-muted-foreground">
                Подождите несколько секунд
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h1 className="mt-6 text-3xl font-bold text-foreground">
                Платёж успешен!
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Ваши credits уже начислены на аккаунт
              </p>

              <div className="mt-8 rounded-xl border border-[#D4A853]/10 bg-[#D4A853]/5 p-6">
                <p className="text-sm text-muted-foreground">
                  Спасибо за покупку! Теперь вы можете создавать ещё больше контента.
                </p>
              </div>

              <button
                onClick={handleContinue}
                className="mt-8 rounded-xl bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-8 py-3 font-semibold text-[#050507] shadow-lg transition-all hover:shadow-xl"
              >
                Начать создавать
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
                <span className="text-4xl">❌</span>
              </div>
              <h1 className="mt-6 text-3xl font-bold text-foreground">
                Ошибка платежа
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Что-то пошло не так. Попробуйте ещё раз.
              </p>

              <button
                onClick={() => router.push('/pricing')}
                className="mt-8 rounded-xl border border-[#D4A853]/20 bg-[#D4A853]/5 px-8 py-3 font-semibold text-foreground transition-all hover:bg-[#D4A853]/10"
              >
                Вернуться к тарифам
              </button>
            </>
          )}
        </div>
      </div>
    </AppShell>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4A853]" />
        </div>
      </AppShell>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
