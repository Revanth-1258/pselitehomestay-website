import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { RoomsSection } from '@/components/home/RoomsSection';
import { AmenitiesSection } from '@/components/home/AmenitiesSection';
import { WhyChooseUsSection } from '@/components/home/WhyChooseUsSection';
import { MasonryGallery } from '@/components/home/MasonryGallery';
import { CustomerGallerySection } from '@/components/home/CustomerGallerySection';
import { DiscoverTirupatiSection } from '@/components/home/DiscoverTirupatiSection';
import { LocationSection } from '@/components/home/LocationSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { BookingCtaSection } from '@/components/home/BookingCtaSection';
import { InstagramPromo } from '@/components/home/InstagramPromo';
import { FaqSection } from '@/components/home/FaqSection';

export default function HomePage() {
  return (
    <div className="bg-[#111111] text-white">
      <HeroSection />
      <StatsSection />
      <RoomsSection />
      <AmenitiesSection />
      <WhyChooseUsSection />
      <MasonryGallery />
      <CustomerGallerySection />
      <TestimonialsSection />
      <DiscoverTirupatiSection />
      <LocationSection />
      <BookingCtaSection />
      <InstagramPromo />
      <FaqSection />
    </div>
  );
}
