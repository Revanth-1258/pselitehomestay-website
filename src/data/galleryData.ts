export interface GalleryPhoto {
  id: string;
  title: string;
  category: '1BHK Superior Suite' | '2BHK Family Suite' | 'Deluxe & Standard Rooms';
  imageUrl: string;
  aspectRatio: 'tall' | 'wide' | 'square';
  description: string;
}

export const GALLERY_CATEGORIES = [
  'All',
  '1BHK Superior Suite',
  '2BHK Family Suite',
  'Deluxe & Standard Rooms',
] as const;

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // 1BHK Superior Suite (Penthouse)
  {
    id: 'gal-sup-1',
    title: 'Superior 1BHK Living Room',
    category: '1BHK Superior Suite',
    imageUrl: '/images/rooms/penthouse-11.webp',
    aspectRatio: 'wide',
    description: 'Spacious air-conditioned living hall inside the 1BHK Superior Terrace Suite.',
  },
  {
    id: 'gal-sup-2',
    title: 'Superior 1BHK AC Bedroom',
    category: '1BHK Superior Suite',
    imageUrl: '/images/rooms/penthouse-12.webp',
    aspectRatio: 'tall',
    description: 'Master bedroom with plush bed and premium furnishings.',
  },
  {
    id: 'gal-sup-3',
    title: 'Superior Suite Dining Area',
    category: '1BHK Superior Suite',
    imageUrl: '/images/rooms/penthouse-13.webp',
    aspectRatio: 'wide',
    description: 'Elegant dining area for families and couples.',
  },
  {
    id: 'gal-sup-4',
    title: 'Penthouse Outer Balcony View',
    category: '1BHK Superior Suite',
    imageUrl: '/images/rooms/penthouse-14.webp',
    aspectRatio: 'square',
    description: 'Private balcony view overlooking the peaceful environment.',
  },
  {
    id: 'gal-sup-5',
    title: 'Cozy Penthouse Lounge Bed',
    category: '1BHK Superior Suite',
    imageUrl: '/images/rooms/penthouse-w1.webp',
    aspectRatio: 'wide',
    description: 'Secondary lounge and bedding layout in the penthouse apartment.',
  },
  {
    id: 'gal-sup-6',
    title: 'Penthouse Bedroom Glare',
    category: '1BHK Superior Suite',
    imageUrl: '/images/rooms/penthouse-w2.webp',
    aspectRatio: 'tall',
    description: 'Relaxing bedroom setup under warm lighting.',
  },

  // 2BHK Family Suite (2BHK)
  {
    id: 'gal-fam-1',
    title: '2BHK Grand Living Lounge',
    category: '2BHK Family Suite',
    imageUrl: '/images/rooms/2bhk-main.webp',
    aspectRatio: 'wide',
    description: 'Expansive family lounge for pilgrim groups up to 8 guests.',
  },
  {
    id: 'gal-fam-2',
    title: '2BHK Bedroom 1',
    category: '2BHK Family Suite',
    imageUrl: '/images/rooms/2bhk-1.webp',
    aspectRatio: 'tall',
    description: 'Spacious master bedroom with attached washroom.',
  },
  {
    id: 'gal-fam-3',
    title: '2BHK Bedroom 2 Layout',
    category: '2BHK Family Suite',
    imageUrl: '/images/rooms/2bhk-2.webp',
    aspectRatio: 'wide',
    description: 'Second private bedroom designed for relaxing family stays.',
  },
  {
    id: 'gal-fam-4',
    title: '2BHK Kitchen & Pantry Area',
    category: '2BHK Family Suite',
    imageUrl: '/images/rooms/2bhk-3.webp',
    aspectRatio: 'square',
    description: 'Fully functional kitchen inside the 2BHK Family Homestay suite.',
  },
  {
    id: 'gal-fam-5',
    title: '2BHK Living Room Seating',
    category: '2BHK Family Suite',
    imageUrl: '/images/rooms/2bhk-4.webp',
    aspectRatio: 'wide',
    description: 'Additional luxury sofa arrangements inside the family suite.',
  },
  {
    id: 'gal-fam-6',
    title: '2BHK Dining Corridor',
    category: '2BHK Family Suite',
    imageUrl: '/images/rooms/2bhk-5.webp',
    aspectRatio: 'tall',
    description: 'Hygienic and clean dining transition hallway.',
  },

  // Deluxe & Standard Rooms
  {
    id: 'gal-dlx-1',
    title: 'Deluxe King AC Suite',
    category: 'Deluxe & Standard Rooms',
    imageUrl: '/images/rooms/deluxe-7.webp',
    aspectRatio: 'wide',
    description: 'Grand Deluxe room featuring king bed and custom furnishings.',
  },
  {
    id: 'gal-dlx-2',
    title: 'Deluxe Room Wardrobe Side',
    category: 'Deluxe & Standard Rooms',
    imageUrl: '/images/rooms/deluxe-8.webp',
    aspectRatio: 'tall',
    description: 'Wardrobe and vanity setup inside Deluxe King AC Room.',
  },
  {
    id: 'gal-dlx-3',
    title: 'Deluxe Suite Ambient Look',
    category: 'Deluxe & Standard Rooms',
    imageUrl: '/images/rooms/deluxe-9.webp',
    aspectRatio: 'wide',
    description: 'Bright and airy deluxe suite with premium amenities.',
  },
  {
    id: 'gal-std-1',
    title: 'Standard AC Room Bedding',
    category: 'Deluxe & Standard Rooms',
    imageUrl: '/images/rooms/standard-w1.webp',
    aspectRatio: 'wide',
    description: 'Comfortable standard room with immaculate bedding and high-speed Wi-Fi.',
  },
  {
    id: 'gal-std-2',
    title: 'Standard AC Room TV Lounge',
    category: 'Deluxe & Standard Rooms',
    imageUrl: '/images/rooms/standard-w2.webp',
    aspectRatio: 'tall',
    description: 'TV lounge wall inside the Standard AC Room.',
  },
  {
    id: 'gal-bdg-1',
    title: 'Budget Pilgrim Stay',
    category: 'Deluxe & Standard Rooms',
    imageUrl: '/images/rooms/budget-w1.webp',
    aspectRatio: 'square',
    description: 'Clean, value-centric stay option for budget pilgrims.',
  },
];
