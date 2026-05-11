import React from 'react';
import ProductCategorySection from '../components/home/ProductCategorySection';
import Hero from '../components/home/Hero';
import TrustFeatures from '../components/home/TrustFeatures';
import ImageServicesSection from '../components/home/ImageServicesSection';
import ServicesSection from '../components/home/ServicesSection';
import BrandsSection from '../components/home/BrandsSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import VideoSection from '../components/home/VideoSection';
import ExpertSection from '../components/home/ExpertSection';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';

const HomePage = () => {
  return (
    <>
      {/* 1. Category icon strip – right under navbar */}
      <ProductCategorySection />

      {/* 2. Hero banner slider */}
      <Hero />

      {/* 3. Trust features bar */}
      <TrustFeatures />

      {/* 4. Service cards (We Repair and Service…) */}
      <ImageServicesSection />

      {/* 5. All repair services */}
      <ServicesSection />

      {/* 6. Brands marquee */}
      <BrandsSection />

      {/* 7. Featured products */}
      <FeaturedProducts />

      {/* 8. Video section – "See It to Shop It" */}
      <VideoSection />

      {/* 9. Meet Our Expert */}
      <ExpertSection />

      {/* 10. How it works */}
      <HowItWorks />

      {/* 11. Why choose us */}
      <WhyChooseUs />

      {/* 12. Testimonials */}
      <Testimonials />
    </>
  );
};

export default HomePage;