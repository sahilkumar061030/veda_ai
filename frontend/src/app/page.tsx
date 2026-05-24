'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection, FeaturesSection, HowItWorks, CTASection, Footer } from '@/components/landing/LandingComponents';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
      <Footer />
    </main>
  );
}
