'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase-browser'
import { useSearchParams } from 'next/navigation'

export default function SignInPage() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect') || '/image'

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050507] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4A853] to-[#B8922F] shadow-lg shadow-[#D4A853]/20">
            <span className="text-2xl font-bold text-[#050507]">v0</span>
          </div>
          <h1 className="text-2xl font-bold text-[#f0ece4]">
            Добро пожаловать в v0-reklama
          </h1>
          <p className="mt-2 text-sm text-[#f0ece4]/50">
            AI-генератор контента для креаторов
          </p>
        </div>

        {/* Auth Form */}
        <div className="rounded-2xl border border-[#D4A853]/10 bg-[#D4A853]/5 p-8">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#D4A853',
                    brandAccent: '#B8922F',
                    brandButtonText: '#050507',
                    defaultButtonBackground: '#D4A853',
                    defaultButtonBackgroundHover: '#B8922F',
                    defaultButtonBorder: '#D4A853',
                    defaultButtonText: '#050507',
                    dividerBackground: '#D4A853',
                    inputBackground: 'rgba(212, 168, 83, 0.03)',
                    inputBorder: 'rgba(212, 168, 83, 0.1)',
                    inputBorderHover: 'rgba(212, 168, 83, 0.3)',
                    inputBorderFocus: 'rgba(212, 168, 83, 0.3)',
                    inputText: '#f0ece4',
                    inputPlaceholder: 'rgba(240, 236, 228, 0.3)',
                  },
                  space: {
                    spaceSmall: '0.5rem',
                    spaceMedium: '0.75rem',
                    spaceLarge: '1rem',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '14px',
                    baseLabelSize: '12px',
                    baseButtonSize: '14px',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '12px',
                    buttonBorderRadius: '12px',
                    inputBorderRadius: '12px',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'font-semibold shadow-lg',
                input: 'font-normal',
              },
            }}
            providers={['google']}
            redirectTo={`${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Пароль',
                  email_input_placeholder: 'your@email.com',
                  password_input_placeholder: '••••••••',
                  button_label: 'Войти',
                  loading_button_label: 'Вход...',
                  social_provider_text: 'Войти через {{provider}}',
                  link_text: 'Уже есть аккаунт? Войти',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Пароль',
                  email_input_placeholder: 'your@email.com',
                  password_input_placeholder: '••••••••',
                  button_label: 'Зарегистрироваться',
                  loading_button_label: 'Регистрация...',
                  social_provider_text: 'Войти через {{provider}}',
                  link_text: 'Нет аккаунта? Зарегистрироваться',
                  confirmation_text: 'Проверьте email для подтверждения',
                },
                magic_link: {
                  email_input_label: 'Email',
                  email_input_placeholder: 'your@email.com',
                  button_label: 'Получить магическую ссылку',
                  loading_button_label: 'Отправка...',
                  link_text: 'Войти через магическую ссылку',
                  confirmation_text: 'Проверьте email для входа',
                },
                forgotten_password: {
                  email_label: 'Email',
                  password_label: 'Пароль',
                  email_input_placeholder: 'your@email.com',
                  button_label: 'Восстановить пароль',
                  loading_button_label: 'Отправка...',
                  link_text: 'Забыли пароль?',
                  confirmation_text: 'Проверьте email для сброса пароля',
                },
              },
            }}
          />
        </div>

        {/* Free Trial Badge */}
        <div className="mt-6 rounded-lg border border-[#D4A853]/20 bg-[#D4A853]/10 p-4 text-center">
          <div className="text-sm font-semibold text-[#D4A853]">
            🎁 Бесплатная пробная версия
          </div>
          <div className="mt-1 text-xs text-[#f0ece4]/60">
            10 генераций в день без оплаты
          </div>
        </div>
      </div>
    </div>
  )
}
