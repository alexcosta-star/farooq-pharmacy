'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function AIChatButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Add welcome message when chat opens for the first time
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: 'Assalam o Alaikum! 👋 Main Farooq Pharmacy ka assistant hoon. Aapko kaunsi medicine chahiye? Hum se khareedein, best prices milenge!'
            }]);
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.slice(-10)
                }),
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error: any) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Maaf kijiye, kuch problem ho gayi. Please 03310076524 pe call karein!'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickQuestions = [
        "Kya medicines hain?",
        "Panadol hai?",
        "Order kaise karoon?"
    ];

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300",
                    "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
                    "hover:scale-110 active:scale-95",
                    isOpen && "hidden"
                )}
            >
                <MessageCircle className="h-6 w-6 text-white" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* Chat Panel */}
            <div
                className={cn(
                    "fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-48px)] transition-all duration-300",
                    "bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden",
                    isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <Pill className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Farooq Pharmacy</h3>
                            <p className="text-xs text-white/80">Aapki sehat, hamari zimmedari</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-950">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "flex gap-3",
                                msg.role === 'user' ? "justify-end" : "justify-start"
                            )}
                        >
                            {msg.role === 'assistant' && (
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-green-500" />
                                </div>
                            )}
                            <div
                                className={cn(
                                    "max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap",
                                    msg.role === 'user'
                                        ? "bg-green-500 text-white rounded-br-md"
                                        : "bg-slate-800 text-slate-200 rounded-bl-md"
                                )}
                            >
                                {msg.content}
                            </div>
                            {msg.role === 'user' && (
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center">
                                    <User className="h-4 w-4 text-slate-300" />
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-3 justify-start">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                <Bot className="h-4 w-4 text-green-500" />
                            </div>
                            <div className="bg-slate-800 px-4 py-2 rounded-2xl rounded-bl-md">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length <= 1 && (
                    <div className="px-4 py-2 border-t border-slate-800 flex gap-2 overflow-x-auto">
                        {quickQuestions.map((q, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setInput(q);
                                    setTimeout(() => sendMessage(), 100);
                                }}
                                className="px-3 py-1 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-full whitespace-nowrap transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="p-4 border-t border-slate-700 bg-slate-900">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Apna sawal likhein..."
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="p-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
                        >
                            <Send className="h-5 w-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
