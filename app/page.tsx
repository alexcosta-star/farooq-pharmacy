import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import ProductGrid from '@/components/ProductGrid';
import Testimonials from '@/components/Testimonials';
import MapSection from '@/components/MapSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 w-full">
        <HeroCarousel />
        <ProductGrid />
        <Testimonials />
        <MapSection />
      </div>
      <Footer />
    </main>
  );
}
