import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || supabaseUrl === 'undefined' || !supabaseAnonKey || supabaseAnonKey === 'undefined') {
        // Return a mock client during build if environment variables are missing
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

    const cookieStore = await cookies();

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch {
                        // Server Component - ignore
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch {
                        // Server Component - ignore
                    }
                },
            },
        }
    );
}
