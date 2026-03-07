'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, Check, Pause, X, Calendar, Package, ChevronRight, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import type { Subscription, SubscriptionPlan } from '@/types';

const frequencyLabel: Record<string, string> = {
    weekly: 'Every Week',
    biweekly: 'Every 2 Weeks',
    monthly: 'Every Month',
};

const statusStyle: Record<string, string> = {
    active: 'bg-green-100 text-green-700 border-green-200',
    paused: 'bg-amber-100 text-amber-700 border-amber-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    expired: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function SubscriptionsPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'my' | 'plans'>('my');
    const [processing, setProcessing] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const [plansRes, subsRes] = await Promise.all([
                supabase.from('subscription_plans').select('*').eq('is_active', true).order('price'),
                supabase.from('subscriptions').select('*, plan:subscription_plans(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
            ]);

            setPlans(plansRes.data || []);
            setSubscriptions(subsRes.data || []);
            setIsLoading(false);
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePause = async (sub: Subscription) => {
        setProcessing(sub.id);
        const newStatus = sub.status === 'paused' ? 'active' : 'paused';
        const { error } = await supabase
            .from('subscriptions')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', sub.id);

        if (!error) {
            setSubscriptions(prev => prev.map(s => s.id === sub.id ? { ...s, status: newStatus } : s));
        }
        setProcessing(null);
    };

    const handleCancel = async (subId: string) => {
        if (!confirm('Are you sure you want to cancel this subscription? This cannot be undone.')) return;
        setProcessing(subId);
        const { error } = await supabase
            .from('subscriptions')
            .update({ status: 'cancelled', cancelled_at: new Date().toISOString(), updated_at: new Date().toISOString() })
            .eq('id', subId);

        if (!error) {
            setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status: 'cancelled' } : s));
        }
        setProcessing(null);
    };

    const handleSubscribe = async (plan: SubscriptionPlan) => {
        if (!confirm(`Subscribe to "${plan.name}" for ₹${plan.price}/${plan.frequency === 'weekly' ? 'week' : plan.frequency === 'biweekly' ? '2 weeks' : 'month'}?`)) return;
        setProcessing(plan.id);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setProcessing(null); return; }

        const nextDate = new Date();
        if (plan.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
        else if (plan.frequency === 'biweekly') nextDate.setDate(nextDate.getDate() + 14);
        else nextDate.setMonth(nextDate.getMonth() + 1);

        const { data, error } = await supabase.from('subscriptions').insert({
            user_id: user.id,
            plan_id: plan.id,
            status: 'active',
            start_date: new Date().toISOString().split('T')[0],
            next_delivery_date: nextDate.toISOString().split('T')[0],
            payment_method: 'razorpay',
        }).select('*, plan:subscription_plans(*)').single();

        if (!error && data) {
            setSubscriptions(prev => [data, ...prev]);
            setActiveTab('my');
            alert('Subscription created! You will be contacted for payment setup.');
        }
        setProcessing(null);
    };

    const activeSubs = subscriptions.filter(s => s.status === 'active' || s.status === 'paused');
    const pastSubs = subscriptions.filter(s => s.status === 'cancelled' || s.status === 'expired');

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                <div className="h-12 bg-white rounded-xl" />
                {[...Array(2)].map((_, i) => <div key={i} className="h-36 bg-white rounded-2xl" />)}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-heading font-bold text-primary-600">Subscriptions</h2>
                <p className="text-sm text-warm-500">Manage your recurring farm deliveries</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white p-1.5 rounded-xl shadow-sm border border-warm-100 w-fit">
                {[{ key: 'my', label: `My Subscriptions (${activeSubs.length})` }, { key: 'plans', label: 'Available Plans' }].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as 'my' | 'plans')}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-primary-600 text-white shadow-sm' : 'text-warm-600 hover:text-primary-600'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* My Subscriptions Tab */}
            {activeTab === 'my' && (
                <div className="space-y-4">
                    {activeSubs.length === 0 ? (
                        <div className="bg-white rounded-2xl p-10 text-center border border-warm-100">
                            <RefreshCcw className="w-14 h-14 text-warm-200 mx-auto mb-4" />
                            <h3 className="text-lg font-heading font-semibold text-warm-700 mb-2">No active subscriptions</h3>
                            <p className="text-warm-400 mb-6 text-sm">Subscribe to save up to 15% on your regular orders.</p>
                            <button onClick={() => setActiveTab('plans')} className="btn-primary">Browse Plans</button>
                        </div>
                    ) : (
                        activeSubs.map((sub, idx) => {
                            const plan = sub.plan as SubscriptionPlan;
                            return (
                                <motion.div
                                    key={sub.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-white rounded-2xl border border-warm-100 shadow-sm overflow-hidden"
                                >
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3 flex-wrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                                                    <RefreshCcw className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-warm-900">{plan?.name || 'Subscription Plan'}</h3>
                                                    <p className="text-xs text-warm-400">{frequencyLabel[plan?.frequency] || plan?.frequency} delivery</p>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${statusStyle[sub.status]}`}>
                                                {sub.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mt-4 p-3 bg-warm-50 rounded-xl">
                                            <div className="text-center">
                                                <p className="text-xs text-warm-400 mb-0.5">Amount</p>
                                                <p className="text-sm font-bold text-primary-600">₹{Number(plan?.price).toLocaleString('en-IN')}</p>
                                            </div>
                                            <div className="text-center border-x border-warm-200">
                                                <p className="text-xs text-warm-400 mb-0.5">Deliveries</p>
                                                <p className="text-sm font-bold text-warm-700">{sub.total_deliveries}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-warm-400 mb-0.5">Next Delivery</p>
                                                <p className="text-sm font-bold text-warm-700">
                                                    {sub.next_delivery_date
                                                        ? new Date(sub.next_delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                                                        : '—'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-4">
                                            {sub.status !== 'cancelled' && (
                                                <>
                                                    <button
                                                        onClick={() => handlePause(sub)}
                                                        disabled={processing === sub.id}
                                                        className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border border-warm-200 text-warm-700 hover:border-amber-300 hover:text-amber-700 transition-colors disabled:opacity-50"
                                                    >
                                                        <Pause className="w-3.5 h-3.5" />
                                                        {sub.status === 'paused' ? 'Resume' : 'Pause'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancel(sub.id)}
                                                        disabled={processing === sub.id}
                                                        className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                                                    >
                                                        <X className="w-3.5 h-3.5" /> Cancel
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}

                    {pastSubs.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-warm-500 mb-3">Past Subscriptions</h3>
                            {pastSubs.map((sub) => {
                                const plan = sub.plan as SubscriptionPlan;
                                return (
                                    <div key={sub.id} className="bg-white rounded-2xl border border-warm-100 p-4 flex items-center justify-between opacity-60">
                                        <div>
                                            <p className="text-sm font-semibold text-warm-700">{plan?.name}</p>
                                            <p className="text-xs text-warm-400">Cancelled · {sub.total_deliveries} deliveries</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle[sub.status]}`}>{sub.status}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Plans Tab */}
            {activeTab === 'plans' && (
                <div className="grid sm:grid-cols-2 gap-5">
                    {plans.map((plan, idx) => {
                        const isSubscribed = subscriptions.some(s => s.plan_id === plan.id && s.status === 'active');
                        const features = Array.isArray(plan.features) ? plan.features : [];

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.06 }}
                                className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all hover:shadow-lg ${isSubscribed ? 'border-primary-400' : 'border-warm-100 hover:border-primary-200'}`}
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-600">
                                                    {frequencyLabel[plan.frequency]}
                                                </span>
                                                {plan.discount_percent > 0 && (
                                                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                                                        {plan.discount_percent}% OFF
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-heading font-bold text-warm-900">{plan.name}</h3>
                                            <p className="text-sm text-warm-500 mt-0.5">{plan.description}</p>
                                        </div>
                                        <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
                                    </div>

                                    <div className="mb-4">
                                        <span className="text-3xl font-heading font-bold text-primary-600">₹{Number(plan.price).toLocaleString('en-IN')}</span>
                                        <span className="text-warm-400 text-sm ml-1">/{plan.frequency === 'weekly' ? 'week' : plan.frequency === 'biweekly' ? '2 weeks' : 'month'}</span>
                                    </div>

                                    <ul className="space-y-2 mb-5">
                                        {features.map((feat, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-warm-700">
                                                <Check className="w-4 h-4 text-primary-600 shrink-0" />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>

                                    {isSubscribed ? (
                                        <div className="flex items-center gap-2 text-primary-600 text-sm font-semibold">
                                            <Check className="w-4 h-4" /> Currently Subscribed
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleSubscribe(plan)}
                                            disabled={processing === plan.id}
                                            className="w-full btn-primary text-sm py-2.5 disabled:opacity-50"
                                        >
                                            {processing === plan.id ? 'Setting up…' : 'Subscribe Now'}
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
