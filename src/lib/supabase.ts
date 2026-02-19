import { createClient, SupabaseClient } from '@supabase/supabase-js'

// --- Server-side (lazy init, only when called) ---

let _supabaseAdmin: SupabaseClient | null = null

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }
  return _supabaseAdmin
}

// --- Client-side (lazy singleton via getter) ---

let _supabaseClient: SupabaseClient | null = null

function getSupabaseClient() {
  if (!_supabaseClient) {
    _supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _supabaseClient
}

// Proxy object that lazily initializes the Supabase client on first access.
// This avoids build-time initialization errors while keeping imports simple.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})
