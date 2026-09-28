import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Faltan variables de entorno para Supabase (VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY). ' +
    'Verifica que exista tu archivo .env con las credenciales requeridas.'
  )
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
