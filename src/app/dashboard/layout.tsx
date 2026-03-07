'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    RefreshCcw,
    MapPin,
    User,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: ShoppingBag, label: 'My Orders', href: '/dashboard/orders' },
    { icon: RefreshCcw, label: 'Subscriptions', href: '/dashboard/subscriptions' },
    { icon: MapPin, label: 'Addresses', href: '/dashboard/addresses' },
    { icon: User, label: 'Profile', href: '/dashboard/profile' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string; avatar_url?: string } } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login?redirect=/dashboard');
                return;
            }
            setUser(user);
            setIsLoading(false);
        };
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const currentNavItem = navItems.find(item => item.href === pathname);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-warm-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-warm-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const avatarLetter = (user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase();

    return (
        <div className="min-h-screen bg-warm-50">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header */}
                <div className="p-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold border-2 border-white/30 shrink-0">
                            {user?.user_metadata?.avatar_url ? (
                                <Image src={user.user_metadata.avatar_url} alt="Avatar" width={56} height={56} className="rounded-full object-cover" />
                            ) : (
                                avatarLetter
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="font-heading font-bold text-lg truncate">
                                {user?.user_metadata?.full_name || 'My Account'}
                            </p>
                            <p className="text-primary-100 text-xs truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Farm Brand */}
                <div className="px-6 py-4 border-b border-warm-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-primary-100 shrink-0">
                        <Image src="/logo.jpg" alt="Laxmi Farms" width={32} height={32} className="object-cover w-full h-full" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-primary-600">Laxmi Farms</p>
                        <p className="text-[10px] text-warm-400">Customer Dashboard</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                    : 'text-warm-700 hover:bg-warm-100 hover:text-primary-600'
                                    }`}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                <span className="font-medium">{item.label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-warm-100 space-y-2">
                    <Link
                        href="/shop"
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-warm-700 hover:bg-warm-100 transition-all"
                    >
                        <ShoppingBag className="w-5 h-5 text-primary-600" />
                        <span className="font-medium">Continue Shopping</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-warm-700 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-72 min-h-screen">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-warm-200">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden p-2 rounded-xl hover:bg-warm-100 transition-colors"
                            >
                                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                            <div>
                                <h1 className="text-lg font-heading font-bold text-primary-600">
                                    {currentNavItem?.label || 'Dashboard'}
                                </h1>
                                <p className="text-xs text-warm-400 hidden sm:block">
                                    Laxmi Farms Customer Portal
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/shop" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium hover:bg-primary-100 transition-colors">
                                <ShoppingBag className="w-4 h-4" />
                                Shop Now
                            </Link>
                            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                                {avatarLetter}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
