'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, Image as ImageIcon, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase-client';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Country Chicken',
        price: '',
        stock: '',
        description: '',
        unit: 'kg', // or 'bird', 'pack'
        image_url: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const supabase = createClient();

    const fetchProducts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProducts(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleImageUpload = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            return null;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageUrl = newProduct.image_url;

            if (imageFile) {
                const uploadedUrl = await handleImageUpload(imageFile);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            const { error } = await supabase
                .from('products')
                .insert({
                    name: newProduct.name,
                    slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                    category: newProduct.category,
                    price: parseFloat(newProduct.price),
                    stock: parseInt(newProduct.stock),
                    description: newProduct.description,
                    unit: newProduct.unit,
                    image_url: imageUrl,
                    status: parseInt(newProduct.stock) > 0 ? 'active' : 'out_of_stock'
                });

            if (error) throw error;

            setShowAddModal(false);
            setNewProduct({
                name: '',
                category: 'Country Chicken',
                price: '',
                stock: '',
                description: '',
                unit: 'kg',
                image_url: ''
            });
            setImageFile(null);
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (!error) {
            fetchProducts();
        } else {
            alert('Failed to delete product');
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-primary-600">Products</h1>
                    <p className="text-warm-500">Manage your product catalog</p>
                </div>
                <Button onClick={() => setShowAddModal(true)} leftIcon={<Plus className="w-5 h-5" />}>
                    Add Product
                </Button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white rounded-2xl p-4 shadow-card">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-12"
                        />
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-warm-50 text-left">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-warm-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-warm-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-warm-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-warm-100 flex items-center justify-center overflow-hidden">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-2xl">🐔</span>
                                                    )}
                                                </div>
                                                <span className="font-medium text-warm-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-warm-600">{product.category}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-warm-900">₹{product.price}/{product.unit || 'kg'}</td>
                                        <td className="px-6 py-4 text-sm text-warm-600">{product.stock}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product.stock > 0
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.stock > 0 ? 'Active' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-warm-200 flex items-center justify-between">
                                <h2 className="text-xl font-heading font-semibold text-primary-600">Add New Product</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-warm-500 hover:text-warm-700">
                                    ✕
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-warm-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="e.g., Country Chicken"
                                        value={newProduct.name}
                                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-warm-700 mb-2">Category</label>
                                        <select
                                            className="input-field"
                                            value={newProduct.category}
                                            onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                        >
                                            <option>Country Chicken</option>
                                            <option>Kadaknath Chicken</option>
                                            <option>Desi Eggs</option>
                                            <option>Broiler Chicken</option>
                                            <option>Giriraja Chicken</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-warm-700 mb-2">Unit</label>
                                        <select
                                            className="input-field"
                                            value={newProduct.unit}
                                            onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
                                        >
                                            <option value="kg">Per KG</option>
                                            <option value="bird">Per Bird</option>
                                            <option value="pack">Per Pack</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-warm-700 mb-2">Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field"
                                            placeholder="450"
                                            value={newProduct.price}
                                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-warm-700 mb-2">Stock Quantity</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field"
                                            placeholder="50"
                                            value={newProduct.stock}
                                            onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-warm-700 mb-2">Description</label>
                                    <textarea
                                        rows={4}
                                        className="input-field resize-none"
                                        placeholder="Product description..."
                                        value={newProduct.description}
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-warm-700 mb-2">Product Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setImageFile(e.target.files?.[0] || null)}
                                        className="block w-full text-sm text-warm-500
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-xl file:border-0
                                            file:text-sm file:font-semibold
                                            file:bg-primary-50 file:text-primary-700
                                            hover:file:bg-primary-100"
                                    />
                                </div>
                                <div className="flex gap-4 justify-end">
                                    <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                Adding...
                                            </>
                                        ) : 'Add Product'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
