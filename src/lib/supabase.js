// ═══════════════════════════════════════════════════════════
//  Supabase client
//
//  Reads its config from environment variables so no keys ever
//  live in the repo. Set these in Render → Environment:
//
//    VITE_SUPABASE_URL       https://xxxx.supabase.co
//    VITE_SUPABASE_ANON_KEY  eyJ...
//
//  Vite bakes VITE_* variables in at build time, so after
//  changing them you must redeploy for the change to apply.
// ═══════════════════════════════════════════════════════════
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

/** False when the env vars are missing — the app shows a setup notice. */
export const isConfigured = Boolean(url && key)

export const supabase = isConfigured
  ? createClient(url, key, { auth: { persistSession: false } })
  : null

if (!isConfigured) {
  console.error(
    'Supabase is not configured. Add VITE_SUPABASE_URL and ' +
    'VITE_SUPABASE_ANON_KEY to your environment, then redeploy.'
  )
}
