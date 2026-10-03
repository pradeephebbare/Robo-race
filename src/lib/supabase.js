import { createClient } from '@supabase/supabase-js'
import { defaultEventSettings } from '../config/eventConfig'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export const fetchEventSettings = async () => {
  if (!isSupabaseConfigured) {
    return defaultEventSettings
  }

  const { data, error } = await supabase
    .from('event_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data || defaultEventSettings
}
