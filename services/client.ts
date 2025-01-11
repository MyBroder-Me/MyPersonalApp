import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ADMIN } from '@env';

export const supabase = createClient<Database>(
  EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ADMIN
);