'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import {
    ArrowLeft,
    MapPin,
    Building2,
    Truck,
    CreditCard,
    Banknote,
    Shield,
    Check
} from 'lucide-react';
import { useCart } from '@/lib/cart';
import Button from '@/components/ui/Button';

type DeliveryType = 'home_delivery' | 'farm_pickup';
type PaymentMethod = 'upi' | 'razorpay' | 'cod';

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getSubtotal, clearCart } = useCart();
    const [subtotal, setSubtotal] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deliveryType, setDeliveryType] = useState<DeliveryType>('home_delivery');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        street: '',
        city: '',
        district: 'Nalgonda',
        state: 'Telangana',
        pincode: '',
        landmark: '',
        notes: '',
    });

    useEffect(() => {
        setSubtotal(getSubtotal());
    }, [items, getSubtotal]);

    const deliveryCharge = deliveryType === 'farm_pickup' ? 0 : subtotal >= 1000 ? 0 : 50;
    const total = subtotal + deliveryCharge;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: total,
                    products: items.map(item => ({
                        product_id: item.product.id,
                        name: item.product.name,
                        quantity: item.quantity,
                        unit_price: item.unit_price,
                        total_price: item.unit_price * item.quantity
                    })),
                    address: deliveryType === 'home_delivery' ? formData : { ...formData, street: 'Farm Pickup', city: 'Nalgonda', district: 'Nalgonda', pincode: '508001' },
                    paymentMethod,
                    deliveryType
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (paymentMethod === 'razorpay') {
                if (!window.Razorpay) {
                    alert("Razorpay SDK failed to load. Are you online?");
                    setIsSubmitting(false);
                    return;
                }

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: data.amount,
                    currency: data.currency,
                    name: 'Laxmi Farms',
                    description: 'Order Payment',
                    order_id: data.id,
                    handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
                        // On success, redirect to success page
                        // In a real app, you'd call an API to verify signature
                        console.log(response);
                        clearCart();
                        router.push(`/order-success/${data.dbOrderId}`);
                    },
                    prefill: {
                        name: formData.name,
                        email: formData.email,
                        contact: formData.phone,
                    },
                    theme: {
                        color: '#16A34A', // natural-green-600
                    },
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
                setIsSubmitting(false); // Reset submitting state as modal is open
            } else {
                // COD or manual UPI
                clearCart();
                router.push(`/order-success/${data.dbOrderId}`);
            }

        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(error.message || 'Failed to place order. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-warm-50 flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-heading font-bold text-primary-600 mb-4">
                        Your cart is empty
                    </h2>
                    <p className="text-warm-600 mb-8">
                        Add some products to your cart before checkout.
                    </p>
                    <Link href="/shop" className="btn-primary">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-warm-50">
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            {/* Header */}
            <div className="bg-white border-b border-warm-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/shop" className="p-2 hover:bg-warm-100 rounded-xl transition-colors">
                            <ArrowLeft className="w-6 h-6 text-warm-600" />
                        </Link>
                        <h1 className="text-2xl font-heading font-bold text-primary-600">Checkout</h1>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Customer Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-card"
                            >
                                <h2 className="text-lg font-heading font-semibold text-primary-600 mb-6">
                                    Customer Details
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-warm-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="Your full name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-warm-700 mb-2">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="+91 XXXXX XXXXX"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-warm-700 mb-2">
                                            Email (Optional)
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Delivery Type */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-card"
                            >
                                <h2 className="text-lg font-heading font-semibold text-primary-600 mb-6">
                                    Delivery Method
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setDeliveryType('home_delivery')}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${deliveryType === 'home_delivery'
                                            ? 'border-primary-600 bg-primary-50'
                                            : 'border-warm-200 hover:border-warm-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${deliveryType === 'home_delivery' ? 'bg-primary-600 text-white' : 'bg-warm-100 text-warm-600'
                                                }`}>
                                                <Truck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-warm-900">Home Delivery</p>
                                                <p className="text-sm text-warm-500">Delivered to your address</p>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDeliveryType('farm_pickup')}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${deliveryType === 'farm_pickup'
                                            ? 'border-primary-600 bg-primary-50'
                                            : 'border-warm-200 hover:border-warm-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${deliveryType === 'farm_pickup' ? 'bg-primary-600 text-white' : 'bg-warm-100 text-warm-600'
                                                }`}>
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-warm-900">Farm Pickup</p>
                                                <p className="text-sm text-warm-500">Pick up from our farm</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </motion.div>

                            {/* Delivery Address */}
                            {deliveryType === 'home_delivery' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl p-6 shadow-card"
                                >
                                    <h2 className="text-lg font-heading font-semibold text-primary-600 mb-6 flex items-center gap-2">
                                        <MapPin className="w-5 h-5" />
                                        Delivery Address
                                    </h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-warm-700 mb-2">
                                                Street Address *
                                            </label>
                                            <input
                                                type="text"
                                                name="street"
                                                required
                                                value={formData.street}
                                                onChange={handleInputChange}
                                                className="input-field"
                                                placeholder="House/Flat No, Street, Area"
                                            />
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-warm-700 mb-2">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    required
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="input-field"
                                                    placeholder="City/Town"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-warm-700 mb-2">
                                                    District *
                                                </label>
                                                <select
                                                    name="district"
                                                    required
                                                    value={formData.district}
                                                    onChange={handleInputChange}
                                                    className="input-field"
                                                >
                                                    <option value="Nalgonda">Nalgonda</option>
                                                    <option value="Hyderabad">Hyderabad</option>
                                                    <option value="Suryapet">Suryapet</option>
                                                    <option value="Khammam">Khammam</option>
                                                    <option value="Warangal">Warangal</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-warm-700 mb-2">
                                                    Pincode *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="pincode"
                                                    required
                                                    value={formData.pincode}
                                                    onChange={handleInputChange}
                                                    className="input-field"
                                                    placeholder="508001"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-warm-700 mb-2">
                                                    Landmark
                                                </label>
                                                <input
                                                    type="text"
                                                    name="landmark"
                                                    value={formData.landmark}
                                                    onChange={handleInputChange}
                                                    className="input-field"
                                                    placeholder="Near..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Payment Method */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl p-6 shadow-card"
                            >
                                <h2 className="text-lg font-heading font-semibold text-primary-600 mb-6 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Payment Method
                                </h2>
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cod')}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${paymentMethod === 'cod'
                                            ? 'border-primary-600 bg-primary-50'
                                            : 'border-warm-200 hover:border-warm-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Banknote className="w-6 h-6 text-natural-green" />
                                            <div>
                                                <p className="font-medium text-warm-900">Cash on Delivery</p>
                                                <p className="text-sm text-warm-500">Pay when you receive</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'cod' && (
                                            <Check className="w-5 h-5 text-primary-600" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('upi')}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${paymentMethod === 'upi'
                                            ? 'border-primary-600 bg-primary-50'
                                            : 'border-warm-200 hover:border-warm-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 flex items-center justify-center text-lg">📱</div>
                                            <div>
                                                <p className="font-medium text-warm-900">UPI Payment</p>
                                                <p className="text-sm text-warm-500">Google Pay, PhonePe, etc.</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'upi' && (
                                            <Check className="w-5 h-5 text-primary-600" />
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('razorpay')}
                                        className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between ${paymentMethod === 'razorpay'
                                            ? 'border-primary-600 bg-primary-50'
                                            : 'border-warm-200 hover:border-warm-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-6 h-6 text-blue-500" />
                                            <div>
                                                <p className="font-medium text-warm-900">Card / Net Banking</p>
                                                <p className="text-sm text-warm-500">Pay securely via Razorpay</p>
                                            </div>
                                        </div>
                                        {paymentMethod === 'razorpay' && (
                                            <Check className="w-5 h-5 text-primary-600" />
                                        )}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Order Notes */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl p-6 shadow-card"
                            >
                                <h2 className="text-lg font-heading font-semibold text-primary-600 mb-4">
                                    Order Notes (Optional)
                                </h2>
                                <textarea
                                    name="notes"
                                    rows={3}
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="input-field resize-none"
                                    placeholder="Special instructions for your order..."
                                />
                            </motion.div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl p-6 shadow-card sticky top-28"
                            >
                                <h2 className="text-lg font-heading font-semibold text-primary-600 mb-6">
                                    Order Summary
                                </h2>

                                {/* Items */}
                                <div className="space-y-4 mb-6">
                                    {items.map((item) => (
                                        <div key={item.product.id} className="flex gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-warm-100 flex items-center justify-center flex-shrink-0">
                                                {item.product.images && item.product.images[0] ? (
                                                    <Image
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        width={64}
                                                        height={64}
                                                        className="object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    item.product.image_url ? (
                                                        <Image
                                                            src={item.product.image_url}
                                                            alt={item.product.name}
                                                            width={64}
                                                            height={64}
                                                            className="object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <span className="text-2xl">🐔</span>
                                                    )
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-warm-900 line-clamp-1">{item.product.name}</p>
                                                <p className="text-sm text-warm-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-primary-600">
                                                ₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-warm-200 pt-4 space-y-3">
                                    <div className="flex justify-between text-warm-600">
                                        <span>Subtotal</span>
                                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-warm-600">
                                        <span>Delivery</span>
                                        <span className={deliveryCharge === 0 ? 'text-natural-green' : ''}>
                                            {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                                        </span>
                                    </div>
                                    {deliveryCharge > 0 && subtotal < 1000 && (
                                        <p className="text-xs text-warm-500">
                                            Add ₹{(1000 - subtotal).toLocaleString('en-IN')} more for free delivery
                                        </p>
                                    )}
                                    <div className="flex justify-between text-lg font-heading font-bold text-primary-600 pt-3 border-t border-warm-200">
                                        <span>Total</span>
                                        <span>₹{total.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={isSubmitting}
                                    className="w-full mt-6"
                                >
                                    {paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Pay'}
                                </Button>

                                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-warm-500">
                                    <Shield className="w-4 h-4" />
                                    <span>Secure checkout</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
