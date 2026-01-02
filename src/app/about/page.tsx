'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Check, Users, Heart, Award, Leaf } from 'lucide-react';

const values = [
    {
        icon: Leaf,
        title: 'Natural Farming',
        description: 'We raise our poultry using traditional methods, without hormones or antibiotics.',
    },
    {
        icon: Heart,
        title: 'Animal Welfare',
        description: 'Our chickens roam freely and are treated with care and respect.',
    },
    {
        icon: Award,
        title: 'Quality First',
        description: 'We maintain the highest standards in hygiene and product quality.',
    },
    {
        icon: Users,
        title: 'Community',
        description: 'Supporting local farmers and contributing to our community\'s growth.',
    },
];

const milestones = [
    { year: '2019', title: 'Founded', description: 'Started with 100 country chickens' },
    { year: '2020', title: 'First Delivery', description: 'Began home delivery services in Nalgonda' },
    { year: '2022', title: 'Expansion', description: 'Extended delivery across Telangana' },
    { year: '2024', title: 'Online Launch', description: 'Launched our e-commerce platform' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-warm-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-600 to-primary-700 py-20 lg:py-28">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-6"
                        >
                            About Laxmi Farms
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6"
                        >
                            Bringing Farm-Fresh <br />
                            <span className="text-accent-beige">Goodness Home</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-white/80"
                        >
                            We&apos;re on a mission to revive the authentic taste of traditionally raised
                            country chicken and make it accessible to every household.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="section-container">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                            Our Story
                        </span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-600 mb-6">
                            A Journey Rooted in Tradition
                        </h2>
                        <div className="space-y-4 text-warm-700">
                            <p>
                                Laxmi Farms was born from a simple observation – the country chicken we
                                grew up eating in our villages was becoming increasingly hard to find.
                                The birds in the market had lost that distinctive taste, that richness
                                that made our grandmother&apos;s chicken curry so special.
                            </p>
                            <p>
                                In 2019, we started our farm in Pedda Banda, Nalgonda, with just 100
                                country chickens. We followed the same practices our ancestors used –
                                natural feed, free-range living, and absolutely no hormones or antibiotics.
                            </p>
                            <p>
                                Today, we&apos;re proud to serve thousands of families across Telangana,
                                bringing them the authentic taste of naturally raised poultry. Every
                                bird we sell carries our promise of quality and purity.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-natural-green" />
                                <span className="text-warm-700">100% Natural Feed</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-natural-green" />
                                <span className="text-warm-700">No Antibiotics</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-natural-green" />
                                <span className="text-warm-700">Free Range</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-natural-green" />
                                <span className="text-warm-700">Hormone Free</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center shadow-lg">
                                    <span className="text-7xl">🌾</span>
                                </div>
                                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-natural-green/20 to-natural-olive/20 flex items-center justify-center shadow-lg">
                                    <span className="text-5xl">🏠</span>
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-accent-earth/20 to-accent-terracotta/20 flex items-center justify-center shadow-lg">
                                    <span className="text-5xl">👨‍🌾</span>
                                </div>
                                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-warm-200 to-warm-300 flex items-center justify-center shadow-lg">
                                    <span className="text-7xl">🐓</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Timeline */}
            <section className="bg-gradient-to-br from-warm-100 to-accent-cream py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                            Our Journey
                        </span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-600">
                            Milestones We&apos;re Proud Of
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-200" />

                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={milestone.year}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                        <div className="bg-white rounded-2xl p-6 shadow-card inline-block">
                                            <span className="text-sm text-primary-500 font-medium">{milestone.year}</span>
                                            <h3 className="text-xl font-heading font-semibold text-primary-600 mt-1">
                                                {milestone.title}
                                            </h3>
                                            <p className="text-warm-600 mt-2">{milestone.description}</p>
                                        </div>
                                    </div>
                                    <div className="relative z-10 w-4 h-4 rounded-full bg-primary-600 border-4 border-white shadow-lg" />
                                    <div className="flex-1" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section-container">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1 bg-natural-green/10 text-natural-green rounded-full text-sm font-medium mb-4">
                        Our Values
                    </span>
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-600">
                        What We Stand For
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-warm">
                                <value.icon className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="font-heading font-semibold text-lg text-primary-600 mb-2">
                                {value.title}
                            </h3>
                            <p className="text-warm-600 text-sm">
                                {value.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary-600 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                        Ready to Taste the Difference?
                    </h2>
                    <p className="text-white/80 mb-8">
                        Order fresh country chicken today and experience the authentic farm-to-table taste.
                    </p>
                    <Link href="/shop" className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-warm-50 transition-colors shadow-lg">
                        Shop Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
