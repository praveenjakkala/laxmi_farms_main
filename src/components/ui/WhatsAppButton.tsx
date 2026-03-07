'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';

const WHATSAPP_NUMBER = '919885167159'; // Admin WhatsApp number
const BUSINESS_NAME = 'Laxmi Farms';

function buildWhatsAppMessage(cartItems: { product: { name: string }; quantity: number; unit_price: number }[], total: number): string {
    if (cartItems.length === 0) {
        return encodeURIComponent(
            `Hello ${BUSINESS_NAME}! 🐔\n\nI'm interested in ordering farm-fresh products. Could you please help me?\n\nThank you!`
        );
    }

    const itemLines = cartItems.map(item =>
        `• ${item.product.name} × ${item.quantity} = ₹${(item.unit_price * item.quantity).toLocaleString('en-IN')}`
    ).join('\n');

    const message = `Hello ${BUSINESS_NAME}! 🐔\n\nI'd like to place an order:\n\n${itemLines}\n\n💰 *Total: ₹${total.toLocaleString('en-IN')}*\n\nPlease confirm availability and delivery details.\n\nThank you! 🙏`;

    return encodeURIComponent(message);
}

export default function WhatsAppButton() {
    const [isExpanded, setIsExpanded] = useState(false);
    const { items, getSubtotal } = useCart();
    const total = getSubtotal();

    const openWhatsApp = (withCart: boolean = false) => {
        const msg = withCart
            ? buildWhatsAppMessage(items, total)
            : buildWhatsAppMessage([], 0);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl border border-warm-100 p-4 w-64 space-y-3"
                    >
                        <div className="flex items-center gap-2 pb-2 border-b border-warm-100">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-warm-900">WhatsApp Order</p>
                                <p className="text-xs text-green-600">● Online Now</p>
                            </div>
                        </div>

                        <p className="text-xs text-warm-500">Quick order via WhatsApp – get instant confirmation!</p>

                        <div className="space-y-2">
                            {items.length > 0 && (
                                <button
                                    onClick={() => openWhatsApp(true)}
                                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Order Cart ({items.length} items)
                                </button>
                            )}
                            <button
                                onClick={() => openWhatsApp(false)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 bg-warm-100 text-warm-800 rounded-xl text-sm font-medium hover:bg-warm-200 transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                General Enquiry
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Button */}
            <div className="relative">
                {/* Cart badge */}
                {items.length > 0 && !isExpanded && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center z-10"
                    >
                        {items.length}
                    </motion.span>
                )}

                {/* Ping animation */}
                {!isExpanded && (
                    <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-30" />
                )}

                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="relative w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl flex items-center justify-center transition-colors"
                    aria-label="Open WhatsApp"
                >
                    {isExpanded ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-current">
                            <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.4 2.1 7.8L.5 31.5l7.9-2.1c2.3 1.3 4.8 1.9 7.5 1.9C24.6 31.3 31.5 24.4 31.5 16S24.6.5 16 .5zm0 28.8c-2.5 0-4.9-.7-7-1.9l-.5-.3-5.2 1.4 1.4-5-.3-.5C3.1 21 2.4 18.6 2.4 16 2.4 8.5 8.5 2.4 16 2.4c3.6 0 7 1.4 9.6 3.9C28 8.8 29.6 12.3 29.6 16c0 7.5-6.1 13.3-13.6 13.3zm7.4-9.9c-.4-.2-2.4-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.6-.2.3-.5.3-.9.1-.4-.2-1.6-.6-3-1.8-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.2-.4.3-.7.1-.3 0-.6-.1-.8-.1-.2-1-2.4-1.4-3.3-.4-.9-.7-.8-1-.8h-.8c-.3 0-.7.1-1 .5-.4.4-1.4 1.4-1.4 3.4 0 2 1.5 4 1.7 4.2.2.3 2.9 4.5 7 6.3 1 .4 1.7.7 2.3.9.9.3 1.8.3 2.4.2.7-.1 2.4-1 2.7-1.9.3-.9.3-1.7.2-1.9-.1-.2-.4-.3-.8-.5z" />
                        </svg>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
