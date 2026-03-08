import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

// Server-side client with service role key (bypasses RLS)
// Lazy initialization to avoid build-time errors
let _supabase: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (!_supabase) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials')
    }
    _supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return _supabase
}

// Для обратной совместимости - экспортируем getter как supabase
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get: (target, prop) => {
    const client = getSupabase()
    return (client as any)[prop]
  }
})

// Client-side safe client (uses anon key, respects RLS)
export const supabaseClient = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  
  if (!url || !key) {
    // Return dummy client for build time
    return null as any
  }
  
  return createClient(url, key)
})()

export default getSupabase
