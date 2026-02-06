'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart';

interface ProductCardProps {
    product: Product;
    index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
    const { addItem, openCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem(product);
        openCart();
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getPricingLabel = (model: string) => {
        switch (model) {
            case 'per_kg':
                return '/kg';
            case 'per_bird':
                return '/bird';
            default:
                return '';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="product-card group"
        >
            <Link href={`/product/${product.slug}`}>
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-warm-100">
                    {product.images && product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-warm-100 to-warm-200">
                            <span className="text-6xl">🐔</span>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2">
                        {product.is_featured && (
                            <span className="badge-primary text-[10px] sm:text-xs">Featured</span>
                        )}
                        {!product.is_available && (
                            <span className="badge bg-warm-700 text-white text-[10px] sm:text-xs">Out of Stock</span>
                        )}
                        {product.compare_price && product.compare_price > product.price && (
                            <span className="badge bg-natural-green text-white text-[10px] sm:text-xs">
                                {Math.round((1 - product.price / product.compare_price) * 100)}% OFF
                            </span>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
                        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.is_available}
                                className="flex-1 btn-primary py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Add to Cart
                            </button>
                            <Link
                                href={`/product/${product.slug}`}
                                className="p-2 bg-white rounded-xl shadow-lg hover:bg-warm-50 transition-colors"
                                aria-label="View product"
                            >
                                <Eye className="w-5 h-5 text-primary-600" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                    {/* Category */}
                    {product.category && (
                        <p className="text-[10px] sm:text-xs text-warm-500 uppercase tracking-wider mb-0.5 sm:mb-1">
                            {typeof product.category === 'string' ? product.category : product.category.name}
                        </p>
                    )}

                    {/* Name */}
                    <h3 className="font-heading font-semibold text-sm sm:text-lg text-primary-600 mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                        {product.name}
                    </h3>

                    {/* Short Description - hidden on mobile */}
                    {product.short_description && (
                        <p className="hidden sm:block text-sm text-warm-600 line-clamp-2 mb-3">
                            {product.short_description}
                        </p>
                    )}

                    {/* Price */}
                    <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                        <span className="text-lg sm:text-2xl font-bold text-primary-600">
                            {formatPrice(product.price)}
                            <span className="text-[10px] sm:text-sm font-normal text-warm-500">{getPricingLabel(product.pricing_model)}</span>
                        </span>
                        {product.compare_price && product.compare_price > product.price && (
                            <span className="text-warm-400 line-through text-xs sm:text-sm">
                                {formatPrice(product.compare_price)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
