'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    ShoppingCart,
    Users,
    IndianRupee,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Star,
    RefreshCcw,
    Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

interface DailySale { date: string; revenue: number; orders: number }
interface TopProduct { name: string; count: number; revenue: number }

const BAR_COLORS = ['bg-primary-600', 'bg-primary-500', 'bg-primary-400', 'bg-primary-300', 'bg-primary-200'];

export default function AdminAnalyticsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [dailySales, setDailySales] = useState<DailySale[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        activeSubscriptions: 0,
        avgOrderValue: 0,
        reviewCount: 0,
        avgRating: 0,
    });
    const supabase = createClient();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const [ordersRes, subsRes, reviewsRes, orderItemsRes] = await Promise.all([
                    supabase.from('orders').select('*').gte('created_at', thirtyDaysAgo.toISOString()),
                    supabase.from('subscriptions').select('id, status').eq('status', 'active'),
                    supabase.from('reviews').select('rating'),
                    supabase.from('order_items').select('product_id, quantity, total_price, product_name'),
                ]);

                const orders = ordersRes.data || [];
                const subs = subsRes.data || [];
                const reviews = reviewsRes.data || [];
                const items = orderItemsRes.data || [];

                // Stats
                const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
                const uniqueCustomers = new Set(orders.filter(o => o.user_id).map(o => o.user_id)).size;
                const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

                setStats({
                    totalRevenue,
                    totalOrders: orders.length,
                    totalCustomers: uniqueCustomers,
                    activeSubscriptions: subs.length,
                    avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
                    reviewCount: reviews.length,
                    avgRating,
                });

                // Daily sales (last 14 days)
                const last14 = Array.from({ length: 14 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (13 - i));
                    return d.toISOString().split('T')[0];
                });

                const dailyMap = orders.reduce<Record<string, DailySale>>((acc, order) => {
                    const date = order.created_at.split('T')[0];
                    if (!acc[date]) acc[date] = { date, revenue: 0, orders: 0 };
                    acc[date].revenue += Number(order.total);
                    acc[date].orders += 1;
                    return acc;
                }, {});

                setDailySales(last14.map(date => dailyMap[date] || { date, revenue: 0, orders: 0 }));

                // Top products
                const productMap = items.reduce<Record<string, TopProduct>>((acc, item) => {
                    const key = item.product_name || item.product_id;
                    if (!acc[key]) acc[key] = { name: key, count: 0, revenue: 0 };
                    acc[key].count += item.quantity;
                    acc[key].revenue += Number(item.total_price);
                    return acc;
                }, {});

                setTopProducts(
                    Object.values(productMap)
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 5)
                );

            } catch (err) {
                console.error('Analytics error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const maxRevenue = Math.max(...dailySales.map(d => d.revenue), 1);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    const mainStats = [
        { label: 'Revenue (30d)', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'bg-green-500', trend: '+' },
        { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingCart, color: 'bg-blue-500', trend: '+' },
        { label: 'Customers', value: stats.totalCustomers.toString(), icon: Users, color: 'bg-purple-500', trend: '+' },
        { label: 'Avg Order Value', value: `₹${stats.avgOrderValue.toFixed(0)}`, icon: TrendingUp, color: 'bg-orange-500', trend: '+' },
        { label: 'Active Subscriptions', value: stats.activeSubscriptions.toString(), icon: RefreshCcw, color: 'bg-pink-500', trend: '+' },
        { label: 'Avg Review Rating', value: stats.avgRating.toFixed(1) + ' ⭐', icon: Star, color: 'bg-amber-500', trend: '' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-heading font-bold text-primary-600">Analytics Dashboard</h2>
                <p className="text-sm text-warm-500">Last 30 days performance overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {mainStats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.06 }}
                        className="bg-white rounded-2xl p-5 shadow-card"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            {stat.trend && (
                                <span className="flex items-center text-xs font-semibold text-green-600">
                                    <ArrowUpRight className="w-3.5 h-3.5" /> Growing
                                </span>
                            )}
                        </div>
                        <p className="text-2xl font-heading font-bold text-warm-900">{stat.value}</p>
                        <p className="text-sm text-warm-500 mt-0.5">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue Chart (last 14 days) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-2xl shadow-card p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-heading font-semibold text-primary-600">Daily Revenue</h3>
                            <p className="text-xs text-warm-400">Last 14 days</p>
                        </div>
                        <Calendar className="w-5 h-5 text-warm-300" />
                    </div>
                    <div className="flex items-end gap-1 h-40">
                        {dailySales.map((day) => {
                            const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                            const date = new Date(day.date);
                            return (
                                <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10">
                                        <div className="bg-warm-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap shadow-xl">
                                            ₹{day.revenue.toLocaleString('en-IN')}<br />
                                            <span className="text-warm-300">{day.orders} orders</span>
                                        </div>
                                        <div className="w-2 h-2 bg-warm-800 rotate-45 -mt-1" />
                                    </div>
                                    <div
                                        className="w-full bg-primary-600 rounded-t-md transition-all group-hover:bg-primary-700"
                                        style={{ height: `${Math.max(height, 2)}%` }}
                                    />
                                    <span className="text-[9px] text-warm-400 ">
                                        {date.getDate()}/{date.getMonth() + 1}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Top Products */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-card p-6"
                >
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="font-heading font-semibold text-primary-600">Top Products</h3>
                            <p className="text-xs text-warm-400">By revenue</p>
                        </div>
                        <Package className="w-5 h-5 text-warm-300" />
                    </div>
                    {topProducts.length === 0 ? (
                        <p className="text-warm-400 text-sm text-center py-8">No data yet</p>
                    ) : (
                        <div className="space-y-4">
                            {topProducts.map((product, idx) => {
                                const maxRev = topProducts[0].revenue;
                                const pct = maxRev > 0 ? (product.revenue / maxRev) * 100 : 0;
                                return (
                                    <div key={product.name}>
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-medium text-warm-800 truncate max-w-[60%]">{product.name}</p>
                                            <p className="text-sm font-bold text-primary-600">₹{product.revenue.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="h-2 bg-warm-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${BAR_COLORS[idx] || 'bg-primary-200'} transition-all`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-warm-400 mt-0.5">{product.count} units sold</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Quick Insights */}
            <div className="grid sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Reviews', value: stats.reviewCount, icon: '⭐', color: 'bg-amber-50 border-amber-100' },
                    { label: 'Subscription Revenue (est.)', value: `₹${(stats.activeSubscriptions * 800).toLocaleString('en-IN')}/mo`, icon: '🔄', color: 'bg-purple-50 border-purple-100' },
                    { label: 'Free Delivery Orders', value: `${Math.floor(stats.totalOrders * 0.6)}`, icon: '🚚', color: 'bg-green-50 border-green-100' },
                ].map((insight) => (
                    <div key={insight.label} className={`${insight.color} border rounded-2xl p-4`}>
                        <div className="text-2xl mb-2">{insight.icon}</div>
                        <p className="text-xl font-heading font-bold text-warm-900">{insight.value}</p>
                        <p className="text-sm text-warm-500">{insight.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
