import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase client configuration for client-side usage with anon key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

// Create and export the Supabase client
export const supabase: SupabaseClient = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            // Configure auth to work with Row Level Security (RLS)
            persistSession: true,
            autoRefreshToken: true,
        },
    }
);

// Helper function for anonymous data access
export const getSupabaseClient = (): SupabaseClient => {
    return supabase;
};
