import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createServerSupabase } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
    try {
        const { amount, products, address, paymentMethod } = await request.json();

        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();
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

        // Save order to database
        const { data: dbOrder, error: dbError } = await supabase
            .from('orders')
            .insert({
                user_id: user?.id || null,
                razorpay_order_id: razorpayOrderId, // Null for COD
                amount: amount,
                status: 'pending',
                payment_status: paymentMethod === 'cod' ? 'pending' : 'pending', // Razorpay will update to paid via webhook or client verification
                payment_method: paymentMethod,
                shipping_address: address,
                items: products
            })
            .select()
            .single();

        if (dbError) {
            console.error('Database Error:', dbError);
            return NextResponse.json(
                { error: 'Error creating order in database' },
                { status: 500 }
            );
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
