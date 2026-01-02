'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Phone, MapPin } from 'lucide-react';
import { useCart } from '@/lib/cart';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About Us', href: '/about' },
    { label: 'Our Farms', href: '/farms' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
];

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { getTotalItems, openCart } = useCart();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        setCartCount(getTotalItems());
    }, [getTotalItems]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Top Bar */}
            <div className="bg-primary-600 text-white py-2 text-xs sm:text-sm hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4 lg:gap-6">
                        <a href="tel:9885167159" className="flex items-center gap-1.5 sm:gap-2 hover:text-accent-beige transition-colors">
                            <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>+91 9885167159</span>
                        </a>
                        <a
                            href="https://maps.app.goo.gl/Heia8HE494Kdej9W8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 sm:gap-2 hover:text-accent-beige transition-colors"
                        >
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden lg:inline">Pedda Banda, Nalgonda</span>
                            <span className="lg:hidden">Nalgonda</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-accent-beige hidden lg:inline">🌿 Farm Fresh • Naturally Raised</span>
                        <span className="text-accent-beige lg:hidden">🌿 Farm Fresh</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-lg'
                    : 'bg-white'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-primary-100 flex items-center justify-center bg-white">
                                <Image
                                    src="/logo.jpg"
                                    alt="Laxmi Farms Logo"
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-heading font-bold text-primary-600">Laxmi Farms</h1>
                                <p className="text-xs text-warm-600">Premium Country Chicken</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`nav-link ${pathname === link.href ? 'nav-link-active' : ''
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            {/* Cart Button */}
                            <button
                                onClick={openCart}
                                className="relative p-2 rounded-xl hover:bg-warm-100 transition-colors"
                                aria-label="Open cart"
                            >
                                <ShoppingCart className="w-6 h-6 text-primary-600" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 rounded-xl hover:bg-warm-100 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMenuOpen ? (
                                    <X className="w-6 h-6 text-primary-600" />
                                ) : (
                                    <Menu className="w-6 h-6 text-primary-600" />
                                )}
                            </button>

                            {/* Desktop CTA */}
                            <Link href="/shop" className="btn-primary hidden lg:flex">
                                Order Now
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden border-t border-warm-200 bg-white"
                        >
                            <nav className="py-3 px-4 space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block py-3.5 px-4 rounded-xl transition-colors text-base ${pathname === link.href
                                            ? 'bg-primary-50 text-primary-600 font-semibold'
                                            : 'text-warm-700 hover:bg-warm-50'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="pt-3 space-y-3">
                                    <Link
                                        href="/shop"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="btn-primary w-full text-center"
                                    >
                                        Order Now
                                    </Link>
                                    <a
                                        href="tel:9885167159"
                                        className="flex items-center justify-center gap-2 py-3 px-4 bg-warm-100 rounded-xl text-primary-600 font-medium"
                                    >
                                        <Phone className="w-4 h-4" />
                                        Call: +91 9885167159
                                    </a>
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </>
    );
}
