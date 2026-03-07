import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials')
}

// Server-side client with service role key (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Client-side safe client (uses anon key, respects RLS)
export const supabaseClient = createClient(
  supabaseUrl,
  process.env.SUPABASE_ANON_KEY!
)

export default supabase
