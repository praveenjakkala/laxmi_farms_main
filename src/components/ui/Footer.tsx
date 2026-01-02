import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Instagram, MessageCircle, ExternalLink } from 'lucide-react';

const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'About Us', href: '/about' },
    { label: 'Our Farms', href: '/farms' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
];

const products = [
    { label: 'Country Chicken', href: '/shop?category=country-chicken' },
    { label: 'Broiler Chicken', href: '/shop?category=broiler-chicken' },
    { label: 'Kadaknath Chicken', href: '/shop?category=kadaknath-chicken' },
    { label: 'Giriraja Chicken', href: '/shop?category=giriraja-chicken' },
    { label: 'Desi Eggs', href: '/shop?category=desi-eggs' },
];

const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Refund Policy', href: '/refund-policy' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary-600 text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2 sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-primary-400 flex items-center justify-center bg-white shrink-0">
                                <Image
                                    src="/logo.jpg"
                                    alt="Laxmi Farms Logo"
                                    width={48}
                                    height={48}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <div className="flex flex-col whitespace-nowrap">
                                <span className="text-base sm:text-xl font-heading font-bold !text-white leading-tight">Laxmi Farms</span>
                                <p className="text-[10px] sm:text-xs !text-primary-200">Premium Country Chicken</p>
                            </div>
                        </div>
                        <p className="text-primary-100 text-xs sm:text-sm leading-relaxed">
                            Experience the authentic taste of naturally raised country chicken.
                            Farm-fresh, hormone-free, and delivered with care to your doorstep.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://www.instagram.com/laxmifarms_01"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://chat.whatsapp.com/JqaK4X3bHK3BG7vsBVtwsd"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-heading font-semibold text-base sm:text-lg mb-4 sm:mb-6">Quick Links</h4>
                        <ul className="space-y-2 sm:space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-primary-100 hover:text-white transition-colors text-xs sm:text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Products */}
                    <div className="hidden sm:block">
                        <h4 className="font-heading font-semibold text-base sm:text-lg mb-4 sm:mb-6">Our Products</h4>
                        <ul className="space-y-2 sm:space-y-3">
                            {products.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-primary-100 hover:text-white transition-colors text-xs sm:text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-heading font-semibold text-lg mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="tel:9885167159"
                                    className="flex items-start gap-3 text-primary-100 hover:text-white transition-colors"
                                >
                                    <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">+91 9885167159</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:laxmifarms001@gmai.com"
                                    className="flex items-start gap-3 text-primary-100 hover:text-white transition-colors"
                                >
                                    <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">laxmifarms001@gmai.com</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://maps.app.goo.gl/Heia8HE494Kdej9W8"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-3 text-primary-100 hover:text-white transition-colors"
                                >
                                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">
                                        Pedda Banda, Nalgonda,<br />
                                        Telangana - 508001
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://maps.app.goo.gl/Heia8HE494Kdej9W8"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View on Google Maps
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                        <p className="text-primary-200 text-xs sm:text-sm text-center sm:text-left">
                            © {currentYear} Laxmi Farms. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4 sm:gap-6">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-primary-200 hover:text-white transition-colors text-xs sm:text-sm"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
