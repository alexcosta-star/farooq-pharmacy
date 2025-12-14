'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, ChevronLeft, ChevronRight, Package } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
}

export default function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [whatsappNumber, setWhatsappNumber] = useState('923310076524');
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const querySnapshot = await getDocs(collection(db, 'products'));
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];
                setProducts(productsData);

                // Fetch WhatsApp number
                const settingsDoc = await getDoc(doc(db, 'site_settings', 'config'));
                if (settingsDoc.exists()) {
                    const data = settingsDoc.data();
                    if (data.whatsappNumber) {
                        setWhatsappNumber(data.whatsappNumber.replace(/\D/g, ''));
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleBuy = (product: Product) => {
        const message = `Hi! I want to order:\n\n*${product.name}*\nPrice: Rs. ${product.price}\n\n${product.imageUrl ? `Image: ${product.imageUrl}` : ''}`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    };

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

    return (
        <section id="products" className="py-16 px-4 md:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                        Our Products
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Quality Medicines
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Browse our wide selection of medicines. Order directly via WhatsApp!
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-muted rounded-2xl aspect-square" />
                                <div className="mt-4 h-4 bg-muted rounded w-3/4" />
                                <div className="mt-2 h-4 bg-muted rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-16">
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No products available yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {displayedProducts.map((product) => (
                                <Card
                                    key={product.id}
                                    className="group overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-muted">
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <Package className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                                        <p className="text-primary font-bold text-lg">Rs. {product.price}</p>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-3">
                                            {product.description}
                                        </p>
                                        <Button
                                            onClick={() => handleBuy(product)}
                                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                        >
                                            <ShoppingBag className="h-4 w-4 mr-2" />
                                            Buy on WhatsApp
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-12">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="border-border text-foreground"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Previous
                                </Button>
                                <div className="flex items-center gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`h-10 w-10 rounded-lg font-medium transition-colors ${currentPage === i + 1
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="border-border text-foreground"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
