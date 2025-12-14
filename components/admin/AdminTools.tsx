'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function AdminTools() {
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingTestimonials, setLoadingTestimonials] = useState(false);

    const generateProducts = async () => {
        setLoadingProducts(true);
        try {
            const dummyProducts = [
                { name: "Panadol", price: 50, description: "Effective pain reliever and fever reducer.", imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80" },
                { name: "Brufen", price: 120, description: "Anti-inflammatory pain killer for muscles.", imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=300&q=80" },
                { name: "Cac1000", price: 350, description: "Calcium supplement with Vitamin C.", imageUrl: "https://images.unsplash.com/photo-1550572017-edc94a4c529c?w=300&q=80" },
                { name: "Arinac", price: 80, description: "For cold and flu symptoms.", imageUrl: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&q=80" },
                { name: "Disprin", price: 30, description: "Fast relief from headache.", imageUrl: "https://images.unsplash.com/photo-1628771065518-0d82f19a099d?w=300&q=80" },
                { name: "Flagyl", price: 60, description: "Antibiotic for stomach infections.", imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&q=80" },
                { name: "Voltral Emulgel", price: 250, description: "Gel for muscle pain relief.", imageUrl: "https://images.unsplash.com/photo-1579165466741-7f35a4755657?w=300&q=80" },
                { name: "Surbex Z", price: 450, description: "Multivitamin with Zinc.", imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80" },
            ];

            for (const p of dummyProducts) {
                await addDoc(collection(db, 'products'), {
                    ...p,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now()
                });
            }
            alert("Added 8 dummy products! Go to the Products tab to see them.");
        } catch (e: any) {
            console.error(e);
            alert("Failed to generate products: " + e.message);
        } finally {
            setLoadingProducts(false);
        }
    };

    const generateTestimonials = async () => {
        setLoadingTestimonials(true);
        try {
            const dummyTestimonials = [
                { name: "Ali Khan", message: "Great service and fast delivery! Highly recommended for all your medicine needs.", imageUrl: "" },
                { name: "Sara Ahmed", message: "Found all my medicines here. The staff is very helpful and knowledgeable.", imageUrl: "" },
                { name: "Usman Raza", message: "Very cooperative staff and genuine medicines. Best pharmacy in DG Khan!", imageUrl: "" },
            ];

            for (const t of dummyTestimonials) {
                await addDoc(collection(db, 'testimonials'), {
                    ...t,
                    createdAt: Timestamp.now()
                });
            }
            alert("Added 3 dummy testimonials! Refresh the homepage to see them.");
        } catch (e: any) {
            console.error(e);
            alert("Failed to generate testimonials: " + e.message);
        } finally {
            setLoadingTestimonials(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <Card className="bg-slate-900 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">Developer Tools</CardTitle>
                    <CardDescription className="text-slate-400">
                        Use these tools to populate your database with sample data for testing.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button onClick={generateProducts} disabled={loadingProducts} className="flex-1">
                            {loadingProducts ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Generate 8 Test Products'
                            )}
                        </Button>
                        <Button onClick={generateTestimonials} disabled={loadingTestimonials} variant="secondary" className="flex-1">
                            {loadingTestimonials ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Generate 3 Testimonials'
                            )}
                        </Button>
                    </div>

                    <p className="text-sm text-slate-500">
                        Note: These tools add sample data to your Firebase database. Use them for testing purposes.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
