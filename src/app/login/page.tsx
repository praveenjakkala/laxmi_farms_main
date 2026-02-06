'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase-client';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email: formData.email.trim(),
                password: formData.password,
            });

            if (authError) throw authError;

            if (data.user) {
                router.push('/shop'); // Redirect customers to shop
                router.refresh();
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Invalid email or password';
            setError(message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-warm-50 flex items-center justify-center p-4">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary-100 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-sand rounded-full blur-3xl opacity-40" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                <div className="mb-6">
                    <Link href="/" className="inline-flex items-center text-warm-600 hover:text-primary-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-primary-600 to-primary-700 px-8 py-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20 bg-white flex items-center justify-center">
                            <Image
                                src="/logo.jpg"
                                alt="Laxmi Farms Logo"
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-primary-100/80 text-sm">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-red-600 text-sm">{error}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-warm-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input-field pl-12"
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-warm-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="input-field pl-12 pr-12"
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" isLoading={isLoading} className="w-full py-3 text-lg">
                                Sign In
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-warm-500 text-sm">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="text-primary-600 font-semibold hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
