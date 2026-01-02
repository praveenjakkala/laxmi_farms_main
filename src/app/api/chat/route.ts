import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `You are a helpful AI assistant for Laxmi Farms, a premium country chicken farm in Nalgonda, Telangana, India.

PRODUCTS:
1. Country Chicken (Natu Kodi) - ₹450/kg
2. Kadaknath Chicken - ₹850/kg  
3. Broiler Chicken - ₹280/kg
4. Giriraja Chicken - ₹380/kg
5. Desi Eggs - ₹120 for 12, ₹280 for 30

DELIVERY: Same-day in Nalgonda, 1-2 days elsewhere. Free above ₹1000.
CONTACT: +91 9885167159 | laxmifarms001@gmail.com
ADDRESS: Pedda Banda, Nalgonda, Telangana - 508001

Keep responses concise and helpful.`;

export async function POST(request: NextRequest) {
    try {
        const { message, language } = await request.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                reply: language === 'te'
                    ? 'AI సేవ అందుబాటులో లేదు. +91 9885167159 కు కాల్ చేయండి.'
                    : 'AI service unavailable. Please call +91 9885167159.',
            });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

        const prompt = `${systemPrompt}

${language === 'te' ? 'Respond in Telugu.' : ''}

Customer: ${message}

Provide a helpful, concise response:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({
            reply: 'Sorry, I encountered an error. Please call +91 9885167159 for help.',
        });
    }
}
