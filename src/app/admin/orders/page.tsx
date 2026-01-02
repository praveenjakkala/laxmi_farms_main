'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Download, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import jsPDF from 'jspdf';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const supabase = createClient();

    const fetchOrders = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (!error) {
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } else {
            alert('Failed to update status');
        }
    };

    const generateInvoice = (order: any) => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Laxmi Farms - Invoice', 20, 20);

        doc.setFontSize(12);
        doc.text(`Order ID: ${order.id}`, 20, 40);
        doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, 20, 50);
        doc.text(`Customer: ${order.shipping_address?.fullName || 'Guest'}`, 20, 60);
        doc.text(`Phone: ${order.shipping_address?.phone || 'N/A'}`, 20, 70);

        doc.text('Items:', 20, 90);
        let yPos = 100;

        order.items?.forEach((item: any) => {
            doc.text(`- ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`, 25, yPos);
            yPos += 10;
        });

        doc.text(`Total Amount: ₹${order.amount}`, 20, yPos + 20);
        doc.text(`Payment Status: ${order.payment_status || 'Paid'}`, 20, yPos + 30);

        doc.save(`invoice_${order.id}.pdf`);
    };

    const filteredOrders = orders.filter((order) => {
        const customerName = order.shipping_address?.fullName || '';
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        processing: 'bg-purple-100 text-purple-800',
        out_for_delivery: 'bg-orange-100 text-orange-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    const paymentStatusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-heading font-bold text-primary-600">Orders</h1>
                <p className="text-warm-500">Manage and track customer orders</p>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: 'All Orders', value: orders.length, color: 'bg-warm-100 text-warm-700' },
                    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-100 text-yellow-700' },
                    { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'bg-purple-100 text-purple-700' },
                    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'bg-green-100 text-green-700' },
                    { label: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: 'bg-red-100 text-red-700' },
                ].map((stat) => (
                    <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm opacity-80">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
                        <input
                            type="text"
                            placeholder="Search by order ID or customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-12"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field w-full sm:w-48"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-warm-50 text-left">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-warm-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-warm-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-primary-600" title={order.id}>
                                                {order.receipt || order.id.slice(0, 8)}..
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-warm-900">{order.shipping_address?.fullName || 'Guest'}</p>
                                            <p className="text-sm text-warm-500">{order.shipping_address?.phone || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-warm-600">
                                            {order.items?.length || 0} items
                                        </td>
                                        <td className="px-6 py-4 font-medium text-warm-900">₹{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                className={`text-xs font-medium rounded-full px-3 py-1 border-0 cursor-pointer ${statusColors[order.status] || 'bg-gray-100'}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="processing">Processing</option>
                                                <option value="out_for_delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${paymentStatusColors[order.payment_status || 'paid'] || 'bg-green-100 text-green-800'}`}>
                                                {(order.payment_status || 'paid').toUpperCase()}
                                            </span>
                                            <p className="text-xs text-warm-500 mt-1">RAZORPAY</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-warm-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 hover:bg-warm-100 rounded-lg transition-colors" title="View Details">
                                                    <Eye className="w-4 h-4 text-warm-500" />
                                                </button>
                                                <button
                                                    onClick={() => generateInvoice(order)}
                                                    className="p-2 hover:bg-warm-100 rounded-lg transition-colors"
                                                    title="Download Invoice"
                                                >
                                                    <Download className="w-4 h-4 text-warm-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-warm-500">No orders found matching your criteria.</p>
                    </div>
                )}

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-warm-200 flex items-center justify-between">
                    <p className="text-sm text-warm-500">
                        Showing {filteredOrders.length} orders
                    </p>
                </div>
            </div>
        </div>
    );
}
