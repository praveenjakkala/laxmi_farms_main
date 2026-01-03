'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Package, Phone, ArrowRight, Home } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';

export default function OrderSuccessPage() {
    const params = useParams();
    const orderId = params.id as string;
    const [orderNumber, setOrderNumber] = useState<string>('');
    const supabase = createClient();

    useEffect(() => {
        const fetchOrder = async () => {
            const { data } = await supabase
                .from('orders')
                .select('order_number')
                .eq('id', orderId)
                .single();

            if (data?.order_number) {
                setOrderNumber(data.order_number);
            }
        };
        fetchOrder();
    }, [orderId, supabase]);

    return (
        <div className="min-h-screen bg-warm-50 flex items-center justify-center py-16">
            <div className="max-w-lg mx-auto px-4 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-24 h-24 mx-auto mb-8 rounded-full bg-natural-green/10 flex items-center justify-center"
                >
                    <CheckCircle className="w-16 h-16 text-natural-green" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-600 mb-4">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-warm-600 mb-8">
                        Thank you for your order. We&apos;ve received your order and will begin
                        processing it right away.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 shadow-card mb-8"
                >
                    <div className="flex items-center justify-center gap-2 text-warm-500 mb-4">
                        <Package className="w-5 h-5" />
                        <span>Order Number</span>
                    </div>
                    <p className="text-2xl font-heading font-bold text-primary-600 mb-4 uppercase">
                        {orderNumber || 'LF-...' || orderId.slice(0, 8)}
                    </p>
                    <p className="text-sm text-warm-500">
                        Please save this order number for future reference
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-primary-50 rounded-2xl p-6 mb-8"
                >
                    <h3 className="font-heading font-semibold text-primary-600 mb-3">
                        What&apos;s Next?
                    </h3>
                    <ul className="text-sm text-warm-700 space-y-2 text-left">
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600 flex-shrink-0">1</span>
                            <span>You&apos;ll receive an order confirmation call shortly</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600 flex-shrink-0">2</span>
                            <span>We&apos;ll prepare your fresh order at the farm</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600 flex-shrink-0">3</span>
                            <span>Your order will be delivered/ready for pickup</span>
                        </li>
                    </ul>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/" className="btn-primary">
                        <Home className="w-5 h-5 mr-2" />
                        Back to Home
                    </Link>
                    <a href="tel:9885167159" className="btn-secondary">
                        <Phone className="w-5 h-5 mr-2" />
                        Contact Support
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 pt-8 border-t border-warm-200"
                >
                    <p className="text-warm-500 text-sm mb-4">
                        Have any questions about your order?
                    </p>
                    <Link
                        href="/faq"
                        className="inline-flex items-center text-primary-600 hover:underline"
                    >
                        Check our FAQ
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
