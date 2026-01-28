import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const SUPABASE_ADMIN = process.env.EXPO_PUBLIC_SUPABASE_ADMIN as string;

export const supabase = createClient<Database>(
  SUPABASE_URL, SUPABASE_ADMIN
); 