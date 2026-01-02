'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, ChevronDown, Loader2 } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/types';
import { createClient } from '@/lib/supabase-client';

const categories = [
    { id: 'all', name: 'All Products', value: 'all' },
    { id: '1', name: 'Country Chicken', value: 'Country Chicken' },
    { id: '2', name: 'Kadaknath Chicken', value: 'Kadaknath Chicken' },
    { id: '3', name: 'Desi Eggs', value: 'Desi Eggs' },
    { id: '4', name: 'Broiler Chicken', value: 'Broiler Chicken' },
    { id: '5', name: 'Giriraja Chicken', value: 'Giriraja Chicken' },
];

const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
];

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('status', 'active') // Only show active products
                .order('created_at', { ascending: false });

            if (!error && data) {
                // Map local images to products based on slug or name fallback
                const enrichedData = data.map(product => {
                    const slug = product.slug || product.name.toLowerCase().replace(/ /g, '-');
                    let localImage = null;

                    if (slug.includes('country') || slug.includes('natu')) localImage = '/images/country-chicken.png';
                    else if (slug.includes('kadaknath')) localImage = '/images/kadaknath-chicken.png';
                    else if (slug.includes('egg')) localImage = '/images/desi-eggs.png';
                    else if (slug.includes('giriraja')) localImage = '/images/giriraja-chicken.png';
                    else if (slug.includes('broiler')) localImage = '/images/farm-chickens.png'; // Fallback

                    return {
                        ...product,
                        image_url: product.image_url || localImage
                    };
                });
                setProducts(enrichedData);
            }
            setIsLoading(false);
        };

        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredProducts = products.filter((product) => {
        if (selectedCategory === 'all') return true;
        // Handle both string and object categories just in case, though DB is string
        const categoryName = typeof product.category === 'string' ? product.category : product.category?.name;
        return categoryName === selectedCategory;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            default:
                return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        }
    });

    return (
        <div className="min-h-screen bg-warm-50">
            {/* Page Header */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 py-10 sm:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white mb-3 sm:mb-4"
                    >
                        Our Products
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto px-2 sm:px-0"
                    >
                        Fresh, naturally raised poultry and eggs delivered to your doorstep
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-card">
                                <h3 className="font-heading font-semibold text-lg text-primary-600 mb-4">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.value)}
                                            className={`w-full text-left px-4 py-2 rounded-xl transition-all ${selectedCategory === category.value
                                                ? 'bg-primary-600 text-white'
                                                : 'text-warm-700 hover:bg-warm-100'
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range - Placeholder for future implementation */}
                            <div className="bg-white rounded-2xl p-6 shadow-card opacity-50 pointer-events-none">
                                <h3 className="font-heading font-semibold text-lg text-primary-600 mb-4">Price Range</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-warm-700 cursor-pointer">
                                        <input type="checkbox" className="rounded text-primary-600" />
                                        Under ₹200
                                    </label>
                                    <label className="flex items-center gap-2 text-warm-700 cursor-pointer">
                                        <input type="checkbox" className="rounded text-primary-600" />
                                        ₹200 - ₹500
                                    </label>
                                    <label className="flex items-center gap-2 text-warm-700 cursor-pointer">
                                        <input type="checkbox" className="rounded text-primary-600" />
                                        ₹500 - ₹1000
                                    </label>
                                    <label className="flex items-center gap-2 text-warm-700 cursor-pointer">
                                        <input type="checkbox" className="rounded text-primary-600" />
                                        Above ₹1000
                                    </label>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl shadow-card text-sm font-medium"
                            >
                                <Filter className="w-4 h-4" />
                                {showFilters ? 'Hide Filters' : 'Filters'}
                            </button>

                            {/* Results Count */}
                            <p className="text-warm-600 text-sm sm:text-base">
                                <span className="hidden sm:inline">Showing </span>
                                <span className="font-semibold text-primary-600">{sortedProducts.length}</span> products
                            </p>

                            {/* Sort & View */}
                            <div className="flex items-center gap-2 sm:gap-4">
                                {/* Sort Dropdown */}
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="appearance-none bg-white border border-warm-200 rounded-xl px-3 sm:px-4 py-2 pr-8 sm:pr-10 text-sm sm:text-base text-warm-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        {sortOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-500 pointer-events-none" />
                                </div>

                                {/* View Toggle */}
                                <div className="hidden sm:flex items-center bg-white rounded-xl border border-warm-200 p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-warm-500'
                                            }`}
                                        aria-label="Grid view"
                                    >
                                        <Grid className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-warm-500'
                                            }`}
                                        aria-label="List view"
                                    >
                                        <List className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filters */}
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="lg:hidden mb-6 sm:mb-8 bg-white rounded-2xl p-4 sm:p-6 shadow-card"
                            >
                                <h3 className="font-heading font-semibold text-base sm:text-lg text-primary-600 mb-3 sm:mb-4">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.value)}
                                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm transition-all ${selectedCategory === category.value
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-warm-100 text-warm-700 hover:bg-warm-200'
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Products Grid */}
                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
                            </div>
                        ) : sortedProducts.length > 0 ? (
                            <div
                                className={`grid gap-3 sm:gap-4 lg:gap-6 ${viewMode === 'grid'
                                    ? 'grid-cols-2 sm:grid-cols-2 xl:grid-cols-3'
                                    : 'grid-cols-1'
                                    }`}
                            >
                                {sortedProducts.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 sm:py-16">
                                <div className="text-5xl sm:text-6xl mb-4">🐔</div>
                                <h3 className="text-lg sm:text-xl font-heading font-semibold text-warm-700 mb-2">
                                    No products found
                                </h3>
                                <p className="text-warm-500 text-sm sm:text-base">
                                    Try adjusting your filters or check back later.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
