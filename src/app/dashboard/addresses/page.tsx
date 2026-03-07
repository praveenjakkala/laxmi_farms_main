'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2, Star, Home, Building2, X, Check, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import type { Address } from '@/types';

const DISTRICTS = ['Nalgonda', 'Hyderabad', 'Suryapet', 'Khammam', 'Warangal', 'Rangareddy', 'Medchal', 'Siddipet', 'Other'];
const LABELS = ['Home', 'Work', 'Farm', 'Other'];

const emptyForm = {
    label: 'Home',
    street: '',
    city: '',
    district: 'Nalgonda',
    state: 'Telangana',
    pincode: '',
    landmark: '',
    is_default: false,
};

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const supabase = createClient();

    const fetchAddresses = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('addresses').select('*').eq('user_id', user.id).order('is_default', { ascending: false });
        setAddresses(data || []);
        setIsLoading(false);
    };

    useEffect(() => { fetchAddresses(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSave = async () => {
        if (!form.street || !form.city || !form.pincode) {
            alert('Please fill all required fields.');
            return;
        }
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setSaving(false); return; }

        if (form.is_default) {
            await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
        }

        if (editingId) {
            await supabase.from('addresses').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editingId);
        } else {
            await supabase.from('addresses').insert({ ...form, user_id: user.id });
        }

        await fetchAddresses();
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        setSaving(false);
    };

    const handleEdit = (addr: Address) => {
        setForm({
            label: addr.label,
            street: addr.street,
            city: addr.city,
            district: addr.district,
            state: addr.state,
            pincode: addr.pincode,
            landmark: addr.landmark || '',
            is_default: addr.is_default,
        });
        setEditingId(addr.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this address?')) return;
        setDeletingId(id);
        await supabase.from('addresses').delete().eq('id', id);
        setAddresses(prev => prev.filter(a => a.id !== id));
        setDeletingId(null);
    };

    const handleSetDefault = async (id: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        await supabase.from('addresses').update({ is_default: false }).eq('user_id', user.id);
        await supabase.from('addresses').update({ is_default: true }).eq('id', id);
        setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === id })));
    };

    const labelIcon = (label: string) => {
        if (label === 'Home') return <Home className="w-4 h-4" />;
        if (label === 'Work') return <Building2 className="w-4 h-4" />;
        return <MapPin className="w-4 h-4" />;
    };

    if (isLoading) {
        return <div className="animate-pulse space-y-4">{[...Array(2)].map((_, i) => <div key={i} className="h-32 bg-white rounded-2xl" />)}</div>;
    }

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-heading font-bold text-primary-600">Addresses</h2>
                    <p className="text-sm text-warm-500">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
                </div>
                <button
                    onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}
                    className="btn-primary text-sm py-2.5"
                >
                    <Plus className="w-4 h-4 mr-1" /> Add Address
                </button>
            </div>

            {/* Address Cards */}
            {addresses.length === 0 && !showForm ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-warm-100">
                    <MapPin className="w-14 h-14 text-warm-200 mx-auto mb-4" />
                    <h3 className="text-lg font-heading font-semibold text-warm-700 mb-2">No addresses saved</h3>
                    <p className="text-warm-400 text-sm mb-6">Add your delivery address for quick checkout.</p>
                    <button onClick={() => setShowForm(true)} className="btn-primary">Add Address</button>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map((addr, idx) => (
                        <motion.div
                            key={addr.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`bg-white rounded-2xl border-2 shadow-sm p-5 ${addr.is_default ? 'border-primary-400' : 'border-warm-100'}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${addr.is_default ? 'bg-primary-100 text-primary-600' : 'bg-warm-100 text-warm-600'}`}>
                                        {labelIcon(addr.label)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-semibold text-warm-900 text-sm">{addr.label}</span>
                                            {addr.is_default && (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-200">
                                                    <Star className="w-2.5 h-2.5" /> Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-warm-700">{addr.street}</p>
                                        <p className="text-sm text-warm-500">
                                            {addr.city}, {addr.district}, {addr.state} - {addr.pincode}
                                        </p>
                                        {addr.landmark && <p className="text-xs text-warm-400 mt-0.5">Near: {addr.landmark}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEdit(addr)} className="p-2 rounded-lg hover:bg-warm-100 text-warm-500 hover:text-primary-600 transition-colors">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        disabled={deletingId === addr.id}
                                        className="p-2 rounded-lg hover:bg-red-50 text-warm-500 hover:text-red-500 transition-colors disabled:opacity-50"
                                    >
                                        {deletingId === addr.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {!addr.is_default && (
                                <button
                                    onClick={() => handleSetDefault(addr.id)}
                                    className="mt-3 text-xs text-warm-500 hover:text-primary-600 font-medium transition-colors flex items-center gap-1"
                                >
                                    <Check className="w-3 h-3" /> Set as default
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add/Edit Form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border-2 border-primary-200 shadow-lg p-6"
                >
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-heading font-semibold text-primary-600">
                            {editingId ? 'Edit Address' : 'Add New Address'}
                        </h3>
                        <button onClick={() => { setShowForm(false); setEditingId(null); }} className="p-1.5 rounded-lg hover:bg-warm-100">
                            <X className="w-5 h-5 text-warm-500" />
                        </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-warm-700 mb-1.5">Label</label>
                            <select
                                value={form.label}
                                onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
                                className="input-field"
                            >
                                {LABELS.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.is_default}
                                    onChange={e => setForm(p => ({ ...p, is_default: e.target.checked }))}
                                    className="w-4 h-4 rounded border-warm-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm text-warm-700">Set as default address</span>
                            </label>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-warm-700 mb-1.5">Street / House No *</label>
                            <input
                                className="input-field"
                                placeholder="e.g. 12-34, MG Road, Krishnanagar"
                                value={form.street}
                                onChange={e => setForm(p => ({ ...p, street: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-warm-700 mb-1.5">City *</label>
                            <input
                                className="input-field"
                                placeholder="City / Town"
                                value={form.city}
                                onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-warm-700 mb-1.5">District *</label>
                            <select
                                value={form.district}
                                onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                                className="input-field"
                            >
                                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-warm-700 mb-1.5">Pincode *</label>
                            <input
                                className="input-field"
                                placeholder="508001"
                                maxLength={6}
                                value={form.pincode}
                                onChange={e => setForm(p => ({ ...p, pincode: e.target.value.replace(/\D/g, '') }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-warm-700 mb-1.5">Landmark</label>
                            <input
                                className="input-field"
                                placeholder="Near school, temple, etc."
                                value={form.landmark}
                                onChange={e => setForm(p => ({ ...p, landmark: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-6">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary disabled:opacity-50"
                        >
                            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving…</> : <><Check className="w-4 h-4 mr-1" />{editingId ? 'Update' : 'Save'} Address</>}
                        </button>
                        <button
                            onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
