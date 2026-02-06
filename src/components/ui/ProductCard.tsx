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
            className="product-card group bg-[#FFF8E7] border border-[#FFE4C4] rounded-2xl overflow-hidden hover:shadow-lg transition-all"
        >
            <Link href={`/product/${product.slug}`}>
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-warm-100">
                    {product.images && product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-warm-100 to-warm-200">
                            <span className="text-6xl">🐔</span>
                        </div>
                    )}

                    {/* Age Badge (Mocked based on image) */}
                    <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur text-[10px] font-medium text-warm-700 rounded-md shadow-sm">
                            Age: 75-90 Days
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2">
                    {/* Title */}
                    <div>
                        <h3 className="font-heading font-bold text-lg text-primary-800 leading-tight uppercase mb-1">
                            {product.name}
                        </h3>
                        <p className="text-xs text-warm-500 line-clamp-1">
                            {product.short_description || 'Soft, Tender and Extra juicy'}
                        </p>
                    </div>

                    {/* Price & Add Button Row */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-primary-900">
                                {formatPrice(product.price)}
                            </span>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={!product.is_available}
                            className="px-4 py-1.5 rounded-lg border-2 border-[#9B2C2C] text-[#9B2C2C] font-bold text-sm bg-white hover:bg-[#9B2C2C] hover:text-white transition-colors flex items-center gap-1"
                        >
                            Add <Plus className="w-3 h-3 stroke-[3]" />
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
