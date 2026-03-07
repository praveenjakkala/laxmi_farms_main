import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Server-side payment validation with duplicate prevention
const processedPayments = new Set<string>();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, products, address, paymentMethod, deliveryType, customer } = body;

        // ══════════════════════════════
        // SERVER-SIDE VALIDATION
        // ══════════════════════════════

        // 1. Validate amount
        if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 1000000) {
            return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
        }

        // 2. Validate products
        if (!products || !Array.isArray(products) || products.length === 0) {
            return NextResponse.json({ error: 'No products in order' }, { status: 400 });
        }

        // 3. Validate each product has required fields
        for (const p of products) {
            if (!p.product_id || !p.quantity || p.quantity <= 0 || !p.unit_price || p.unit_price <= 0) {
                return NextResponse.json({ error: 'Invalid product data' }, { status: 400 });
            }
        }

        // 4. Server-side amount recalculation & validation
        const calculatedSubtotal = products.reduce(
            (sum: number, p: { quantity: number; unit_price: number }) => sum + p.quantity * p.unit_price,
            0
        );
        const deliveryCharge = deliveryType === 'farm_pickup' ? 0 : (calculatedSubtotal >= 1000 ? 0 : 50);
        const calculatedTotal = calculatedSubtotal + deliveryCharge;

        // Allow ±5% tolerance for floating point differences
        const tolerance = calculatedTotal * 0.05;
        if (Math.abs(amount - calculatedTotal) > tolerance) {
            console.warn(`Amount mismatch: received ${amount}, calculated ${calculatedTotal}`);
            return NextResponse.json({ error: 'Order total mismatch. Please refresh and try again.' }, { status: 400 });
        }

        // 5. Check required environment variables
        const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

        // ══════════════════════════════
        // CREATE SUPABASE ORDER RECORD
        // ══════════════════════════════
        const { createServerClient } = await import('@supabase/ssr');
        const { cookies } = await import('next/headers');

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll() { },
                },
            }
        );

        // Get authenticated user (if any)
        const { data: { user } } = await supabase.auth.getUser();

        // Generate order number
        const orderNumber = `LF${Date.now().toString(36).toUpperCase()}`;

        // Create order in DB
        const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                user_id: user?.id || null,
                customer_name: customer?.name || address?.name || 'Guest',
                customer_phone: customer?.phone || address?.phone || '',
                customer_email: customer?.email || address?.email || user?.email || null,
                delivery_type: deliveryType || 'home_delivery',
                delivery_address: address || null,
                subtotal: calculatedSubtotal,
                delivery_charge: deliveryCharge,
                discount: 0,
                total: calculatedTotal,
                payment_method: paymentMethod || 'cod',
                payment_status: paymentMethod === 'cod' ? 'pending' : 'pending',
                order_status: 'pending',
                status: 'pending',
            })
            .select()
            .single();

        if (orderError || !orderData) {
            console.error('Order creation error:', orderError);
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        // Insert order items
        const orderItems = products.map((p: { product_id: string; name: string; product_image?: string; quantity: number; unit_price: number; total_price?: number }) => ({
            order_id: orderData.id,
            product_id: p.product_id,
            product_name: p.name,
            product_image: p.product_image || null,
            quantity: p.quantity,
            unit_price: p.unit_price,
            total_price: p.unit_price * p.quantity,
        }));

        await supabase.from('order_items').insert(orderItems);

        // ══════════════════════════════
        // DEDUCT STOCK & CHECK AVAILABILITY
        // ══════════════════════════════
        for (const p of products) {
            // Get current stock
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('stock_quantity, id')
                .eq('id', p.product_id)
                .single();

            if (productError || !productData) continue;

            const newStock = Math.max(0, productData.stock_quantity - p.quantity);
            const isAvailable = newStock > 0;

            await supabase
                .from('products')
                .update({
                    stock_quantity: newStock,
                    is_available: isAvailable,
                    status: isAvailable ? 'active' : 'out_of_stock'
                })
                .eq('id', p.product_id);
        }

        // ══════════════════════════════
        // RAZORPAY ORDER (if online payment)
        // ══════════════════════════════
        if (paymentMethod === 'razorpay' && razorpayKeyId && razorpayKeySecret) {
            const razorpay = new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret });

            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(calculatedTotal * 100), // in paise
                currency: 'INR',
                receipt: orderNumber,
                notes: { db_order_id: orderData.id },
            });

            return NextResponse.json({
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                dbOrderId: orderData.id,
                orderNumber,
            });
        }

        // For COD or UPI (manual)
        return NextResponse.json({
            dbOrderId: orderData.id,
            orderNumber,
            message: 'Order placed successfully',
        });

    } catch (error: unknown) {
        console.error('Payment API error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

// Webhook to handle Razorpay payment verification
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id } = body;

        // Duplicate payment prevention
        if (processedPayments.has(razorpay_payment_id)) {
            return NextResponse.json({ error: 'Payment already processed' }, { status: 409 });
        }

        // Verify signature
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const generated = crypto
            .createHmac('sha256', keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generated !== razorpay_signature) {
            return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        processedPayments.add(razorpay_payment_id);

        // Update order status in DB
        const { createServerClient } = await import('@supabase/ssr');
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { cookies: { getAll() { return cookieStore.getAll(); }, setAll() { } } }
        );

        await supabase
            .from('orders')
            .update({
                payment_status: 'paid',
                order_status: 'confirmed',
                status: 'confirmed',
                updated_at: new Date().toISOString(),
            })
            .eq('id', db_order_id);

        return NextResponse.json({ success: true, message: 'Payment verified' });

    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
