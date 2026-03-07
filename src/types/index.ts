// Database Types for Supabase - Laxmi Farms v2

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
    created_at: string;
}

export interface Product {
    id: string;
    category_id: string;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    price: number;
    compare_price: number | null;
    pricing_model: 'per_bird' | 'per_kg' | 'fixed';
    weight_options: WeightOption[] | null;
    min_order_quantity: number;
    stock_quantity: number;
    reserved_stock: number;
    low_stock_threshold: number;
    image_url?: string;
    images: string[];
    is_available: boolean;
    is_featured: boolean;
    tags: string[];
    created_at: string;
    updated_at: string;
    status?: 'active' | 'out_of_stock' | 'draft';
    unit?: string;
    // Joined fields
    category?: Category | string;
    average_rating?: number;
    review_count?: number;
}

export interface WeightOption {
    label: string;
    weight_kg: number;
    price_modifier: number;
}

export interface Order {
    id: string;
    order_number: string;
    user_id: string | null;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    delivery_type: 'home_delivery' | 'farm_pickup';
    delivery_address: DeliveryAddress | null;
    subtotal: number;
    delivery_charge: number;
    discount: number;
    total: number;
    payment_method: string;
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    order_status: 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';
    status: string;
    tracking_id: string | null;
    estimated_delivery: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    // Joined fields
    order_items?: OrderItem[];
}

export interface DeliveryAddress {
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    landmark?: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    product_image: string | null;
    quantity: number;
    weight_option: string | null;
    unit_price: number;
    total_price: number;
    // Joined fields
    product?: Product;
}

export interface Payment {
    id: string;
    order_id: string;
    razorpay_order_id: string | null;
    razorpay_payment_id: string | null;
    razorpay_signature: string | null;
    amount: number;
    currency: string;
    status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
    method: string | null;
    created_at: string;
}

export interface DeliveryZone {
    id: string;
    name: string;
    districts: string[];
    base_charge: number;
    per_km_charge: number;
    min_order_value: number;
    free_delivery_above: number | null;
    is_active: boolean;
    estimated_days: number;
}

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: 'super_admin' | 'admin' | 'manager';
    is_active: boolean;
    created_at: string;
    last_login: string | null;
}

// Cart Types
export interface CartItem {
    product: Product;
    quantity: number;
    weight_option?: string;
    unit_price: number;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    delivery_charge: number;
    discount: number;
    total: number;
}

// UI Types
export interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
}

export interface HeroSlide {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    cta_text: string;
    cta_link: string;
}

export interface Testimonial {
    id: string;
    name: string;
    location: string;
    content: string;
    rating: number;
    avatar?: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

// Chat Types for AI Assistant
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface ChatContext {
    products?: Product[];
    categories?: Category[];
    language: 'en' | 'te';
}

// NEW v2 Types

export interface UserProfile {
    id: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    role: 'customer' | 'admin' | 'super_admin';
    date_of_birth: string | null;
    created_at: string;
    updated_at: string;
}

export interface Address {
    id: string;
    user_id: string;
    label: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    landmark: string | null;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    product_id: string | null;
    frequency: 'weekly' | 'monthly' | 'biweekly';
    quantity: number;
    price: number;
    discount_percent: number;
    is_active: boolean;
    image_url: string | null;
    features: string[];
    created_at: string;
}

export interface Subscription {
    id: string;
    user_id: string;
    plan_id: string;
    address_id: string | null;
    status: 'active' | 'paused' | 'cancelled' | 'expired';
    start_date: string;
    next_delivery_date: string | null;
    pause_until: string | null;
    cancelled_at: string | null;
    payment_method: string;
    razorpay_subscription_id: string | null;
    total_deliveries: number;
    notes: string | null;
    created_at: string;
    updated_at: string;
    // Joined
    plan?: SubscriptionPlan;
    address?: Address;
}

export interface SubscriptionOrder {
    id: string;
    subscription_id: string;
    order_id: string | null;
    delivery_date: string;
    status: 'scheduled' | 'delivered' | 'skipped' | 'failed';
    notes: string | null;
    created_at: string;
}

export interface Review {
    id: string;
    user_id: string;
    product_id: string;
    order_id: string | null;
    rating: number;
    title: string | null;
    content: string;
    image_urls: string[];
    is_verified_purchase: boolean;
    is_approved: boolean;
    helpful_count: number;
    created_at: string;
    updated_at: string;
    // Joined
    user_profile?: Pick<UserProfile, 'full_name' | 'avatar_url'>;
}
