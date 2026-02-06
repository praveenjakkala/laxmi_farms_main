'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    Minus,
    Plus,
    ShoppingCart,
    Heart,
    Share2,
    Truck,
    Shield,
    Leaf,
    Star,
    Check,
    Loader2
} from 'lucide-react';
import { useCart } from '@/lib/cart';
import Button from '@/components/ui/Button';
import { Product } from '@/types';
import { createClient } from '@/lib/supabase-client';

const features = [
    { icon: Leaf, text: '100% Natural' },
    { icon: Shield, text: 'Quality Assured' },
    { icon: Truck, text: 'Fresh Delivery' },
];

export default function ProductDetailsPage() {
    const { addItem, openCart } = useCart();
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [pricingModel, setPricingModel] = useState<'live' | 'meat'>('live');
    const [price, setPrice] = useState(0);

    const supabase = createClient();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return;
            setIsLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error || !data) {
                console.error('Error fetching product:', error);
                // router.push('/404'); // Or handle 404 gracefully
            } else {
                // Map local images based on slug or name fallback
                let localImage = null;
                const pSlug = data.slug || data.name.toLowerCase().replace(/ /g, '-');

                if (pSlug.includes('country') || pSlug.includes('natu')) localImage = '/images/country-chicken.png';
                else if (pSlug.includes('kadaknath')) localImage = '/images/kadaknath-chicken.png';
                else if (pSlug.includes('egg')) localImage = '/images/desi-eggs.png';
                else if (pSlug.includes('giriraja')) localImage = '/images/giriraja-chicken.png';
                else if (pSlug.includes('broiler')) localImage = '/images/farm-chickens.png';

                setProduct({
                    ...data,
                    image_url: data.image_url || localImage
                });
                setPrice(data.price);
            }
            setIsLoading(false);
        };

        fetchProduct();
    }, [slug, supabase, router]);

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity);
            openCart();
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-warm-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-bold text-warm-800">Product Not Found</h2>
                <Link href="/shop">
                    <Button>Return to Shop</Button>
                </Link>
            </div>
        );
    }

    const categoryName = typeof product.category === 'string' ? product.category : product.category?.name;

    return (
        <div className="min-h-screen bg-warm-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-warm-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 text-sm text-warm-500">
                        <Link href="/" className="hover:text-primary-600">Home</Link>
                        <span>/</span>
                        <Link href="/shop" className="hover:text-primary-600">Shop</Link>
                        <span>/</span>
                        {categoryName && (
                            <>
                                <Link href={`/shop?category=${categoryName}`} className="hover:text-primary-600">
                                    {categoryName}
                                </Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-warm-700">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {/* Main Image */}
                        <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-warm-100 to-warm-200 flex items-center justify-center mb-4 shadow-lg relative">
                            {product.images && product.images.length > 0 && product.images[selectedImage] ? (
                                <Image
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-[120px]">🐔</span>
                                )
                            )}
                        </div>

                        {/* Thumbnail Gallery - Only show if images array has items, assuming image_url is just a fallback or primary */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                                            ? 'border-primary-600'
                                            : 'border-transparent opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {/* Category & Tags */}
                        <div className="flex items-center gap-3 mb-4">
                            {categoryName && (
                                <Link
                                    href={`/shop?category=${categoryName}`}
                                    className="text-sm text-primary-600 hover:underline"
                                >
                                    {categoryName}
                                </Link>
                            )}
                            {product.is_featured && (
                                <span className="badge-primary">Bestseller</span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-600 mb-4">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <span className="text-warm-600">(50+ Reviews)</span>
                        </div>

                        {/* Mock Subtitle - In real app, this comes from DB */}
                        <p className="text-secondary-500 font-medium mb-1">Soft, Tender and Extra juicy</p>
                        <p className="text-warm-500 text-sm mb-4">Age: 75-90 Days</p>

                        {/* Selection Logic */}
                        <div className="flex flex-col gap-4 mb-8">
                            {/* Live Bird Option */}
                            <div
                                onClick={() => {
                                    setPricingModel('live');
                                    setPrice(product.price);
                                }}
                                className={`cursor-pointer border-2 rounded-xl p-0 flex overflow-hidden transition-all ${pricingModel === 'live' ? 'border-primary-600 bg-primary-50/10' : 'border-warm-200 hover:border-warm-300'
                                    }`}
                            >
                                <div className="w-1/3 p-4 flex items-center justify-center font-bold text-warm-800 border-r border-warm-200">
                                    LIVE BIRD
                                </div>
                                <div className="w-1/3 p-4 flex items-center justify-center font-bold text-xl text-primary-700 border-r border-warm-200">
                                    {formatPrice(product.price)}<span className="text-sm font-normal text-warm-500 ml-1">/KG</span>
                                </div>
                                <div className="w-1/3 p-4 flex items-center justify-center text-xs text-center text-warm-600 bg-warm-50">
                                    Live bird is available only in stores.
                                </div>
                            </div>

                            {/* Meat Option */}
                            <div
                                onClick={() => {
                                    setPricingModel('meat');
                                    // Mocking meat price logic: usually higher per bird/kg after cleaning
                                    // For demo, we are showing a fixed price based on user mockup
                                    setPrice(369);
                                }}
                                className={`cursor-pointer border-2 rounded-xl p-0 flex overflow-hidden transition-all ${pricingModel === 'meat' ? 'border-primary-600 bg-red-50' : 'border-warm-200 hover:border-warm-300'
                                    }`}
                            >
                                <div className="w-1/3 p-4 flex items-center justify-center font-bold text-warm-800 border-r border-warm-200 bg-red-100/50">
                                    MEAT
                                </div>
                                <div className="w-1/3 p-4 flex items-center justify-center font-bold text-xl text-primary-700 border-r border-warm-200 bg-red-100/50">
                                    ₹369
                                </div>
                                <div className="w-1/3 p-4 flex flex-col items-center justify-center text-xs text-center text-warm-700 bg-red-200/50">
                                    <div className='font-medium'>Gross wt: 1900gm</div>
                                    <div>Net wt: 950gm</div>
                                </div>
                            </div>
                        </div>

                        {/* Add to Bag CTA */}
                        <div className="mb-8">
                            <Button
                                onClick={handleAddToCart}
                                disabled={!product.is_available}
                                className="w-48 bg-[#9B2C2C] hover:bg-[#7B2323] text-white font-medium py-3 rounded-lg shadow-md transition-transform active:scale-95"
                            >
                                Add to bag & Customize
                            </Button>
                        </div>

                        {/* Why Better Section */}
                        <div className="mt-8 mb-8 p-6 bg-[#FFF8E7] rounded-xl border border-[#FFE4C4]">
                            <h3 className="text-xl font-heading font-bold text-warm-800 mb-4 flex items-center gap-2">
                                Why <span className="text-[#9B2C2C]">BETTER THAN BROILER?</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-natural-green rounded-sm flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-warm-700 text-sm font-medium">Natural growth (75-90 Days)</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-natural-green rounded-sm flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-warm-700 text-sm font-medium">Naturally grown in lush-green free-range farms</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-natural-green rounded-sm flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-warm-700 text-sm font-medium">Naturally soft, juicy & tender</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-natural-green rounded-sm flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-warm-700 text-sm font-medium">No injected Steroids, Hormones</span>
                                </div>
                            </div>

                            {/* Decorative Illustration (Placeholder for the farm sketch in mockup) */}
                            <div className="mt-4 flex justify-end">
                                <Leaf className="w-12 h-12 text-warm-300 opacity-50" />
                            </div>
                        </div>

                        {/* Secondary Actions */}
                        <div className="flex gap-4 pb-8 border-b border-warm-200">
                            <button className="flex items-center gap-2 text-warm-600 hover:text-primary-600 transition-colors">
                                <Heart className="w-5 h-5" />
                                <span className="text-sm">Add to Wishlist</span>
                            </button>
                            <button className="flex items-center gap-2 text-warm-600 hover:text-primary-600 transition-colors">
                                <Share2 className="w-5 h-5" />
                                <span className="text-sm">Share</span>
                            </button>
                        </div>

                        {/* Delivery Info */}
                        <div className="mt-8 p-4 bg-primary-50 rounded-xl">
                            <div className="flex items-start gap-3">
                                <Truck className="w-6 h-6 text-primary-600 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-primary-700">Delivery Information</p>
                                    <p className="text-sm text-warm-600 mt-1">
                                        Same-day delivery in Nalgonda district for orders before 2 PM.
                                        Free delivery on orders above ₹1000.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Product Description */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16"
                >
                    <div className="bg-white rounded-2xl p-8 shadow-card">
                        <h2 className="text-2xl font-heading font-bold text-primary-600 mb-6">
                            Product Description
                        </h2>
                        <div className="prose prose-warm max-w-none">
                            {product.description?.split('\n').map((paragraph, index) => (
                                <p key={index} className="text-warm-700 mb-4">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
