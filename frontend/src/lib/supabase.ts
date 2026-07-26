import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // lock no-op para evitar timeouts de Navigator LockManager ("lock:sb-127-auth-token") en PWA / Next.js
    lock: async (name, acquireTimeout, fn) => {
      return await fn()
    }
  }
})
