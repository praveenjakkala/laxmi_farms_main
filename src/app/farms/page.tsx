'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ExternalLink, Phone, Clock } from 'lucide-react';

const farmInfo = {
    name: 'Laxmi Farms',
    address: 'Pedda Banda, Nalgonda, Telangana - 508001',
    phone: '+91 9885167159',
    hours: 'Open Daily: 6:00 AM - 8:00 PM',
    mapsUrl: 'https://maps.app.goo.gl/Heia8HE494Kdej9W8',
    features: [
        'Free-range chicken coops',
        'Natural grazing areas',
        'Traditional feed processing',
        'Hygienic processing facility',
        'Visitor tours available',
        'Direct farm sales',
    ],
};

const farmGallery = [
    { image: '/images/farm-fields.png', title: 'Natural Fields' },
    { image: '/images/farm-chickens.png', title: 'Free-range Chickens' },
    { image: '/images/desi-eggs.png', title: 'Farm Fresh Eggs' },
    { image: '/images/giriraja-chicken.png', title: 'Premium Breeds' },
];

export default function FarmsPage() {
    return (
        <div className="min-h-screen bg-warm-50">
            {/* Hero */}
            <section className="relative bg-gradient-to-br from-primary-600 to-primary-700 py-20 lg:py-28">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
                    <Image
                        src="/images/farm-fields.png"
                        alt="Farm Background"
                        fill
                        className="object-cover opacity-20 mix-blend-overlay"
                        priority
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-6"
                        >
                            Visit Our Farm
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6"
                        >
                            Our Farm in <br />
                            <span className="text-accent-beige">Nalgonda</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-white/80"
                        >
                            Experience the heart of Laxmi Farms - where tradition meets quality.
                            Visit us to see how we raise our poultry the natural way.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Farm Details */}
            <section className="section-container">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Info Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-card overflow-hidden"
                    >
                        <div className="p-8">
                            <h2 className="text-2xl font-heading font-bold text-primary-600 mb-6">
                                Farm Location
                            </h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-warm-900">Address</h3>
                                        <p className="text-warm-600">{farmInfo.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-warm-900">Phone</h3>
                                        <a href="tel:9885167159" className="text-primary-600 hover:underline">
                                            {farmInfo.phone}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-warm-900">Visiting Hours</h3>
                                        <p className="text-warm-600">{farmInfo.hours}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-warm-200">
                                <h3 className="font-heading font-semibold text-primary-600 mb-4">
                                    What You&apos;ll Find
                                </h3>
                                <ul className="grid grid-cols-2 gap-3">
                                    {farmInfo.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-2 text-warm-700">
                                            <span className="w-2 h-2 rounded-full bg-natural-green" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <a
                                href={farmInfo.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-8 w-full btn-primary flex items-center justify-center gap-2"
                            >
                                <ExternalLink className="w-5 h-5" />
                                Get Directions on Google Maps
                            </a>
                        </div>
                    </motion.div>

                    {/* Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-2xl font-heading font-bold text-primary-600 mb-6">
                            Farm Gallery
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            {farmGallery.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative aspect-square bg-warm-100 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                        <span className="text-white font-medium">{item.title}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Map Placeholder */}
            <section className="bg-warm-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                        <div className="aspect-[21/9] bg-gradient-to-br from-warm-100 to-warm-200 flex items-center justify-center">
                            <div className="text-center p-8">
                                <MapPin className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                                <h3 className="text-xl font-heading font-semibold text-warm-700 mb-2">
                                    Interactive Map Coming Soon
                                </h3>
                                <p className="text-warm-500 mb-6 max-w-md mx-auto">
                                    We&apos;re working on an interactive map. For now, click below to view our location on Google Maps.
                                </p>
                                <a
                                    href={farmInfo.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                    Open in Google Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visit CTA */}
            <section className="section-container text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <h2 className="text-3xl font-heading font-bold text-primary-600 mb-4">
                        Plan Your Visit
                    </h2>
                    <p className="text-warm-600 mb-8">
                        We welcome visitors to experience our farm firsthand. See how we raise our
                        poultry and understand our commitment to quality. Call ahead to schedule
                        your visit!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:9885167159" className="btn-primary">
                            <Phone className="w-5 h-5 mr-2" />
                            Call to Schedule
                        </a>
                        <Link href="/contact" className="btn-secondary">
                            Contact Us
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
