'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simple authentication check (in production, use Supabase Auth)
        if (formData.username === 'praveen' && formData.password === '123456') {
            // Set admin session (in production, use proper auth)
            localStorage.setItem('admin_session', JSON.stringify({
                user: formData.username,
                authenticated: true,
                timestamp: Date.now(),
            }));

            router.push('/admin/dashboard');
        } else {
            setError('Invalid username or password');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
            {/* Background Decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary-600 px-8 py-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white flex items-center justify-center">
                            <span className="text-primary-600 font-heading font-bold text-2xl">L</span>
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-white">
                            Laxmi Farms
                        </h1>
                        <p className="text-primary-200 text-sm">Admin Portal</p>
                    </div>

                    {/* Form */}
                    <div className="px-8 py-8">
                        <h2 className="text-xl font-heading font-semibold text-primary-600 mb-6 text-center">
                            Sign in to continue
                        </h2>

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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-warm-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="input-field pl-12"
                                        placeholder="Enter username"
                                        autoComplete="username"
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
                                        placeholder="Enter password"
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

                            <Button type="submit" isLoading={isLoading} className="w-full">
                                Sign In
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-white/60 text-sm mt-6">
                    © 2024 Laxmi Farms. Admin Portal
                </p>
            </motion.div>
        </div>
    );
}
