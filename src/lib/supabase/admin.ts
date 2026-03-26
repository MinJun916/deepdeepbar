import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

export const canUseSupabaseAdmin = Boolean(supabaseUrl && supabaseSecretKey);

export const createSupabaseAdminClient = () => {
  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error('SUPABASE_SECRET_KEY is required for admin operations.');
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};
