export interface RoomType {
  id: string;
  name: string;
  category: 'room' | 'apartment' | 'penthouse';
  tagline: string;
  pricePerNight: number;
  originalPrice: number;
  guests: number;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  gallery: string[];
  amenities: string[];
  description: string;
  highlights: string[];
  isPopular?: boolean;
  videoUrl?: string;
}

export const ROOMS_DATA: RoomType[] = [
  {
    id: 'budget-room',
    name: 'Budget Room',
    category: 'room',
    tagline: 'Cozy, spotless comfort for solo pilgrims & couples',
    pricePerNight: 1000,
    originalPrice: 1500,
    guests: 2,
    areaSqFt: 240,
    bedrooms: 1,
    bathrooms: 1,
    image: '/images/rooms/budget-screenshot.webp',
    gallery: [
      '/images/rooms/budget-screenshot.webp',
      '/images/rooms/budget-w1.webp',
      '/images/rooms/building-exterior.webp',
    ],
    amenities: [
      'Comfortable Double Bed',
      'Unlimited High-Speed Wi-Fi',
      'Attached Clean Washroom',
      '24x7 Hot & Cold Water',
      'Power Backup',
      'Daily Housekeeping',
    ],
    description:
      'Ideal for pilgrims looking for an immaculate, budget-friendly room with fast access to Alipiri Footpath and Tirupati Railway Station.',
    highlights: ['Best Budget Value', 'Clean & Hygienic', '24x7 Power & Water'],
    videoUrl: '/videos/budget-room.mp4',
  },
  {
    id: 'standard-room',
    name: 'Standard AC Room',
    category: 'room',
    tagline: 'Relaxing stay with superior air conditioning and plush bedding',
    pricePerNight: 1699,
    originalPrice: 2400,
    guests: 2,
    areaSqFt: 300,
    bedrooms: 1,
    bathrooms: 1,
    image: '/images/rooms/standard-w2.webp',
    gallery: [
      '/images/rooms/standard-w2.webp',
      '/images/rooms/standard-w1.webp',
      '/images/rooms/standard-w3.webp',
      '/images/rooms/standard-w4.webp',
      '/images/rooms/standard-w5.webp',
      '/images/rooms/standard-w6.webp',
      '/images/rooms/standard-w7.webp',
    ],
    amenities: [
      'Quiet Split Air Conditioning',
      'Plush Double Bed',
      'Flat Screen LED TV',
      'Unlimited High-Speed Wi-Fi',
      'Western Style Ensuite Bathroom',
      'Dedicated Room Service',
      '24x7 Security & CCTV',
    ],
    description:
      'Spacious Standard AC Room designed for a restful night before or after your holy darshan at Tirumala.',
    highlights: ['Quiet Air Conditioning', 'High-Speed Internet', 'Prime Air Bypass Road Access'],
    videoUrl: '/videos/standard-room.mp4',
  },
  {
    id: 'deluxe-king-room',
    name: 'Deluxe AC Room',
    category: 'room',
    tagline: 'Refined luxury with lounge seating and superior AC comfort',
    pricePerNight: 2499,
    originalPrice: 3500,
    guests: 3,
    areaSqFt: 420,
    bedrooms: 1,
    bathrooms: 1,
    image: '/images/rooms/deluxe-7.webp',
    gallery: [
      '/images/rooms/deluxe-7.webp',
      '/images/rooms/deluxe-8.webp',
      '/images/rooms/deluxe-9.webp',
      '/images/rooms/deluxe-w1.webp',
      '/images/rooms/deluxe-w2.webp',
    ],
    amenities: [
      'King Size Plush Bed',
      'Powerful Split AC',
      'Hall Area with Comfortable Sofa',
      'Smart LED TV',
      'Spacious Wardrobes & Cupboards',
      'Ensuite Modern Restroom',
      'Direct Support Assistance',
      'Easy Ground Floor Access',
    ],
    description:
      'Experience grand deluxe living featuring a dedicated hall sofa seating area, powerful AC comfort, luxurious bedroom with attached bathroom, custom wardrobes, and sophisticated lighting.',
    highlights: ['Superior AC Suite', 'Separate Lounge Sofa', 'Premium King Bed'],
    isPopular: true,
    videoUrl: '/videos/deluxe-room.mp4',
  },
  {
    id: 'superior-terrace-1bhk',
    name: 'Penthouse Terrace Suite (1BHK)',
    category: 'penthouse',
    tagline: 'Private 1BHK penthouse service apartment with hall, kitchen, scenic terrace & AC',
    pricePerNight: 2799,
    originalPrice: 3800,
    guests: 4,
    areaSqFt: 650,
    bedrooms: 1,
    bathrooms: 1,
    image: '/images/rooms/penthouse-11.webp',
    gallery: [
      '/images/rooms/penthouse-11.webp',
      '/images/rooms/penthouse-12.webp',
      '/images/rooms/penthouse-13.webp',
      '/images/rooms/penthouse-14.webp',
      '/images/rooms/penthouse-w1.webp',
      '/images/rooms/penthouse-w2.webp',
      '/images/rooms/penthouse-w3.webp',
    ],
    amenities: [
      'Full 1BHK Layout (Hall + Kitchen + Bedroom)',
      'Scenic Private Terrace',
      'Air Conditioned Master Bedroom',
      'Spacious Living Room Lounge',
      'Pantry / Kitchenette Area',
      'Attached Modern Washroom',
      'Breathtaking Outer Views & Night Glance',
      'Unlimited High-Speed Wi-Fi',
    ],
    description:
      'Our signature Penthouse Terrace Suite is a private 1BHK service apartment with your own living hall, functional kitchen area, air-conditioned master bedroom, and an open terrace with enchanting views.',
    highlights: ['Private Scenic Terrace', 'Full Living Hall & Kitchen Area', 'Air Conditioned Suite'],
    isPopular: true,
    videoUrl: '/videos/terrace-room.mp4',
  },
  {
    id: 'family-double-2bhk',
    name: '2BHK Family Service Apartment',
    category: 'apartment',
    tagline: 'Air-conditioned 2BHK service apartment with kitchen & living hall for big family and pilgrim groups',
    pricePerNight: 3499,
    originalPrice: 4600,
    guests: 6,
    areaSqFt: 1100,
    bedrooms: 2,
    bathrooms: 2,
    image: '/images/rooms/2bhk-1.webp',
    gallery: [
      '/images/rooms/2bhk-1.webp',
      '/images/rooms/2bhk-2.webp',
      '/images/rooms/2bhk-main.webp',
      '/images/rooms/2bhk-4.webp',
      '/images/rooms/2bhk-5.webp',
      '/images/rooms/2bhk-w1.webp',
    ],
    amenities: [
      'Complete 2BHK Air-Conditioned Residence',
      'Grand Luxury Living Hall & Sofa Bed',
      'Two Independent AC Master Bedrooms',
      'Two Attached Hygienic Bathrooms',
      'Equipped Kitchen / Dining Area',
      'Accommodates up to 6 Guests comfortably',
      'Priority Darshan Assistance Desk',
      '24x7 Support & Room Service',
    ],
    description:
      'The premier choice for families visiting Tirumala together. Our 2BHK family service apartment offers an expansive hall, full kitchen, two master bedrooms with ensuite bathrooms, and extra sofa bedding.',
    highlights: ['Full Kitchen & Living Hall', 'Air-Conditioned 2BHK Suite', 'Spacious up to 6 Guests'],
    isPopular: true,
    videoUrl: '/videos/family-room.mp4',
  },
];
