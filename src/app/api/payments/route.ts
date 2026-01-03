import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
    try {
        const { amount, products, address, paymentMethod, deliveryType } = await request.json();

        // Use Admin Client to bypass RLS for checkout process
        const { createAdminClient } = await import('@/lib/supabase-server');
        const supabase = await createAdminClient();

        // 1. Verify Stock Availability
        for (const item of products) {
            const { data: product, error: stockError } = await supabase
                .from('products')
                .select('stock, name')
                .eq('id', item.product_id)
                .single();

            if (stockError || !product) {
                return NextResponse.json({ error: `Product "${item.name}" not found` }, { status: 400 });
            }

            if (product.stock < item.quantity) {
                return NextResponse.json({
                    error: `Only ${product.stock} units of "${product.name}" are available. Please reduce your quantity.`
                }, { status: 400 });
            }
        }

        let razorpayOrderId = null;

        if (paymentMethod === 'razorpay') {
            if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
                return NextResponse.json(
                    { error: 'Razorpay API keys missing' },
                    { status: 500 }
                );
            }

            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });

            const options = {
                amount: Math.round(amount * 100), // amount in paise
                currency: 'INR',
                receipt: `order_${Date.now()}`,
            };

            const order = await razorpay.orders.create(options);
            razorpayOrderId = order.id;
        }

        // 2. Generate Order Number
        const orderNumber = `LF-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;

        // 3. Save order to database
        const { data: dbOrder, error: dbError } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                customer_name: address.name,
                customer_phone: address.phone,
                customer_email: address.email || null,
                delivery_type: deliveryType,
                delivery_address: address,
                subtotal: amount - (deliveryType === 'home_delivery' ? (amount >= 1000 ? 0 : 50) : 0),
                delivery_charge: deliveryType === 'home_delivery' ? (amount >= 1000 ? 0 : 50) : 0,
                total: amount,
                payment_method: paymentMethod,
                payment_status: 'pending',
                order_status: 'pending',
                notes: address.notes || null,
                razorpay_order_id: razorpayOrderId
            })
            .select()
            .single();

        if (dbError) {
            console.error('Order Insert Error details:', dbError);
            return NextResponse.json(
                { error: `Error: ${dbError.message || dbError.details || 'Unable to create order'}` },
                { status: 500 }
            );
        }

        // 4. Insert Order Items & Update Stock
        for (const item of products) {
            // Insert item
            await supabase.from('order_items').insert({
                order_id: dbOrder.id,
                product_id: item.product_id,
                product_name: item.name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price
            });

            // Update stock
            const { data: currentProduct } = await supabase
                .from('products')
                .select('stock')
                .eq('id', item.product_id)
                .single();

            if (currentProduct) {
                const newStock = Math.max(0, currentProduct.stock - item.quantity);
                await supabase
                    .from('products')
                    .update({
                        stock: newStock,
                        status: newStock === 0 ? 'out_of_stock' : 'active',
                        is_available: newStock > 0
                    })
                    .eq('id', item.product_id);
            }
        }

        return NextResponse.json({
            id: razorpayOrderId,
            dbOrderId: dbOrder?.id,
            amount: amount,
            currency: 'INR'
        });

    } catch (error) {
        console.error('Payment API Error:', error);
        return NextResponse.json(
            { error: 'Error processing request' },
            { status: 500 }
        );
    }
}
