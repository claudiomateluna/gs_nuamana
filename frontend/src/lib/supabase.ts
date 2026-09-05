import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Custom fetch wrapper for Supabase client.
 * Silently handles network failures during auth token refresh instead of
 * throwing TypeError: Failed to fetch that pollutes the console.
 */
function silentFetch(url: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const nativeFetch = globalThis.fetch.bind(globalThis)
  return nativeFetch(url, init).catch((err) => {
    // Return a synthetic 503 so Supabase auth treats it as a transient failure
    // instead of propagating a raw TypeError to the console.
    if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
      return new Response(JSON.stringify({ error: 'network', message: err.message }), {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' },
      })
    }
    throw err
  })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    lock: async (name, acquireTimeout, fn) => {
      return await fn()
    },
  },
  global: {
    fetch: silentFetch,
  },
})
