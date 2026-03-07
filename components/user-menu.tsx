'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { User } from '@supabase/supabase-js'
import { LogOut, CreditCard, User as UserIcon } from 'lucide-react'
import Link from 'next/link'

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState<number>(0)
  const [tier, setTier] = useState<string>('free')
  const [isOpen, setIsOpen] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchUserData(session.user.id)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchUserData(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserData = async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('credits, tier')
      .eq('id', userId)
      .single()

    if (data) {
      setCredits(data.credits)
      setTier(data.tier)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!user) {
    return (
      <Link
        href="/auth/signin"
        className="rounded-lg bg-gradient-to-r from-[#D4A853] to-[#B8922F] px-4 py-2 text-sm font-semibold text-[#050507] transition-all hover:shadow-lg hover:shadow-[#D4A853]/20"
      >
        Войти
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-lg border border-[#D4A853]/10 bg-[#D4A853]/5 px-4 py-2 transition-all hover:bg-[#D4A853]/10"
      >
        {/* Credits */}
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-[#D4A853]" />
          <span className="text-sm font-semibold text-[#D4A853]">{credits}</span>
        </div>

        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#D4A853] to-[#B8922F] text-sm font-semibold text-[#050507]">
          {user.email?.[0].toUpperCase()}
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-[#D4A853]/10 bg-[#050507] p-2 shadow-xl">
            {/* User Info */}
            <div className="border-b border-[#D4A853]/10 px-3 py-3">
              <div className="text-sm font-medium text-[#f0ece4]">{user.email}</div>
              <div className="mt-1 text-xs text-[#f0ece4]/50">
                {tier === 'free' && '🆓 FREE'}
                {tier === 'starter' && '🚀 STARTER'}
                {tier === 'pro' && '⭐ PRO'}
                {tier === 'studio' && '💎 STUDIO'}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#f0ece4]/70 transition-all hover:bg-[#D4A853]/10 hover:text-[#f0ece4]"
                onClick={() => setIsOpen(false)}
              >
                <UserIcon className="h-4 w-4" />
                Профиль
              </Link>
              
              <Link
                href="/billing"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#f0ece4]/70 transition-all hover:bg-[#D4A853]/10 hover:text-[#f0ece4]"
                onClick={() => setIsOpen(false)}
              >
                <CreditCard className="h-4 w-4" />
                Купить credits
              </Link>

              <button
                onClick={() => {
                  setIsOpen(false)
                  handleSignOut()
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-all hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </button>
            </div>

            {/* Credits Info */}
            <div className="border-t border-[#D4A853]/10 px-3 py-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#f0ece4]/50">Доступно:</span>
                <span className="font-semibold text-[#D4A853]">{credits} credits</span>
              </div>
              {tier === 'free' && (
                <div className="mt-2 text-xs text-[#f0ece4]/40">
                  Осталось генераций сегодня: ~{Math.floor(credits / 1)}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
