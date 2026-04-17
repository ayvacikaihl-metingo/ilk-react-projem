import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://teqeeexvmxsdacgjtkkt.supabase.co'
const supabaseKey = 'sb_publishable_lJNedvS-iwpUzVoEarnSeQ_J1-nxklc'

export const supabase = createClient(supabaseUrl, supabaseKey)