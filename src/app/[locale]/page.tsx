import Hero from '@/components/hero'
import MarqueeSection from '@/components/home/marquee-section'
import PromoBanner from '@/components/home/promo-banner'
import FeaturedProducts from '@/components/home/featured-products'
import BrandsSection from '@/components/home/brands-section'
import FeaturedCategories from '@/components/home/featured-categories'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <MarqueeSection />
      <FeaturedProducts />
      <PromoBanner />
      <FeaturedCategories />
      <BrandsSection />
    </div>
  )
}