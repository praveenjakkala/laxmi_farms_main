'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Truck, Shield, Clock, Leaf, MapPin, Phone } from 'lucide-react';

// Mock data for initial display - will be replaced with Supabase data
const featuredCategories = [
  {
    id: '1',
    name: 'Country Chicken',
    slug: 'country-chicken',
    description: 'Authentic Natu Kodi raised naturally on our farms',
    image: '/images/country-chicken.png',
  },
  {
    id: '2',
    name: 'Kadaknath Chicken',
    slug: 'kadaknath-chicken',
    description: 'Premium black chicken known for health benefits',
    image: '/images/kadaknath-chicken.png',
  },
  {
    id: '3',
    name: 'Desi Eggs',
    slug: 'desi-eggs',
    description: 'Farm-fresh organic eggs from free-range hens',
    image: '/images/desi-eggs.png',
  },
  {
    id: '4',
    name: 'Giriraja Chicken',
    slug: 'giriraja-chicken',
    description: 'Hybrid breed perfect for traditional recipes',
    image: '/images/giriraja-chicken.png',
  },
];

const features = [
  {
    icon: Leaf,
    title: 'Naturally Raised',
    description: 'No hormones, no antibiotics. Pure, natural poultry raised the traditional way.',
  },
  {
    icon: Truck,
    title: 'Fresh Delivery',
    description: 'From our farm to your doorstep within hours. Guaranteed freshness.',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Strict hygiene standards and quality checks at every step.',
  },
  {
    icon: MapPin,
    title: 'Local Farm',
    description: 'Based in Nalgonda, Telangana. Supporting local agriculture.',
  },
];

