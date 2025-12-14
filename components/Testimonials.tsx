'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, Timestamp, orderBy, query } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Star, Send, User } from 'lucide-react';

interface Testimonial {
    id: string;
    name: string;
    message: string;
    imageUrl?: string;
    createdAt?: any;
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Testimonial[];
            setTestimonials(data);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, 'testimonials'), {
                name: name.trim(),
                message: message.trim(),
                createdAt: Timestamp.now()
            });

            setName('');
            setMessage('');
            setShowForm(false);
            fetchTestimonials();
            alert('Thank you for your review!');
        } catch (error) {
            console.error("Error adding testimonial:", error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="testimonials" className="py-16 px-4 md:px-8 bg-muted/30">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                        Don&apos;t just take our word for it. See what our valued customers have to say!
                    </p>
                    <Button onClick={() => setShowForm(!showForm)} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {showForm ? 'Cancel' : 'Write a Review'}
                    </Button>
                </div>

                {/* Submit Form */}
                {showForm && (
                    <Card className="max-w-lg mx-auto mb-12 bg-card border-border">
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name" className="text-foreground">Your Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        required
                                        className="bg-muted border-border text-foreground"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="message" className="text-foreground">Your Review</Label>
                                    <Textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Share your experience..."
                                        rows={4}
                                        required
                                        className="bg-muted border-border text-foreground"
                                    />
                                </div>
                                <Button type="submit" disabled={submitting} className="w-full">
                                    <Send className="h-4 w-4 mr-2" />
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Testimonials Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-muted rounded-2xl h-48" />
                            </div>
                        ))}
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="text-center py-12">
                        <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimonial) => (
                            <Card key={testimonial.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                                            <User className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground">&quot;{testimonial.message}&quot;</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
