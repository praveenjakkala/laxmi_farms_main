import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || supabaseUrl === 'undefined' || !supabaseAnonKey || supabaseAnonKey === 'undefined') {
        // Skip middleware logic if Supabase credentials are missing (e.g., during build or if not configured)
        return response;
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protect Admin Routes (Security Layer)
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Public admin routes (login)
        if (request.nextUrl.pathname === '/admin/login') {
            if (user) {
                // If already logged in, redirect to dashboard
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return response;
        }

        // Protected admin routes
        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Check if user is an allowed admin
        // Check if user is an allowed admin
        const ALLOWED_ADMINS = ['laxmifarms001@gmail.com'];
        // Check if the email is in the allowed list
        const userEmail = user.email || '';
        if (!ALLOWED_ADMINS.includes(userEmail)) {
            // Redirect unauthorized users to shop
            return NextResponse.redirect(new URL('/shop', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images/ (public images)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|images/|api/).*)',
    ],
};
