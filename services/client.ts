import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { SUPABASE_URL, SUPABASE_ADMIN } from '@env'

export const supabase = createClient<Database>(
    SUPABASE_URL, SUPABASE_ADMIN
)