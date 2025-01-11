import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ADMIN = process.env.SUPABASE_ADMIN!;
export const supabase = createClient<Database>(
  SUPABASE_URL, SUPABASE_ADMIN
);