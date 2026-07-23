import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { BookingProvider } from '@/context/BookingContext';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { LuxuryLoader } from '@/components/layout/LuxuryLoader';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingModal } from '@/components/booking/BookingModal';
import { RoomDetailModal } from '@/components/booking/RoomDetailModal';
import { BookingInvoiceModal } from '@/components/booking/BookingInvoiceModal';
import { DevotionalAudioPlayer } from '@/components/ui/DevotionalAudioPlayer';
import { FloatingContactBar } from '@/components/layout/FloatingContactBar';
import { BookDirectPopup } from '@/components/ui/BookDirectPopup';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pselitehomestays.com'),
  title: 'PS Elite Homestay Tirupati | Stays Near Railway Station & Alipiri',
  description:
    'Experience budget & luxury rooms at PS Elite Homestay Tirupati. Prime location just 1.5 km from Railway Station and 8 mins to Alipiri Tirumala footpath.',
  keywords: [
    'PS Elite Homestay Tirupati',
    'Budget homestay Tirupati',
    'Luxury homestay Tirupati',
    'Homestay near Tirupati Railway Station',
    'Homestay near Tirupati Bus Stand',
    'Homestay near Padmavathi Ammavari Temple Tiruchanur',
    'Homestay near Alipiri Footpath Entry',
    'Tirupati 2BHK family service apartment',
    'Tirupati homestay with elevator access',
    'AC and Non-AC budget rooms Tirupati',
    'Best homestay near Tirumala darshan',
  ],
  alternates: {
    canonical: 'https://pselitehomestays.com',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'PS Elite Homestay Tirupati | Stays Near Railway Station & Alipiri',
    description:
      'Experience budget & luxury rooms at PS Elite Homestay Tirupati. Prime location just 1.5 km from Railway Station and 8 mins to Alipiri Tirumala footpath.',
    url: 'https://pselitehomestays.com',
    siteName: 'PS Elite Homestay, Tirupati',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PS Elite Homestay Tirupati | Stays Near Railway Station & Alipiri',
    description:
      'Experience budget & luxury rooms at PS Elite Homestay Tirupati. Prime location just 1.5 km from Railway Station and 8 mins to Alipiri Tirumala footpath.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Hotel',
        '@id': 'https://pselitehomestays.com/#hotel',
        name: 'PS Elite Homestay, Tirupati',
        description:
          'Budget and luxury homestay featuring AC/Non-AC rooms, 1BHK/2BHK family apartments, elevator access, and 24/7 support desk near Tirupati Railway Station, Bus Stand, Padmavathi Ammavari Temple, and Alipiri Footpath.',
        url: 'https://pselitehomestays.com',
        telephone: '+919392739715',
        email: 'pselitehomestays@gmail.com',
        priceRange: '₹₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '19-4-9/D/9A, Air Bypass Road, STV Nagar',
          addressLocality: 'Tirupati',
          addressRegion: 'Andhra Pradesh',
          postalCode: '517501',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 13.6548,
          longitude: 79.4011,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '128',
        },
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'Elevator Access', value: true },
          { '@type': 'LocationFeatureSpecification', name: '24/7 Support Desk', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Free High-Speed WiFi', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'AC & Non-AC Rooms', value: true },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://pselitehomestays.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How far is PS Elite Homestay from Tirupati Railway Station, Bus Stand, Padmavathi Temple, and Alipiri?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'PS Elite Homestay is centrally located on Air Bypass Road, STV Nagar, just 1 km from Tirupati Bus Stand, 1.5 km from Tirupati Railway Station, 3 km from Padmavathi Ammavari Temple (Tiruchanur), and 8 minutes drive to the Alipiri Footpath gateway to Tirumala.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you have both budget-friendly rooms and luxury family apartments?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! We offer a range of stays including Budget Rooms, Standard & Deluxe King AC/Non-AC Rooms, and spacious 1BHK & 2BHK Family Apartments ideal for pilgrim families and group travelers.',
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
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} antialiased scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body className="bg-[#111111] text-white min-h-screen flex flex-col selection:bg-[#B8860B] selection:text-black">
        <BookingProvider>
          <CustomCursor />
          <LuxuryLoader />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />

          {/* Interactive Global Modals & Audio Concierge */}
          <RoomDetailModal />
          <BookingModal />
          <BookingInvoiceModal />
          <DevotionalAudioPlayer />
          <FloatingContactBar />
          <BookDirectPopup />
        </BookingProvider>
      </body>
    </html>
  );
}
