'use client';

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_IMAGES = [
    'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80',
    'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1200&q=80',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&q=80',
];

export default function HeroCarousel() {
    const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const docRef = doc(db, 'site_settings', 'config');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.carouselImages && data.carouselImages.length > 0) {
                        setImages(data.carouselImages);
                    }
                }
            } catch (error) {
                console.error("Error fetching carousel images:", error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
        emblaApi.on('select', onSelect);
        return () => {
            emblaApi.off('select', onSelect);
        };
    }, [emblaApi]);

    const scrollPrev = () => emblaApi?.scrollPrev();
    const scrollNext = () => emblaApi?.scrollNext();

    return (
        <section className="relative w-full overflow-hidden bg-black group">
            <div className="embla" ref={emblaRef}>
                <div className="embla__container flex">
                    {images.map((src, index) => (
                        <div className="embla__slide flex-[0_0_100%] min-w-0" key={index}>
                            {/* Container for the slide */}
                            <div className="relative h-[300px] md:h-[450px] lg:h-[550px] w-full overflow-hidden flex items-center justify-center bg-black">

                                {/* Background Layer: Blurred and zoomed to fill entire container */}
                                <div
                                    className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
                                    style={{
                                        backgroundImage: `url(${src})`,
                                        filter: 'blur(30px)',
                                        transform: 'scale(1.2)'
                                    }}
                                />

                                {/* Main Image Layer: Forces height to fill container, allows width to vary */}
                                <div className="relative z-10 h-full flex items-center justify-center">
                                    <img
                                        src={src}
                                        alt={`Slide ${index + 1}`}
                                        className="h-full w-auto max-w-none object-contain shadow-2xl"
                                    />
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows - Only visible on hover/touch */}
            <button
                onClick={scrollPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 z-20"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={scrollNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 z-20"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            selectedIndex === index
                                ? 'bg-white w-8'
                                : 'bg-white/40 w-2 hover:bg-white/60'
                        )}
                    />
                ))}
            </div>
        </section>
    );
}
