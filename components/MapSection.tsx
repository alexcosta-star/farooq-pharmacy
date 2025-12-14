'use client';

import { MapPin, Navigation, Phone, Clock } from 'lucide-react';
import { Button } from './ui/button';

export default function MapSection() {
    // Google Maps embed for Dera Ghazi Khan, Block 8 area
    const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3489.0!2d70.6344!3d30.0421!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzMyLjAiTiA3MMKwMzgnMDQuMCJF!5e0!3m2!1sen!2s!4v1702560000000!5m2!1sen!2s";

    const openDirections = () => {
        window.open('https://www.google.com/maps/search/Farooq+Pharmacy+Block+8+Pakistani+Chowk+Dera+Ghazi+Khan', '_blank');
    };

    const openInMaps = () => {
        window.open('https://maps.google.com/?q=30.0421,70.6344', '_blank');
    };

    return (
        <section id="location" className="py-16 px-4 md:px-8 bg-background">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                        Hamari Location
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Pharmacy Visit Karein
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Dera Ghazi Khan mein hamari pharmacy asani se dhundh sakte hain
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    {/* Map */}
                    <div className="rounded-2xl overflow-hidden border border-border shadow-2xl h-[400px]">
                        <iframe
                            src={mapSrc}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                        />
                    </div>

                    {/* Address Card */}
                    <div className="space-y-4">
                        <div className="p-6 rounded-2xl bg-card border border-border h-full flex flex-col justify-between">
                            <div>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-primary/10">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-foreground mb-2">Hamara Address</h3>
                                        <p className="text-muted-foreground">
                                            BLOCK NO 8, NEAR PAKISTANI CHOWK<br />
                                            DERA GHAZI KHAN<br />
                                            Punjab, Pakistan 32200
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="font-medium text-foreground">Opening Hours</p>
                                            <p className="text-sm text-muted-foreground">9:00 AM - 10:00 PM (Rozana)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                                        <Phone className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="font-medium text-foreground">Phone / WhatsApp</p>
                                            <a href="tel:03310076524" className="text-sm text-primary hover:underline">03310076524</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button onClick={openDirections} className="flex-1 bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90">
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Directions
                                </Button>
                                <Button onClick={openInMaps} variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-white">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Open Maps
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
