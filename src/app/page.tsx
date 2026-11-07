import React from 'react';
import type { Metadata } from 'next';
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

const SITE_URL = 'https://www.pselitehomestays.com';

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

// FAQ schema lives on the homepage only, because these questions are only visible here
// (Google requires FAQ markup to match on-page content). Keep in sync with FaqSection.
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE_URL}/#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How far is PS Elite Homestay from Tirupati Railway Station, Bus Stand, Padmavathi Temple, and Alipiri?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PS Elite Homestay is centrally located on Air Bypass Road, STV Nagar, just 1.4 km from Tirupati Bus Stand, 1.5 km from Tirupati Railway Station, 3.5 km from Padmavathi Ammavari Temple (Tiruchanur), and about a 10-minute drive to the Alipiri Footpath gateway to Tirumala.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you have both budget-friendly rooms and luxury family apartments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We offer a range of stays including Budget Rooms, Standard & Deluxe King AC/Non-AC Rooms, and 1BHK & 2BHK Family Service Apartments and a Penthouse Terrace Suite, ideal for pilgrim families and group travelers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is elevator access available for senior citizens and elders?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, PS Elite Homestay provides smooth elevator access across floors for easy mobility of elders, senior citizens, and luggage transport.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I contact the 24/7 Support Desk to book a room?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can call our 24/7 booking desk directly at +91 93927 39715 or +91 94403 11716, or connect with us instantly via WhatsApp.',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <div className="bg-[#111111] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
