import React, { Suspense, useState } from 'react';
import ProductCategorySection from '../components/home/ProductCategorySection';
import Hero from '../components/home/Hero';
import TrustFeatures from '../components/home/TrustFeatures';
import ImageServicesSection from '../components/home/ImageServicesSection';
import CallNowSection from '../components/home/CallNowSection';

// Lazy-load heavier sections below the fold
const ServicesSection   = React.lazy(() => import('../components/home/ServicesSection'));
const BrandsSection     = React.lazy(() => import('../components/home/BrandsSection'));
const FeaturedProducts  = React.lazy(() => import('../components/home/FeaturedProducts'));
const VideoSection      = React.lazy(() => import('../components/home/VideoSection'));
const ExpertSection     = React.lazy(() => import('../components/home/ExpertSection'));
const MapSection        = React.lazy(() => import('../components/home/MapSection'));
const HowItWorks        = React.lazy(() => import('../components/home/HowItWorks'));
const WhyChooseUs       = React.lazy(() => import('../components/home/WhyChooseUs'));
const Testimonials      = React.lazy(() => import('../components/home/Testimonials'));

const SectionLoader = () => (
  <div className="flex justify-center py-10">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Video URL for background
const tabVideoSrc = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260423_084718_72a17915-4964-4059-afcd-22d59399b72e.mp4';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('service');

  return (
    <>
      <Hero />
      <TrustFeatures />

      {/* Tabs with video background */}
      <div className="relative py-4 border-b border-blue-700 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            src={tabVideoSrc}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="container-custom max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex justify-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('service')}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm sm:text-base transition-all duration-200 ${
                activeTab === 'service'
                  ? 'bg-white text-blue-800 shadow-lg'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30'
              }`}
            >
              🔧 Service
            </button>
            <button
              onClick={() => setActiveTab('sells')}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm sm:text-base transition-all duration-200 ${
                activeTab === 'sells'
                  ? 'bg-white text-blue-800 shadow-lg'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30'
              }`}
            >
              🛒 Sells
            </button>
          </div>
        </div>
      </div>

      {/* Service Tab Content */}
      {activeTab === 'service' && (
        <>
          <ImageServicesSection />
          <CallNowSection />
          <Suspense fallback={<SectionLoader />}>
            <ServicesSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <ExpertSection />
          </Suspense>
        </>
      )}

      {/* Sells Tab Content */}
      {activeTab === 'sells' && (
        <>
          <ProductCategorySection />
          <Suspense fallback={<SectionLoader />}>
            <FeaturedProducts />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <VideoSection />
          </Suspense>
        </>
      )}

      {/* Shared Sections — always visible regardless of tab */}
      <Suspense fallback={<SectionLoader />}>
        <BrandsSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <MapSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <WhyChooseUs />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>
    </>
  );
};

export default HomePage;