const testimonials = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    location: 'Hyderabad',
    content: 'The country chicken from Laxmi Farms reminds me of my village days. Authentic taste and excellent quality!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    location: 'Nalgonda',
    content: 'Finally found a reliable source for fresh natu kodi. The home delivery is so convenient!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Mohammed Ali',
    location: 'Suryapet',
    content: 'Their Kadaknath chicken is the best I\'ve ever had. Worth every rupee for the health benefits.',
    rating: 5,
  },
];

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '5+', label: 'Years Experience' },
  { value: '50+', label: 'Delivery Areas' },
  { value: '100%', label: 'Natural Feed' },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center bg-gradient-to-br from-warm-50 via-accent-cream to-warm-100 pt-4 sm:pt-0">
        {/* Decorative Background */}
        <div className="absolute inset-0 overflow-hidden hidden sm:block">
          <div className="absolute top-20 right-10 w-48 md:w-72 h-48 md:h-72 bg-primary-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-20 left-10 w-64 md:w-96 h-64 md:h-96 bg-accent-sand rounded-full blur-3xl opacity-40" />
          <div className="absolute top-1/2 right-1/4 w-32 md:w-48 h-32 md:h-48 bg-natural-green/10 rounded-full blur-2xl" />
        </div>

        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6"
              >
                <Leaf className="w-4 h-4" />
                Farm Fresh • Naturally Raised
              </motion.span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-primary-600 mb-4 sm:mb-6 leading-tight">
                Pure Country <br className="hidden sm:block" />
                <span className="text-gradient"> Chicken</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-warm-700 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0 px-2 sm:px-0">
                Experience the authentic taste of traditionally raised Natu Kodi.
                Fresh from our farm to your table – no hormones, no antibiotics, just pure natural goodness.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
                <Link href="/shop" className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/about" className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto">
                  Our Story
                </Link>
              </div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="text-2xl sm:text-3xl font-heading font-bold text-primary-600">{stat.value}</p>
                    <p className="text-sm text-warm-600">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square max-w-xs sm:max-w-md lg:max-w-lg mx-auto">
                {/* Background Circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent-beige rounded-full transform -rotate-6" />

                {/* Image Container */}
                <div className="relative z-10 w-full h-full rounded-full overflow-hidden border-8 border-white shadow-2xl flex items-center justify-center bg-gradient-to-br from-warm-100 to-warm-200">
                  <Image
                    src="/images/country-chicken.png"
                    alt="Country Chicken Hero"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="hidden sm:block absolute -top-2 sm:-top-4 -right-2 sm:-right-4 glass-card py-2 sm:py-3 px-3 sm:px-4 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-natural-green/10 flex items-center justify-center">
                      <Leaf className="w-4 sm:w-5 h-4 sm:h-5 text-natural-green" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-warm-900">100% Organic</p>
                      <p className="text-xs text-warm-500 hidden sm:block">No chemicals</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="hidden sm:block absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 glass-card py-2 sm:py-3 px-3 sm:px-4 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Truck className="w-4 sm:w-5 h-4 sm:h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-warm-900">Same Day</p>
                      <p className="text-xs text-warm-500 hidden sm:block">Delivery</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-primary-600 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-16 text-white text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-200" />
              <span>Fresh Daily Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-200" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-primary-200" />
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-200" />
              <span>All Telangana Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-container">
        <div className="section-title">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4"
          >
            Our Products
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Farm-Fresh Selection
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Choose from our range of naturally raised poultry and farm-fresh eggs
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {featuredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/shop?category=${category.slug}`}>
                <div className="group relative bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-2">
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-warm-100 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-lg text-primary-600 mb-2 group-hover:text-primary-700 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-warm-600 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center text-primary-600 text-sm font-medium group-hover:gap-3 transition-all">
                      Shop Now
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/shop" className="btn-primary">
            View All Products
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* About/Story Section */}
      <section className="bg-gradient-to-br from-warm-100 to-accent-cream py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/images/farm-fields.png" alt="Farm Fields" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/images/farm-chickens.png" alt="Free range chickens" fill className="object-cover" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/images/desi-eggs.png" alt="Desi Eggs" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/images/giriraja-chicken.png" alt="Giriraja Chicken" fill className="object-cover" />
                  </div>
                </div>
              </div>

              {/* Experience Badge */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="absolute -bottom-6 -right-6 glass-card-dark text-white py-4 px-6 rounded-2xl shadow-xl"
              >
                <p className="text-3xl font-heading font-bold">5+</p>
                <p className="text-sm text-primary-100">Years of Trust</p>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary-600 mb-4 sm:mb-6">
                From Our Farm <br />
                <span className="text-gradient">To Your Table</span>
              </h2>
              <div className="space-y-4 text-warm-700">
                <p className="text-lg">
                  At Laxmi Farms, we believe in bringing back the authentic taste of
                  traditional country chicken that our grandparents enjoyed. Our journey
                  began in Nalgonda, Telangana, with a simple mission – to provide
                  families with naturally raised, hormone-free poultry.
                </p>
                <p>
                  Every chicken at our farm is raised with care, fed natural grains,
                  and allowed to roam freely. We follow traditional farming practices
                  passed down through generations, ensuring you get the purest,
                  most flavorful meat possible.
                </p>
              </div>

              <div className="flex flex-wrap gap-6 mt-8">
                <Link href="/about" className="btn-primary">
                  Learn More
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/farms" className="btn-secondary">
                  Visit Our Farms
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-container">
        <div className="section-title">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1 bg-natural-green/10 text-natural-green rounded-full text-sm font-medium mb-4"
          >
            Why Choose Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Laxmi Farms Difference
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            What makes our farm products stand out from the rest
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="w-14 sm:w-16 lg:w-20 h-14 sm:h-16 lg:h-20 mx-auto mb-3 sm:mb-4 lg:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center shadow-warm group-hover:shadow-lg group-hover:-translate-y-2 transition-all duration-300">
                <feature.icon className="w-7 sm:w-8 lg:w-10 h-7 sm:h-8 lg:h-10 text-primary-600" />
              </div>
              <h3 className="font-heading font-semibold text-base sm:text-lg lg:text-xl text-primary-600 mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-warm-600 text-sm sm:text-base hidden sm:block">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-primary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block px-4 py-1 bg-white/20 text-white rounded-full text-sm font-medium mb-4"
            >
              Testimonials
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white"
            >
              What Our Customers Say
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-white/90 mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-white/60">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 sm:p-8 md:p-16 text-center mx-2 sm:mx-0"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 sm:mb-6">
              Ready for Farm-Fresh Goodness?
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8 px-2 sm:px-0">
              Order now and experience the authentic taste of naturally raised country chicken.
              Freshly delivered to your doorstep.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-warm-50 transition-colors shadow-lg w-full sm:w-auto"
              >
                Start Shopping
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="tel:9885167159"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors w-full sm:w-auto"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call Now
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
