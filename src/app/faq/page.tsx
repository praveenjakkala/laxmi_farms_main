'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Phone, MessageCircle } from 'lucide-react';

const faqCategories = [
    {
        name: 'Ordering & Delivery',
        faqs: [
            {
                question: 'How do I place an order?',
                answer: 'You can place an order through our website by browsing our products, adding items to cart, and completing the checkout process. Alternatively, you can call us at +91 9885167159 or WhatsApp us directly.',
            },
            {
                question: 'What areas do you deliver to?',
                answer: 'We currently deliver across Telangana. This includes Hyderabad, Nalgonda, Suryapet, and surrounding districts. For specific delivery availability in your area, please contact us.',
            },
            {
                question: 'How long does delivery take?',
                answer: 'For orders placed before 2 PM, we offer same-day delivery within Nalgonda district. For other areas, delivery usually takes 1-2 days depending on your location.',
            },
            {
                question: 'What are the delivery charges?',
                answer: 'Delivery charges vary based on your location and order value. Orders above ₹1000 usually qualify for free delivery within Nalgonda. For other areas, charges range from ₹50-150.',
            },
            {
                question: 'Can I pick up my order from the farm?',
                answer: 'Yes! We offer farm pickup option. Simply select "Farm Pickup" during checkout and we\'ll have your order ready for collection. Our farm is located in Pedda Banda, Nalgonda.',
            },
        ],
    },
    {
        name: 'Products & Quality',
        faqs: [
            {
                question: 'What makes your country chicken different?',
                answer: 'Our country chickens (Natu Kodi) are raised using traditional methods - free-range living, natural grain feed, no hormones or antibiotics. This results in firmer meat with richer, more authentic flavor.',
            },
            {
                question: 'Are your products organic?',
                answer: 'While we follow organic farming practices (no chemicals, hormones, or antibiotics), we are not officially certified organic. Our focus is on traditional, natural farming methods.',
            },
            {
                question: 'How are the chickens raised?',
                answer: 'Our chickens are raised in free-range conditions where they can roam, forage, and behave naturally. They are fed a diet of natural grains, vegetables, and allowed to find insects and greens.',
            },
            {
                question: 'What is Kadaknath chicken?',
                answer: 'Kadaknath is a rare breed of chicken known for its black meat. It\'s considered a delicacy and is known for its high protein content, low fat, and various health benefits. The meat has a unique flavor.',
            },
            {
                question: 'How fresh are your eggs?',
                answer: 'Our eggs are collected daily and usually delivered within 24-48 hours of collection. We guarantee freshness and natural quality from our free-range hens.',
            },
        ],
    },
    {
        name: 'Payment & Pricing',
        faqs: [
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept UPI payments (Google Pay, PhonePe), Razorpay online payment, and Cash on Delivery (COD). All online payments are secure and encrypted.',
            },
            {
                question: 'Why are country chickens priced higher than regular chickens?',
                answer: 'Country chickens take longer to mature (4-6 months vs 45 days for broilers), require more space, and are fed natural food. This increases production costs but results in superior quality and taste.',
            },
            {
                question: 'Is there a minimum order value?',
                answer: 'For home delivery, we have a minimum order value of ₹300. There is no minimum for farm pickup orders.',
            },
            {
                question: 'Do you offer bulk discounts?',
                answer: 'Yes, we offer special pricing for bulk orders (5kg or more). Please contact us directly for bulk order quotes and we\'ll be happy to offer you the best price.',
            },
        ],
    },
    {
        name: 'Cancellation & Refunds',
        faqs: [
            {
                question: 'Can I cancel my order?',
                answer: 'Orders can be cancelled before they are dispatched. Please contact us immediately if you need to cancel. Once dispatched, cancellation may not be possible for fresh products.',
            },
            {
                question: 'What is your refund policy?',
                answer: 'If you receive damaged or incorrect products, please inform us within 2 hours of delivery with photos. We\'ll arrange for replacement or full refund. Quality issues are taken very seriously.',
            },
            {
                question: 'What if I\'m not satisfied with the quality?',
                answer: 'Customer satisfaction is our priority. If you\'re not happy with the quality, please contact us with specifics. We\'ll make it right with a replacement or refund.',
            },
        ],
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-warm-200 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left"
            >
                <span className="font-medium text-warm-900 pr-4">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-warm-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 text-warm-600 leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(0);

    const filteredCategories = faqCategories.map((category) => ({
        ...category,
        faqs: category.faqs.filter(
            (faq) =>
                faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
    })).filter((category) => category.faqs.length > 0);

    return (
        <div className="min-h-screen bg-warm-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-white/80 max-w-2xl mx-auto mb-8"
                    >
                        Find answers to common questions about our products and services
                    </motion.p>

                    {/* Search */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl mx-auto relative"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                        />
                    </motion.div>
                </div>
            </section>

            <section className="section-container">
                {searchQuery ? (
                    // Search Results
                    <div className="max-w-3xl mx-auto">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category, index) => (
                                <div key={index} className="mb-8">
                                    <h2 className="text-lg font-heading font-semibold text-primary-600 mb-4">
                                        {category.name}
                                    </h2>
                                    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                                        {category.faqs.map((faq, fIndex) => (
                                            <FAQItem key={fIndex} {...faq} />
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-warm-600">No results found for &quot;{searchQuery}&quot;</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Category View
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Category Nav */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 bg-white rounded-2xl p-4 shadow-card">
                                <h3 className="font-heading font-semibold text-primary-600 mb-4 px-2">
                                    Categories
                                </h3>
                                <nav className="space-y-1">
                                    {faqCategories.map((category, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveCategory(index)}
                                            className={`w-full text-left px-4 py-2 rounded-xl transition-all ${activeCategory === index
                                                ? 'bg-primary-600 text-white'
                                                : 'text-warm-700 hover:bg-warm-100'
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* FAQs */}
                        <div className="lg:col-span-3">
                            <motion.div
                                key={activeCategory}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-card overflow-hidden"
                            >
                                <div className="px-6 py-4 bg-primary-50 border-b border-primary-100">
                                    <h2 className="text-xl font-heading font-semibold text-primary-600">
                                        {faqCategories[activeCategory].name}
                                    </h2>
                                </div>
                                <div className="px-6">
                                    {faqCategories[activeCategory].faqs.map((faq, index) => (
                                        <FAQItem key={index} {...faq} />
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Still Have Questions */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center"
                >
                    <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
                        Still Have Questions?
                    </h2>
                    <p className="text-white/80 mb-8 max-w-xl mx-auto">
                        Can&apos;t find what you&apos;re looking for? Our team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:9885167159"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary-600 rounded-xl font-medium hover:bg-warm-50 transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                            Call Us
                        </a>
                        <a
                            href="https://chat.whatsapp.com/JqaK4X3bHK3BG7vsBVtwsd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white rounded-xl font-medium hover:bg-white/10 transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            WhatsApp Us
                        </a>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
