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
    image: '/images/rooms/budget-room.jpg',
    gallery: [
      '/images/rooms/budget-room.jpg',
      '/images/rooms/gallery-1.jpg',
      '/images/rooms/gallery-7.jpg',
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
    pricePerNight: 1800,
    originalPrice: 2400,
    guests: 2,
    areaSqFt: 300,
    bedrooms: 1,
    bathrooms: 1,
    image: '/images/rooms/standard-room.jpg',
    gallery: [
      '/images/rooms/standard-room.jpg',
      '/images/rooms/gallery-2.jpg',
      '/images/rooms/gallery-6.jpg',
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
    pricePerNight: 2500,
    originalPrice: 3500,
    guests: 3,
    areaSqFt: 420,
    bedrooms: 1,
    bathrooms: 1,
    image: '/images/rooms/deluxe-room.jpg',
    gallery: [
      '/images/rooms/deluxe-room.jpg',
      '/images/rooms/gallery-3.jpg',
      '/images/rooms/gallery-8.jpg',
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
    name: 'Terrace AC Room',
    category: 'apartment',
    tagline: 'Private 1BHK Apartment suite with Hall, Kitchen, Scenic Terrace & AC comfort',
    pricePerNight: 2800,
    originalPrice: 3800,
    guests: 4,
    areaSqFt: 650,
    bedrooms: 1,
    bathrooms: 1,
    image: '/images/rooms/terrace-room.jpg',
    gallery: [
      '/images/rooms/terrace-room.jpg',
      '/images/rooms/gallery-4.jpg',
      '/images/rooms/gallery-1.jpg',
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
      'Our signature Terrace AC Room offers the ultimate private homestay experience. Enjoy your own living hall, functional kitchen area, air-conditioned master bedroom, and an open terrace with enchanting views.',
    highlights: ['Private Scenic Terrace', 'Full Living Hall & Kitchen Area', 'Air Conditioned Suite'],
    isPopular: true,
    videoUrl: '/videos/terrace-room.mp4',
  },
  {
    id: 'family-double-2bhk',
    name: 'Family AC Room',
    category: 'apartment',
    tagline: 'Expansive 2BHK Air-Conditioned Homestay Suite designed for big family pilgrimage groups',
    pricePerNight: 3500,
    originalPrice: 4600,
    guests: 6,
    areaSqFt: 1100,
    bedrooms: 2,
    bathrooms: 2,
    image: '/images/rooms/family-room.jpg',
    gallery: [
      '/images/rooms/family-room.jpg',
      '/images/rooms/gallery-5.jpg',
      '/images/rooms/gallery-6.jpg',
      '/images/rooms/gallery-2.jpg',
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
      'The premier choice for families visiting Tirumala together at ₹4,000/night. Our 2BHK Family AC Suite offers an expansive hall, full kitchen, two master bedrooms with ensuite bathrooms, and extra sofa bedding.',
    highlights: ['₹4,000 / Night Value', 'Air-Conditioned 2BHK Suite', 'Spacious up to 6 Guests'],
    isPopular: true,
    videoUrl: '/videos/family-room.mp4',
  },
];
