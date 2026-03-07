import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// In-memory rate limiting store (per edge runtime instance)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_ATTEMPTS = 5;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const record = loginAttempts.get(ip);

    if (!record || now - record.lastAttempt > RATE_LIMIT_WINDOW) {
        loginAttempts.set(ip, { count: 1, lastAttempt: now });
        return false;
    }

    if (record.count >= MAX_ATTEMPTS) {
        return true;
    }

    loginAttempts.set(ip, { count: record.count + 1, lastAttempt: now });
    return false;
}

export async function middleware(request: NextRequest) {
    // Block login-related API calls if rate-limited
    if (request.nextUrl.pathname.startsWith('/api/') && request.method === 'POST') {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            || request.headers.get('x-real-ip')
            || 'unknown';

        // Rate limit specific sensitive endpoints
        if (
            request.nextUrl.pathname.includes('/auth') ||
            request.nextUrl.pathname.includes('/login') ||
            request.nextUrl.pathname.includes('/payments')
        ) {
            if (isRateLimited(ip)) {
                return new NextResponse(
                    JSON.stringify({ error: 'Too many requests. Please wait 1 minute.' }),
                    { status: 429, headers: { 'Content-Type': 'application/json' } }
                );
            }
        }
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Add security headers to ALL responses
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || supabaseUrl === 'undefined' || !supabaseAnonKey || supabaseAnonKey === 'undefined') {
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
                    // Re-apply security headers after response recreation
                    response.headers.set('X-Content-Type-Options', 'nosniff');
                    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
                    response.headers.set('X-XSS-Protection', '1; mode=block');

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

    // ══════════════════════════
    // ADMIN ROUTE PROTECTION
    // ══════════════════════════
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (request.nextUrl.pathname === '/admin/login') {
            if (user) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
            return response;
        }

        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        const ALLOWED_ADMINS = (process.env.ADMIN_EMAILS || 'laxmifarms001@gmail.com').split(',').map(e => e.trim());
        const userEmail = user.email || '';
        if (!ALLOWED_ADMINS.includes(userEmail)) {
            return NextResponse.redirect(new URL('/shop', request.url));
        }
    }

    // ══════════════════════════
    // DASHBOARD ROUTE PROTECTION
    // ══════════════════════════
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!user) {
            const redirectUrl = new URL('/login', request.url);
            redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // ══════════════════════════
    // REDIRECT LOGGED-IN USERS FROM AUTH PAGES
    // ══════════════════════════
    if (request.nextUrl.pathname === '/login' && user) {
        const redirect = request.nextUrl.searchParams.get('redirect') || '/dashboard';
        return NextResponse.redirect(new URL(redirect, request.url));
    }

    // ══════════════════════════
    // APP MODE HANDLING
    // ══════════════════════════
    const appMode = process.env.NEXT_PUBLIC_APP_MODE;
    if (appMode === 'customer' && request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/shop', request.url));
    }
    if (appMode === 'admin' && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|images/|api/).*)',
    ],
};
