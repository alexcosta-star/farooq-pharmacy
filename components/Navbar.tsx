'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, Search } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
}

export default function Navbar() {
    const { user, isAdmin, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [mounted, setMounted] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        // Fetch all products once for search
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'products'));
                const products = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Product[];
                setAllProducts(products);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, []);

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchOpen(false);
                setSearchQuery('');
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        const results = allProducts
            .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5);
        setSearchResults(results);
    };

    const closeSearch = () => {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">F</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-bold text-lg text-foreground">Farooq Pharmacy</span>
                            <span className="block text-xs text-muted-foreground">Dera Ghazi Khan</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
                            Home
                        </Link>
                        <Link href="#products" className="text-foreground/80 hover:text-foreground transition-colors">
                            Products
                        </Link>
                        <Link href="#testimonials" className="text-foreground/80 hover:text-foreground transition-colors">
                            Reviews
                        </Link>
                        <Link href="#location" className="text-foreground/80 hover:text-foreground transition-colors">
                            Location
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search Button */}
                        <div className="relative" ref={searchRef}>
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            {/* Search Dropdown */}
                            {searchOpen && (
                                <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
                                    <div className="p-3 border-b border-border flex items-center gap-2">
                                        <Search className="h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            placeholder="Search medicines..."
                                            className="flex-1 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:outline-none"
                                            autoFocus
                                        />
                                        <button onClick={closeSearch} className="p-1 hover:bg-muted rounded">
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    </div>

                                    <div className="max-h-72 overflow-y-auto">
                                        {searchResults.length > 0 ? (
                                            <div className="p-2">
                                                {searchResults.map((product) => (
                                                    <Link
                                                        key={product.id}
                                                        href="#products"
                                                        onClick={closeSearch}
                                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                                                    >
                                                        {product.imageUrl ? (
                                                            <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded object-cover" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                                                No img
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-foreground">{product.name}</p>
                                                            <p className="text-sm text-primary">Rs. {product.price}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : searchQuery.length >= 2 ? (
                                            <div className="p-4 text-center text-muted-foreground text-sm">
                                                No medicines found for &quot;{searchQuery}&quot;
                                            </div>
                                        ) : (
                                            <div className="p-4 text-center text-muted-foreground text-sm">
                                                Type at least 2 characters to search
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle */}


                        {/* Auth Buttons */}
                        {user ? (
                            <div className="hidden md:flex items-center gap-2">
                                {isAdmin && (
                                    <Link href="/admin">
                                        <Button size="sm">
                                            Admin Panel
                                        </Button>
                                    </Link>
                                )}
                                <Button variant="ghost" size="sm" onClick={signOut} className="text-foreground">
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="text-foreground">Login</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-muted text-foreground"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border">
                        <div className="flex flex-col gap-2">
                            <Link href="/" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                Home
                            </Link>
                            <Link href="#products" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                Products
                            </Link>
                            <Link href="#testimonials" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                Reviews
                            </Link>
                            <Link href="#location" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                Location
                            </Link>
                            <div className="border-t border-border my-2" />
                            {user ? (
                                <>
                                    {isAdmin && (
                                        <Link href="/admin" className="px-4 py-2 text-primary hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button onClick={signOut} className="px-4 py-2 text-left text-foreground hover:bg-muted rounded-lg">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="px-4 py-2 text-foreground hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                        Login
                                    </Link>
                                    <Link href="/signup" className="px-4 py-2 text-primary hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
