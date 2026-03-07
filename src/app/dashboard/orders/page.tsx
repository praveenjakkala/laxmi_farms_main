'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, Clock, CheckCircle2, Truck, XCircle, Download, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import type { Order } from '@/types';
import jsPDF from 'jspdf';

const statusConfig: Record<string, { label: string; color: string; icon: React.FC<{ className?: string }> }> = {
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2 },
    processing: { label: 'Processing', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Package },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: Truck },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
};

const TIMELINE_STEPS = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered'];

function downloadInvoice(order: Order) {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(22, 163, 74);
    doc.text('Laxmi Farms', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('INVOICE', 160, 20);
    doc.setFontSize(10);
    doc.text(`Order #: ${order.order_number || order.id.slice(0, 8).toUpperCase()}`, 20, 35);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-IN')}`, 20, 42);
    doc.text(`Customer: ${order.customer_name}`, 20, 49);
    doc.text(`Phone: ${order.customer_phone}`, 20, 56);

    doc.line(20, 65, 190, 65);
    doc.setFontSize(11);
    doc.text('Items', 20, 72);
    doc.text('Qty', 120, 72);
    doc.text('Price', 160, 72);
    doc.line(20, 75, 190, 75);

    let y = 83;
    const items = order.order_items || [];
    items.forEach((item) => {
        doc.setFontSize(10);
        doc.text(item.product_name || 'Product', 20, y);
        doc.text(String(item.quantity), 122, y);
        doc.text(`Rs.${item.total_price?.toLocaleString('en-IN') || '0'}`, 158, y);
        y += 8;
    });

    doc.line(20, y, 190, y);
    y += 8;
    doc.text(`Subtotal: Rs.${Number(order.subtotal).toLocaleString('en-IN')}`, 130, y);
    y += 6;
    doc.text(`Delivery: Rs.${Number(order.delivery_charge).toLocaleString('en-IN')}`, 130, y);
    y += 6;
    doc.setFontSize(12);
    doc.setTextColor(22, 163, 74);
    doc.text(`Total: Rs.${Number(order.total).toLocaleString('en-IN')}`, 130, y);
    doc.setTextColor(0, 0, 0);
    y += 14;
    doc.setFontSize(9);
    doc.text('Thank you for choosing Laxmi Farms! 🐔', 20, y);
    doc.save(`Laxmi_Farms_Invoice_${order.order_number || order.id.slice(0, 8)}.pdf`);
}

function OrderTimeline({ status }: { status: string }) {
    const currentIdx = TIMELINE_STEPS.indexOf(status);
    const isCancelled = status === 'cancelled';

    return (
        <div className="relative flex items-center gap-0 mt-4 overflow-x-auto pb-2">
            {TIMELINE_STEPS.map((step, idx) => {
                const isCompleted = currentIdx >= idx && !isCancelled;
                const isCurrent = currentIdx === idx && !isCancelled;
                const label = statusConfig[step]?.label || step;
                return (
                    <div key={step} className="flex items-center min-w-0 flex-1">
                        <div className="flex flex-col items-center shrink-0">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${isCompleted ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-warm-200 text-warm-400'} ${isCurrent ? 'ring-2 ring-primary-200 scale-110' : ''}`}>
                                {isCompleted ? '✓' : idx + 1}
                            </div>
                            <span className={`text-[9px] mt-1 text-center whitespace-nowrap font-medium ${isCompleted ? 'text-primary-600' : 'text-warm-400'}`}>
                                {label}
                            </span>
                        </div>
                        {idx < TIMELINE_STEPS.length - 1 && (
                            <div className={`h-0.5 flex-1 mx-1 rounded-full transition-all ${isCompleted && currentIdx > idx ? 'bg-primary-600' : 'bg-warm-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            setOrders(data || []);
            setIsLoading(false);
        };
        fetchOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancel = async (orderId: string) => {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        setCancelling(orderId);
        const { error } = await supabase
            .from('orders')
            .update({ status: 'cancelled', order_status: 'cancelled' })
            .eq('id', orderId);

        if (!error) {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled', order_status: 'cancelled' } : o));
        }
        setCancelling(null);
    };

    const canCancel = (order: Order) =>
        ['pending', 'confirmed'].includes(order.status);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 animate-pulse h-28" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-heading font-bold text-primary-600">My Orders</h2>
                    <p className="text-sm text-warm-500">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-warm-100">
                    <Package className="w-16 h-16 text-warm-200 mx-auto mb-4" />
                    <h3 className="text-lg font-heading font-semibold text-warm-700 mb-2">No orders yet</h3>
                    <p className="text-warm-400 mb-6">Your orders will appear here once you place them.</p>
                    <a href="/shop" className="btn-primary">Start Shopping</a>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order, idx) => {
                        const sc = statusConfig[order.status] || statusConfig.pending;
                        const StatusIcon = sc.icon;
                        const isExpanded = expandedId === order.id;

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.04 }}
                                className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden"
                            >
                                {/* Order Header */}
                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3 flex-wrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                                                <Package className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-warm-900 text-sm">
                                                    #{order.order_number || order.id.slice(0, 8).toUpperCase()}
                                                </p>
                                                <p className="text-xs text-warm-400">
                                                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                                {order.tracking_id && (
                                                    <p className="text-xs text-blue-600 mt-0.5">Track: {order.tracking_id}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${sc.color}`}>
                                                <StatusIcon className="w-3 h-3" /> {sc.label}
                                            </span>
                                            <span className="text-base font-heading font-bold text-primary-600">
                                                ₹{Number(order.total).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Timeline */}
                                    {order.status !== 'cancelled' && <OrderTimeline status={order.status} />}

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-4 flex-wrap">
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                            className="flex items-center gap-1.5 text-sm text-primary-600 font-medium hover:underline"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            {isExpanded ? 'Hide' : 'View'} Details
                                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                        </button>
                                        <button
                                            onClick={() => downloadInvoice(order)}
                                            className="flex items-center gap-1.5 text-sm text-warm-600 font-medium hover:text-primary-600 transition-colors"
                                        >
                                            <Download className="w-3.5 h-3.5" /> Invoice
                                        </button>
                                        {canCancel(order) && (
                                            <button
                                                onClick={() => handleCancel(order.id)}
                                                disabled={cancelling === order.id}
                                                className="flex items-center gap-1.5 text-sm text-red-500 font-medium hover:text-red-600 transition-colors disabled:opacity-50"
                                            >
                                                <XCircle className="w-3.5 h-3.5" />
                                                {cancelling === order.id ? 'Cancelling…' : 'Cancel'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="border-t border-warm-100 px-5 pb-5 pt-4 bg-warm-50"
                                    >
                                        <div className="space-y-3">
                                            {(order.order_items || []).map((item) => (
                                                <div key={item.id} className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-white border border-warm-200 flex items-center justify-center text-lg shrink-0">🐔</div>
                                                        <div>
                                                            <p className="text-sm font-medium text-warm-900">{item.product_name}</p>
                                                            <p className="text-xs text-warm-400">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm font-semibold text-primary-600">₹{Number(item.total_price).toLocaleString('en-IN')}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-warm-200 space-y-1">
                                            <div className="flex justify-between text-sm text-warm-600">
                                                <span>Subtotal</span>
                                                <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                                            </div>
                                            <div className="flex justify-between text-sm text-warm-600">
                                                <span>Delivery</span>
                                                <span>{Number(order.delivery_charge) === 0 ? 'FREE' : `₹${Number(order.delivery_charge).toLocaleString('en-IN')}`}</span>
                                            </div>
                                            <div className="flex justify-between text-sm font-bold text-primary-600 pt-1">
                                                <span>Total</span>
                                                <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                        {order.delivery_address && (
                                            <div className="mt-4 pt-4 border-t border-warm-200">
                                                <p className="text-xs text-warm-500 uppercase tracking-wider font-semibold mb-1">Delivery Address</p>
                                                <p className="text-sm text-warm-700">
                                                    {(order.delivery_address as { street?: string; city?: string; district?: string; pincode?: string }).street}, {(order.delivery_address as { street?: string; city?: string; district?: string; pincode?: string }).city}, {(order.delivery_address as { street?: string; city?: string; district?: string; pincode?: string }).district} - {(order.delivery_address as { street?: string; city?: string; district?: string; pincode?: string }).pincode}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
