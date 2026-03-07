'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Calendar, Camera, Check, Loader2, Key } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import type { UserProfile } from '@/types';

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [email, setEmail] = useState('');
    const [form, setForm] = useState({ full_name: '', phone: '', date_of_birth: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [passwordSaved, setPasswordSaved] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            setEmail(user.email || '');

            const { data } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
            if (data) {
                setProfile(data);
                setForm({
                    full_name: data.full_name || user.user_metadata?.full_name || '',
                    phone: data.phone || '',
                    date_of_birth: data.date_of_birth || '',
                });
            } else {
                setForm({
                    full_name: user.user_metadata?.full_name || '',
                    phone: '',
                    date_of_birth: '',
                });
            }
            setIsLoading(false);
        };
        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setSaving(false); return; }

        await supabase.from('user_profiles').upsert({
            id: user.id,
            ...form,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

        await supabase.auth.updateUser({ data: { full_name: form.full_name } });

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handlePasswordChange = async () => {
        if (newPassword.length < 8) {
            alert('Password must be at least 8 characters.');
            return;
        }
        setChangingPassword(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            alert(error.message);
        } else {
            setPasswordSaved(true);
            setNewPassword('');
            setTimeout(() => setPasswordSaved(false), 3000);
        }
        setChangingPassword(false);
    };

    const avatarLetter = (form.full_name || email || 'U')[0].toUpperCase();

    if (isLoading) {
        return <div className="animate-pulse space-y-4"><div className="h-48 bg-white rounded-2xl" /><div className="h-64 bg-white rounded-2xl" /></div>;
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-xl font-heading font-bold text-primary-600">My Profile</h2>
                <p className="text-sm text-warm-500">Manage your personal details</p>
            </div>

            {/* Avatar & Name */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6"
            >
                <div className="flex items-center gap-5 mb-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                            {avatarLetter}
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-primary-200 flex items-center justify-center shadow-sm hover:bg-primary-50 transition-colors">
                            <Camera className="w-3.5 h-3.5 text-primary-600" />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-xl font-heading font-bold text-warm-900">{form.full_name || 'Your Name'}</h3>
                        <p className="text-warm-400 text-sm">{email}</p>
                        {profile?.role && (
                            <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full capitalize">
                                {profile.role}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-warm-700 mb-1.5 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> Full Name
                        </label>
                        <input
                            className="input-field"
                            placeholder="Your full name"
                            value={form.full_name}
                            onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-warm-700 mb-1.5 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5" /> Phone Number
                        </label>
                        <input
                            className="input-field"
                            placeholder="+91 98765 43210"
                            value={form.phone}
                            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-warm-700 mb-1.5 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5" /> Email Address
                        </label>
                        <input
                            className="input-field bg-warm-50 cursor-not-allowed"
                            value={email}
                            disabled
                        />
                        <p className="text-xs text-warm-400 mt-1">Email cannot be changed here</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-warm-700 mb-1.5 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Date of Birth
                        </label>
                        <input
                            type="date"
                            className="input-field"
                            value={form.date_of_birth}
                            onChange={e => setForm(p => ({ ...p, date_of_birth: e.target.value }))}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`mt-6 btn-primary disabled:opacity-50 transition-all ${saved ? 'bg-green-600 hover:bg-green-600' : ''}`}
                >
                    {saving ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</>
                    ) : saved ? (
                        <><Check className="w-4 h-4 mr-2" />Saved!</>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </motion.div>

            {/* Change Password */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-warm-100 shadow-sm p-6"
            >
                <h3 className="font-heading font-semibold text-warm-800 mb-4 flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary-600" /> Change Password
                </h3>
                <div className="flex gap-3 flex-wrap">
                    <input
                        type="password"
                        className="input-field flex-1 min-w-48"
                        placeholder="New password (min 8 chars)"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                    <button
                        onClick={handlePasswordChange}
                        disabled={changingPassword || !newPassword}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${passwordSaved ? 'bg-green-600 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                    >
                        {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : passwordSaved ? <><Check className="w-4 h-4 inline mr-1" />Updated!</> : 'Update Password'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
