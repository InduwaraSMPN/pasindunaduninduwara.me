import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a supabase client for browser-side usage
export const supabase = typeof window !== 'undefined'
  ? createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  : createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get the current user
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return {
    ...session.user,
    ...profile
  };
}

// Helper function to check if the current user is an admin
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.is_admin || false;
}
