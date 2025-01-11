import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ADMIN = process.env.SUPABASE_ADMIN!;
export const supabase = createClient<Database>(
  EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ADMIN
);