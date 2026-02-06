'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, clearCart } = useCart();
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        setSubtotal(getSubtotal());
    }, [items, getSubtotal]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-warm-200">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
                                <h2 className="text-lg sm:text-xl font-heading font-semibold text-primary-600">
                                    Your Cart
                                </h2>
                                <span className="badge-primary text-xs">{items.length} items</span>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 rounded-xl hover:bg-warm-100 transition-colors"
                                aria-label="Close cart"
                            >
                                <X className="w-6 h-6 text-warm-600" />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-24 h-24 rounded-full bg-warm-100 flex items-center justify-center mb-4">
                                        <ShoppingBag className="w-12 h-12 text-warm-400" />
                                    </div>
                                    <h3 className="text-lg font-heading font-semibold text-warm-700 mb-2">
                                        Your cart is empty
                                    </h3>
                                    <p className="text-warm-500 mb-6">
                                        Add some fresh products to get started!
                                    </p>
                                    <Link href="/shop" onClick={closeCart} className="btn-primary">
                                        Browse Products
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.product.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-warm-50 rounded-xl"
                                        >
                                            {/* Image */}
                                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                {item.product.images && item.product.images[0] ? (
                                                    <Image
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-warm-200 flex items-center justify-center">
                                                        <span className="text-2xl">🐔</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm sm:text-base text-warm-900 line-clamp-1">
                                                    {item.product.name}
                                                </h4>
                                                {item.weight_option && (
                                                    <p className="text-xs sm:text-sm text-warm-500">{item.weight_option}</p>
                                                )}
                                                <p className="text-primary-600 font-semibold text-sm sm:text-base mt-0.5 sm:mt-1">
                                                    {formatPrice(item.unit_price)}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-1.5 sm:mt-2">
                                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-warm-200 flex items-center justify-center hover:bg-warm-50 transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        </button>
                                                        <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-warm-200 flex items-center justify-center hover:bg-warm-50 transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.product.id)}
                                                        className="p-2 text-warm-400 hover:text-red-500 transition-colors"
                                                        aria-label="Remove item"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Clear Cart */}
                                    <button
                                        onClick={clearCart}
                                        className="w-full py-2 text-sm text-warm-500 hover:text-red-500 transition-colors"
                                    >
                                        Clear all items
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-warm-200 p-4 sm:p-6 space-y-3 sm:space-y-4 safe-area-bottom">
                                {/* Subtotal */}
                                <div className="flex items-center justify-between">
                                    <span className="text-warm-600 text-sm sm:text-base">Subtotal</span>
                                    <span className="text-lg sm:text-xl font-heading font-bold text-primary-600">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-warm-500">
                                    Delivery charges calculated at checkout
                                </p>

                                {/* Actions */}
                                <div className="space-y-2">
                                    <Link
                                        href="/checkout"
                                        onClick={closeCart}
                                        className="btn-primary w-full flex items-center justify-center gap-2"
                                    >
                                        Proceed to Checkout
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={closeCart}
                                        className="btn-secondary w-full"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
