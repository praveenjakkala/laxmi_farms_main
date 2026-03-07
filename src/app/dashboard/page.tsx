'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    RefreshCcw,
    MapPin,
    Package,
    ChevronRight,
    Clock,
    CheckCircle2,
    Truck,
    ArrowRight,
    Star,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import type { Order, Subscription } from '@/types';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3 h-3" /> },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle2 className="w-3 h-3" /> },
    processing: { label: 'Processing', color: 'bg-purple-100 text-purple-700', icon: <Package className="w-3 h-3" /> },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', icon: <Truck className="w-3 h-3" /> },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-3 h-3" /> },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: <Clock className="w-3 h-3" /> },
};

export default function DashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'there');

            const [ordersRes, subsRes] = await Promise.all([
                supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
                supabase.from('subscriptions').select('*, plan:subscription_plans(*)').eq('user_id', user.id).eq('status', 'active'),
            ]);

            setOrders(ordersRes.data || []);
            setSubscriptions(subsRes.data || []);
            setIsLoading(false);
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const activeSubsCount = subscriptions.length;

    const quickActions = [
        { icon: ShoppingBag, label: 'My Orders', href: '/dashboard/orders', color: 'bg-blue-50 text-blue-600', count: orders.length },
        { icon: RefreshCcw, label: 'Subscriptions', href: '/dashboard/subscriptions', color: 'bg-purple-50 text-purple-600', count: activeSubsCount },
        { icon: MapPin, label: 'Addresses', href: '/dashboard/addresses', color: 'bg-green-50 text-green-600', count: null },
        { icon: Star, label: 'Write Review', href: '/shop', color: 'bg-amber-50 text-amber-600', count: null },
    ];

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-28 bg-white rounded-2xl" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl" />)}
                </div>
                <div className="h-64 bg-white rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
                <div className="relative z-10">
                    <p className="text-primary-100 text-sm mb-1">Welcome back 👋</p>
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-1 capitalize">{userName}</h2>
                    <p className="text-primary-200 text-sm">
                        {orders.length > 0
                            ? `You've placed ${orders.length} order${orders.length > 1 ? 's' : ''} with us. Thank you! 🙏`
                            : "Ready to experience authentic farm-fresh taste?"}
                    </p>
                    {orders.length === 0 && (
                        <Link href="/shop" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-white text-primary-700 font-semibold rounded-xl text-sm hover:bg-primary-50 transition-colors">
                            Start Shopping <ArrowRight className="w-4 h-4" />
                        </Link>
                    )}
                </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: orders.length, suffix: '', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, suffix: '', color: 'text-primary-600', bg: 'bg-primary-50' },
                    { label: 'Active Subs', value: activeSubsCount, suffix: '', color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Addresses', value: '—', suffix: '', color: 'text-green-600', bg: 'bg-green-50' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100"
                    >
                        <div className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-medium ${stat.bg} ${stat.color} mb-3`}>
                            {stat.label}
                        </div>
                        <p className={`text-2xl font-heading font-bold ${stat.color}`}>{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-base font-heading font-semibold text-warm-800 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {quickActions.map((action, i) => (
                        <motion.div
                            key={action.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link
                                href={action.href}
                                className="flex flex-col items-center justify-center gap-2 bg-white p-4 rounded-2xl shadow-sm border border-warm-100 hover:border-primary-200 hover:shadow-md transition-all group"
                            >
                                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <action.icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-warm-700">{action.label}</span>
                                {action.count !== null && action.count > 0 && (
                                    <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                                        {action.count}
                                    </span>
                                )}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Recent Orders */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-heading font-semibold text-warm-800">Recent Orders</h3>
                    <Link href="/dashboard/orders" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                        View all <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-warm-100 overflow-hidden">
                    {orders.length === 0 ? (
                        <div className="p-12 text-center">
                            <ShoppingBag className="w-12 h-12 text-warm-200 mx-auto mb-3" />
                            <p className="text-warm-500 mb-4">No orders yet</p>
                            <Link href="/shop" className="text-sm font-semibold text-primary-600 hover:underline">
                                Browse products →
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-warm-100">
                            {orders.map((order) => {
                                const sc = statusConfig[order.status] || statusConfig.pending;
                                return (
                                    <div key={order.id} className="flex items-center justify-between p-4 hover:bg-warm-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                                                <Package className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-warm-900">
                                                    #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                                                </p>
                                                <p className="text-xs text-warm-400">
                                                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sc.color}`}>
                                                {sc.icon} {sc.label}
                                            </span>
                                            <p className="font-semibold text-primary-600 text-sm">₹{Number(order.total).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Subscription CTA */}
            {activeSubsCount === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                    <div>
                        <p className="text-xs text-purple-200 mb-1">✨ Save up to 15%</p>
                        <h3 className="text-xl font-heading font-bold mb-1">Subscribe & Save</h3>
                        <p className="text-purple-100 text-sm">Get weekly eggs or monthly chicken delivered automatically.</p>
                    </div>
                    <Link href="/dashboard/subscriptions" className="shrink-0 px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-colors text-sm whitespace-nowrap">
                        View Plans →
                    </Link>
                </motion.div>
            )}
        </div>
    );
}
