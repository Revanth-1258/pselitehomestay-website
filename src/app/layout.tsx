import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { BookingProvider } from '@/context/BookingContext';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingModal } from '@/components/booking/BookingModal';
import { RoomDetailModal } from '@/components/booking/RoomDetailModal';
import { BookingInvoiceModal } from '@/components/booking/BookingInvoiceModal';
import { DevotionalAudioPlayer } from '@/components/ui/DevotionalAudioPlayer';
import { FloatingContactBar } from '@/components/layout/FloatingContactBar';
import { BookDirectPopup } from '@/components/ui/BookDirectPopup';
import { Analytics } from '@/components/layout/Analytics';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pselitehomestays.com'),
  title: 'Tirupati Homestay Near Alipiri & Railway Station | PS Elite',
  description:
    'Budget AC rooms & family apartments in Tirupati, 1.5 km from the railway station and 8 mins to Alipiri. Rated 4.8 on Google by 550+ guests. Book direct.',
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
  // Canonical is set per page (page.tsx, rooms, near). Setting it here would make
  // every route without its own canonical (404s, admin) point at the homepage.
  icons: {
    icon: '/favicon.ico',
    apple: '/ps-elite-logo.png',
  },
  openGraph: {
    title: 'Tirupati Homestay Near Alipiri & Railway Station | PS Elite',
    description:
      'Budget AC rooms & family apartments in Tirupati, 1.5 km from the railway station and 8 mins to Alipiri. Rated 4.8 on Google by 550+ guests. Book direct.',
    url: 'https://www.pselitehomestays.com',
    siteName: 'PS Elite Homestay',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://www.pselitehomestays.com/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'PS Elite Homestay Tirupati - Luxury Rooms & Family Apartments Near Tirumala',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tirupati Homestay Near Alipiri & Railway Station | PS Elite',
    description:
      'Budget AC rooms & family apartments in Tirupati, 1.5 km from the railway station and 8 mins to Alipiri. Rated 4.8 on Google by 550+ guests. Book direct.',
    images: ['https://www.pselitehomestays.com/images/og-cover.jpg'],
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
        '@id': 'https://www.pselitehomestays.com/#hotel',
        name: 'PS Elite Homestay',
        alternateName: 'PS Elite Homestay Tirupati',
        description:
          'Budget and luxury homestay featuring AC/Non-AC rooms, 1BHK/2BHK family service apartments, a penthouse terrace suite, elevator access, and 24/7 support desk near Tirupati Railway Station, Bus Stand, Padmavathi Ammavari Temple, and Alipiri Footpath.',
        url: 'https://www.pselitehomestays.com',
        telephone: '+91 93927 39715',
        email: 'pselitehomestays@gmail.com',
        priceRange: '₹1,000 - ₹4,500',
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
        checkinTime: '12:00',
        checkoutTime: '11:00',
        hasMap: 'https://g.page/r/CUrLKvmEc7ihEAE',
        sameAs: [
          'https://instagram.com/ps_elite_homestay',
          'https://www.youtube.com/@PSEliteHomestay',
        ],
        image: [
          'https://www.pselitehomestays.com/images/rooms/hospitality-w1.webp',
          'https://www.pselitehomestays.com/images/rooms/building-exterior.webp',
          'https://www.pselitehomestays.com/ps-elite-logo.png',
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: '19-4-9/D/9A, Air Bypass Rd, behind Easy Buy, STV Nagar',
          addressLocality: 'Tirupati',
          addressRegion: 'Andhra Pradesh',
          postalCode: '517501',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 13.623146,
          longitude: 79.426038,
        },
        amenityFeature: [
          { '@type': 'LocationFeatureSpecification', name: 'Elevator Access', value: true },
          { '@type': 'LocationFeatureSpecification', name: '24/7 Support Desk', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Free High-Speed WiFi', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'AC & Non-AC Rooms', value: true },
          { '@type': 'LocationFeatureSpecification', name: 'Car Parking', value: true },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.pselitehomestays.com/#website',
        name: 'PS Elite Homestay',
        url: 'https://www.pselitehomestays.com',
        description: 'Official portal for PS Elite Homestay luxury rooms and apartments in Tirupati.',
        publisher: {
          '@id': 'https://www.pselitehomestays.com/#hotel',
        },
        inLanguage: 'en-IN',
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
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100000] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-black"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main" className="flex-grow">{children}</main>
          <Footer />

          {/* Interactive Global Modals & Audio Concierge */}
          <RoomDetailModal />
          <BookingModal />
          <BookingInvoiceModal />
          <DevotionalAudioPlayer />
          <FloatingContactBar />
          <BookDirectPopup />
        </BookingProvider>
        <Analytics />
      </body>
    </html>
  );
}
