'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Tags,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Package, label: 'Products', href: '/admin/products' },
    { icon: Tags, label: 'Categories', href: '/admin/categories' },
    { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check admin session
        const session = localStorage.getItem('admin_session');
        if (session) {
            const sessionData = JSON.parse(session);
            if (sessionData.authenticated) {
                setIsAuthenticated(true);
            } else {
                router.push('/admin/login');
            }
        } else {
            router.push('/admin/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('admin_session');
        router.push('/admin/login');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-warm-100 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-warm-50">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-warm-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-100 flex items-center justify-center bg-white">
                            <Image
                                src="/logo.jpg"
                                alt="Laxmi Farms Logo"
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div>
                            <h1 className="font-heading font-bold text-primary-600">Laxmi Farms</h1>
                            <p className="text-xs text-warm-500">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${pathname === item.href
                                ? 'bg-primary-600 text-white'
                                : 'text-warm-700 hover:bg-warm-100'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-warm-200">
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
            <div className="lg:ml-64">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white border-b border-warm-200">
                    <div className="flex items-center justify-between px-6 py-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 rounded-xl hover:bg-warm-100 transition-colors"
                        >
                            {isSidebarOpen ? (
                                <X className="w-6 h-6 text-warm-600" />
                            ) : (
                                <Menu className="w-6 h-6 text-warm-600" />
                            )}
                        </button>

                        {/* Page Title */}
                        <div className="hidden lg:block">
                            <h2 className="text-lg font-heading font-semibold text-primary-600">
                                {navItems.find((item) => item.href === pathname)?.label || 'Admin'}
                            </h2>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative p-2 rounded-xl hover:bg-warm-100 transition-colors">
                                <Bell className="w-5 h-5 text-warm-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </button>

                            {/* User Menu */}
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                                    <span className="text-primary-600 font-semibold">P</span>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-warm-900">Praveen</p>
                                    <p className="text-xs text-warm-500">Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
