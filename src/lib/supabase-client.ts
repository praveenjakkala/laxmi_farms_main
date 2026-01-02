import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Check if variables are missing or set to placeholder strings during build
    if (!supabaseUrl || supabaseUrl === 'undefined' || !supabaseAnonKey || supabaseAnonKey === 'undefined') {
        // Return a mock client during build if environment variables are missing
        if (typeof window === 'undefined') {
            console.warn('Supabase credentials missing during server-side execution/build. Returning mock client.');
        }
        return {
            from: () => ({
                select: () => ({
                    eq: () => ({
                        order: () => Promise.resolve({ data: [], error: null }),
                        single: () => Promise.resolve({ data: null, error: null }),
                        limit: () => Promise.resolve({ data: [], error: null }),
                    }),
                    order: () => Promise.resolve({ data: [], error: null }),
                    single: () => Promise.resolve({ data: null, error: null }),
                    limit: () => Promise.resolve({ data: [], error: null }),
                }),
                insert: () => Promise.resolve({ data: null, error: null }),
                update: () => Promise.resolve({ data: null, error: null }),
                delete: () => Promise.resolve({ data: null, error: null }),
            }),
            auth: {
                getSession: () => Promise.resolve({ data: { session: null }, error: null }),
                getUser: () => Promise.resolve({ data: { user: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
                signOut: () => Promise.resolve({ error: null }),
            },
        } as any;
    }

    return createBrowserClient(
        supabaseUrl,
        supabaseAnonKey
    );
}
