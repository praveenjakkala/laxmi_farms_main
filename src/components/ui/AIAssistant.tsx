'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const initialMessages: Message[] = [
    {
        id: '1',
        role: 'assistant',
        content: 'నమస్కారం! Welcome to Laxmi Farms! 🐔 I\'m here to help you with:\n\n• Product information\n• Chicken varieties\n• Delivery & pricing\n• Order assistance\n\nHow can I help you today?',
        timestamp: new Date(),
    },
];

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [language, setLanguage] = useState<'en' | 'te'>('en');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Call the AI API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input.trim(),
                    language,
                    history: messages.slice(-10), // Last 10 messages for context
                }),
            });

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply || 'I apologize, but I encountered an issue. Please try again or call us at +91 9885167159.',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            // Fallback response if API fails
            const fallbackMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: language === 'te'
                    ? 'క్షమించండి, నేను ప్రస్తుతం సమస్యను ఎదుర్కొంటున్నాను. దయచేసి +91 9885167159 కు కాల్ చేయండి.'
                    : 'I apologize for the inconvenience. Please call us at +91 9885167159 or try again later.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, fallbackMessage]);
        }

        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {/* Chat Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-colors flex items-center justify-center ${isOpen ? 'hidden' : ''
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Open chat assistant"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-6 left-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        style={{ height: '500px', maxHeight: 'calc(100vh - 100px)' }}
                    >
                        {/* Header */}
                        <div className="bg-primary-600 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Farm Assistant</h3>
                                    <p className="text-xs text-white/80">Online • Ready to help</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Language Toggle */}
                                <button
                                    onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
                                    className="px-2 py-1 text-xs bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                                >
                                    {language === 'en' ? 'తెలుగు' : 'English'}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                    aria-label="Close chat"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-warm-50">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''
                                        }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                            ? 'bg-primary-100 text-primary-600'
                                            : 'bg-primary-600 text-white'
                                            }`}
                                    >
                                        {message.role === 'user' ? (
                                            <User className="w-4 h-4" />
                                        ) : (
                                            <Bot className="w-4 h-4" />
                                        )}
                                    </div>
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${message.role === 'user'
                                            ? 'bg-primary-600 text-white rounded-tr-sm'
                                            : 'bg-white shadow-sm rounded-tl-sm'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-2"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                                        <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-warm-200 bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={
                                        language === 'te' ? 'మీ ప్రశ్న టైప్ చేయండి...' : 'Type your question...'
                                    }
                                    className="flex-1 px-4 py-2 bg-warm-50 border border-warm-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Send message"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-xs text-warm-400 mt-2 text-center">
                                Powered by Gemini AI
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
