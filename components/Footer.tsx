'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

interface FooterSettings {
    phone: string;
    email: string;
    facebookUrl: string;
    instagramUrl: string;
    twitterUrl: string;
}

export default function Footer() {
    const [settings, setSettings] = useState<FooterSettings>({
        phone: '03310076524',
        email: 'farooqpharmacy@gmail.com',
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: ''
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, 'site_settings', 'config');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSettings(prev => ({
                        ...prev,
                        phone: data.phone || prev.phone,
                        email: data.email || prev.email,
                        facebookUrl: data.facebookUrl || '',
                        instagramUrl: data.instagramUrl || '',
                        twitterUrl: data.twitterUrl || ''
                    }));
                }
            } catch (error) {
                console.error("Error fetching footer settings:", error);
            }
        };

        fetchSettings();
    }, []);

    return (
        <footer className="bg-card border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">F</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-foreground">Farooq Pharmacy</h3>
                                <p className="text-sm text-muted-foreground">Dera Ghazi Khan</p>
                            </div>
                        </Link>
                        <p className="text-muted-foreground max-w-sm">
                            Your trusted partner in health since 2010. We provide quality medicines at the best prices with excellent customer service.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="#products" className="text-muted-foreground hover:text-primary transition-colors">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                                    Reviews
                                </Link>
                            </li>
                            <li>
                                <Link href="#location" className="text-muted-foreground hover:text-primary transition-colors">
                                    Location
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <Phone className="h-4 w-4 text-primary" />
                                <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors">
                                    {settings.phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground">
                                <Mail className="h-4 w-4 text-primary" />
                                <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">
                                    {settings.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-primary mt-1" />
                                <span>Block 8, Pakistani Chowk<br />DG Khan, Pakistan</span>
                            </li>
                        </ul>

                        {/* Social Links */}
                        <div className="flex gap-3 mt-6">
                            {settings.facebookUrl && (
                                <a
                                    href={settings.facebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white text-muted-foreground transition-colors"
                                >
                                    <Facebook className="h-5 w-5" />
                                </a>
                            )}
                            {settings.instagramUrl && (
                                <a
                                    href={settings.instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white text-muted-foreground transition-colors"
                                >
                                    <Instagram className="h-5 w-5" />
                                </a>
                            )}
                            {settings.twitterUrl && (
                                <a
                                    href={settings.twitterUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-muted hover:bg-primary hover:text-white text-muted-foreground transition-colors"
                                >
                                    <Twitter className="h-5 w-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground text-sm">
                    <p>&copy; {new Date().getFullYear()} Farooq Pharmacy. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
