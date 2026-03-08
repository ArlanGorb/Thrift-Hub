import HeroBanner from '@/components/home/HeroBanner';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CategorySection from '@/components/home/CategorySection';
import BestSellers from '@/components/home/BestSellers';
import ReviewHighlights from '@/components/home/ReviewHighlights';
import SustainabilityBanner from '@/components/home/SustainabilityBanner';

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedProducts />
      <CategorySection />
      <BestSellers />
      <SustainabilityBanner />
      <ReviewHighlights />
    </>
  );
}

