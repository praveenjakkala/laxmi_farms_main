'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingCart,
    Package,
    Users,
    IndianRupee,
    ArrowUpRight,
    ArrowDownRight,
    Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        { title: 'Total Revenue', value: '₹0', change: '0%', isPositive: true, icon: IndianRupee, color: 'bg-green-500' },
        { title: 'Total Orders', value: '0', change: '0%', isPositive: true, icon: ShoppingCart, color: 'bg-blue-500' },
        { title: 'Products', value: '0', change: '0', isPositive: true, icon: Package, color: 'bg-purple-500' },
        { title: 'Customers', value: '0', change: '0%', isPositive: true, icon: Users, color: 'bg-orange-500' },
    ]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Orders
                const { data: orders, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (ordersError) throw ordersError;

                // Calculate Stats
                const totalRevenue = orders?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;
                const totalOrders = orders?.length || 0;

                // Fetch Products Count
                const { count: productsCount, error: productsError } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true });

                if (productsError) throw productsError;

                // Fetch Unique Customers
                // Assuming user_id is in orders for now, or we could query 'profiles' if it existed
                const uniqueCustomers = new Set(orders?.map(o => o.user_id).filter(Boolean)).size;

                setStats([
                    { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, change: '+0%', isPositive: true, icon: IndianRupee, color: 'bg-green-500' },
                    { title: 'Total Orders', value: totalOrders.toString(), change: '+0%', isPositive: true, icon: ShoppingCart, color: 'bg-blue-500' },
                    { title: 'Products', value: productsCount?.toString() || '0', change: '+0', isPositive: true, icon: Package, color: 'bg-purple-500' },
                    { title: 'Customers', value: uniqueCustomers.toString(), change: '+0%', isPositive: true, icon: Users, color: 'bg-orange-500' },
                ]);

                // Set Recent Orders (Top 5)
                setRecentOrders(orders?.slice(0, 5).map(order => ({
                    id: order.receipt || order.id.slice(0, 8), // Use receipt or truncated ID
                    customer: order.shipping_address?.fullName || 'Guest',
                    amount: order.amount,
                    status: order.status,
                    date: new Date(order.created_at).toLocaleDateString()
                })) || []);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        processing: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-card"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <p className="text-2xl font-heading font-bold text-primary-600">{stat.value}</p>
                        <p className="text-warm-500 text-sm">{stat.title}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-3 bg-white rounded-2xl shadow-card overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-warm-200 flex items-center justify-between">
                        <h3 className="font-heading font-semibold text-primary-600">Recent Orders</h3>
                        <a href="/admin/orders" className="text-sm text-primary-600 hover:underline">
                            View All
                        </a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-warm-50 text-left">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-xs font-semibold text-warm-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-warm-100">
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-warm-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-primary-600">{order.id}</td>
                                            <td className="px-6 py-4 text-sm text-warm-700">{order.customer}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-warm-900">₹{order.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                    {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-warm-500">{order.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-warm-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
