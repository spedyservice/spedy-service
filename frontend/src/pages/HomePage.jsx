import React, { Suspense } from 'react';
import ProductCategorySection from '../components/home/ProductCategorySection';
import Hero from '../components/home/Hero';
import TrustFeatures from '../components/home/TrustFeatures';
import ImageServicesSection from '../components/home/ImageServicesSection';

// Lazy‑load the heavier sections below the fold
const ServicesSection = React.lazy(() => import('../components/home/ServicesSection'));
const BrandsSection = React.lazy(() => import('../components/home/BrandsSection'));
const FeaturedProducts = React.lazy(() => import('../components/home/FeaturedProducts'));
const VideoSection = React.lazy(() => import('../components/home/VideoSection'));
const ExpertSection = React.lazy(() => import('../components/home/ExpertSection'));
const HowItWorks = React.lazy(() => import('../components/home/HowItWorks'));
const WhyChooseUs = React.lazy(() => import('../components/home/WhyChooseUs'));
const Testimonials = React.lazy(() => import('../components/home/Testimonials'));

// Minimal loading placeholder
const SectionLoader = () => (
  <div className="flex justify-center py-10">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const HomePage = () => {
  return (
    <>
      {/* 1. Category icon strip – right under navbar (always loaded) */}
      <ProductCategorySection />

      {/* 2. Hero banner slider (always loaded) */}
      <Hero />

      {/* 3. Trust features bar (always loaded) */}
      <TrustFeatures />

      {/* 4. Service cards (We Repair and Service…) */}
      <ImageServicesSection />

      {/* 5. All repair services (lazy) */}
      <Suspense fallback={<SectionLoader />}>
        <ServicesSection />
      </Suspense>

      {/* 6. Brands marquee (lazy) */}
      <Suspense fallback={<SectionLoader />}>
        <BrandsSection />
      </Suspense>

      {/* 7. Featured products (lazy) */}
      <Suspense fallback={<SectionLoader />}>
        <FeaturedProducts />
      </Suspense>

      {/* 8. Video section – "See It to Shop It" (lazy) */}
      <Suspense fallback={<SectionLoader />}>
        <VideoSection />
      </Suspense>

      {/* 9. Meet Our Expert (lazy) */}
      <Suspense fallback={<SectionLoader />}>
        <ExpertSection />
      </Suspense>

      {/* 10. How it works (lazy) */}
      <Suspense fallback={<SectionLoader />}>
        <HowItWorks />
      </Suspense>

      {/* 11. Why choose us (lazy) */}
      <Suspense fallback={<SectionLoader />}>
        <WhyChooseUs />
      </Suspense>

      {/* 12. Testimonials (lazy) */}
      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>
    </>
  );
};

export default HomePage;