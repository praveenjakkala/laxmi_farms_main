'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Instagram, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/Button';

const contactInfo = [
    {
        icon: Phone,
        title: 'Phone',
        value: '+91 9885167159',
        link: 'tel:9885167159',
    },
    {
        icon: Mail,
        title: 'Email',
        value: 'laxmifarms001@gmail.com',
        link: 'mailto:laxmifarms001@gmail.com',
    },
    {
        icon: MapPin,
        title: 'Address',
        value: 'Pedda Banda, Nalgonda, Telangana - 508001',
        link: 'https://maps.app.goo.gl/Heia8HE494Kdej9W8',
    },
    {
        icon: Clock,
        title: 'Working Hours',
        value: 'Mon - Sun: 6:00 AM - 8:00 PM',
        link: null,
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    };

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
                        Contact Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-white/80 max-w-2xl mx-auto"
                    >
                        Have questions? We&apos;d love to hear from you. Get in touch with us.
                    </motion.p>
                </div>
            </section>

            <section className="section-container">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="bg-white rounded-2xl p-8 shadow-card">
                            <h2 className="text-2xl font-heading font-bold text-primary-600 mb-6">
                                Send us a Message
                            </h2>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-natural-green/10 flex items-center justify-center">
                                        <Send className="w-8 h-8 text-natural-green" />
                                    </div>
                                    <h3 className="text-xl font-heading font-semibold text-primary-600 mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-warm-600 mb-6">
                                        Thank you for reaching out. We&apos;ll get back to you soon.
                                    </p>
                                    <Button variant="secondary" onClick={() => setSubmitted(false)}>
                                        Send Another Message
                                    </Button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-warm-700 mb-2">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="input-field"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-warm-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="input-field"
                                                placeholder="+91 XXXXX XXXXX"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-warm-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="input-field"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-warm-700 mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="input-field"
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-warm-700 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="input-field resize-none"
                                            placeholder="Your message here..."
                                        />
                                    </div>

                                    <Button type="submit" isLoading={isSubmitting} className="w-full">
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Message
                                    </Button>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-2xl p-8 shadow-card">
                            <h2 className="text-2xl font-heading font-bold text-primary-600 mb-6">
                                Get in Touch
                            </h2>

                            <div className="space-y-6">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                            <info.icon className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-warm-900">{info.title}</h3>
                                            {info.link ? (
                                                <a
                                                    href={info.link}
                                                    target={info.link.startsWith('http') ? '_blank' : undefined}
                                                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                                                    className="text-warm-600 hover:text-primary-600 transition-colors"
                                                >
                                                    {info.value}
                                                </a>
                                            ) : (
                                                <p className="text-warm-600">{info.value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-2xl p-8 shadow-card">
                            <h3 className="text-lg font-heading font-semibold text-primary-600 mb-4">
                                Connect With Us
                            </h3>
                            <div className="flex gap-4">
                                <a
                                    href="https://www.instagram.com/laxmifarms_01"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    <Instagram className="w-5 h-5" />
                                    Instagram
                                </a>
                                <a
                                    href="https://chat.whatsapp.com/JqaK4X3bHK3BG7vsBVtwsd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    WhatsApp Group
                                </a>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-card">
                            <div className="aspect-video bg-warm-100 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <MapPin className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                                    <p className="text-warm-600 mb-4">View our location on Google Maps</p>
                                    <a
                                        href="https://maps.app.goo.gl/Heia8HE494Kdej9W8"
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
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
