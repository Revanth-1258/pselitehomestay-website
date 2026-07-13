export interface GalleryPhoto {
  id: string;
  title: string;
  category: '1BHK Superior Suite' | '2BHK Family Suite' | 'Deluxe & Standard Rooms' | 'Tirupati & Scenic Views';
  imageUrl: string;
  aspectRatio: 'tall' | 'wide' | 'square';
  description: string;
}

export const GALLERY_CATEGORIES = [
  'All',
  '1BHK Superior Suite',
  '2BHK Family Suite',
  'Deluxe & Standard Rooms',
  'Tirupati & Scenic Views',
] as const;

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  // 1BHK Superior Suite
  {
    id: 'gal-sup-1',
    title: 'Superior 1BHK Living Hall',
    category: '1BHK Superior Suite',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/vZlYmvj5y8tFvQGv',
    aspectRatio: 'wide',
    description: 'Spacious air-conditioned living hall inside the 1BHK Superior Terrace Suite.',
  },
  {
    id: 'gal-sup-2',
    title: 'Superior 1BHK AC Bedroom',
    category: '1BHK Superior Suite',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/yvZQjKmn55r9uBWQ',
    aspectRatio: 'tall',
    description: 'Master bedroom with plush bed and attached hygienic washroom.',
  },
  {
    id: 'gal-sup-3',
    title: 'Superior Terrace Outer View',
    category: '1BHK Superior Suite',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/s7AZxPxOo3FcmvUY',
    aspectRatio: 'wide',
    description: 'Private terrace exterior overlooking peaceful Tirupati surroundings.',
  },
  {
    id: 'gal-sup-4',
    title: '1BHK Kitchenette & Pantry',
    category: '1BHK Superior Suite',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/FCUDGzhdE3pwIIsH',
    aspectRatio: 'square',
    description: 'Dedicated kitchen area inside the Superior 1BHK apartment.',
  },
  {
    id: 'gal-sup-5',
    title: 'Cozy Private Terrace Lounge',
    category: '1BHK Superior Suite',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/0Tn5GXH0ylMKHs6u',
    aspectRatio: 'wide',
    description: 'Serene terrace seating area for morning tea and evening breezes.',
  },
  {
    id: 'gal-sup-6',
    title: 'Superior Suite Night Glance',
    category: '1BHK Superior Suite',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/X3lLj6QKrUKzVLN7',
    aspectRatio: 'tall',
    description: 'Evening lighting view of the private 1BHK Superior Terrace stay.',
  },

  // 2BHK Family Suite
  {
    id: 'gal-fam-1',
    title: '2BHK Grand Family Hall',
    category: '2BHK Family Suite',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/Zt65cNerSD1Bd4Yr',
    aspectRatio: 'wide',
    description: 'Expansive family lounge for pilgrim groups up to 8 guests.',
  },
  {
    id: 'gal-fam-2',
    title: 'Family Suite AC Bedroom 1',
    category: '2BHK Family Suite',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/N0KQmuiSKK5Lzy6H',
    aspectRatio: 'tall',
    description: 'Spacious master bedroom with attached washroom.',
  },
  {
    id: 'gal-fam-3',
    title: 'Family Suite AC Bedroom 2',
    category: '2BHK Family Suite',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/ojJhJ7Gaal70xP2u',
    aspectRatio: 'wide',
    description: 'Second private bedroom designed for relaxing family stays.',
  },
  {
    id: 'gal-fam-4',
    title: 'Family Suite Kitchen & Dining',
    category: '2BHK Family Suite',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/TYUn49le0fIQQ9OQ',
    aspectRatio: 'square',
    description: 'Fully equipped kitchen inside the 2BHK Family Homestay suite.',
  },
  {
    id: 'gal-fam-5',
    title: 'Family Suite Sofa Bed Setup',
    category: '2BHK Family Suite',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/9ZAKtCSZr29KzhS3',
    aspectRatio: 'wide',
    description: 'Additional sofa bed arrangement for extra guests.',
  },
  {
    id: 'gal-fam-6',
    title: 'Luxury Residence Hall',
    category: '2BHK Family Suite',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/6dNsNboQCT9IyPR6',
    aspectRatio: 'tall',
    description: 'Sophisticated interior hall design with premium air-conditioning.',
  },

  // Deluxe & Standard Rooms
  {
    id: 'gal-dlx-1',
    title: 'Deluxe King AC Room',
    category: 'Deluxe & Standard Rooms',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/uYmPqpRZ5GPsIihb',
    aspectRatio: 'wide',
    description: 'Grand Deluxe room featuring king bed and custom furnishings.',
  },
  {
    id: 'gal-dlx-2',
    title: 'Deluxe Room Hall & Sofa',
    category: 'Deluxe & Standard Rooms',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/JtdAjsMyOIGMDcuk',
    aspectRatio: 'tall',
    description: 'Private sofa seating lounge inside Deluxe King AC Room.',
  },
  {
    id: 'gal-std-1',
    title: 'Standard AC / Non-AC Room',
    category: 'Deluxe & Standard Rooms',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/EkaCFEEfQsKmxRhn',
    aspectRatio: 'wide',
    description: 'Comfortable standard room with immaculate bedding and high-speed Wi-Fi.',
  },
  {
    id: 'gal-bdg-1',
    title: 'Budget Pilgrim Room',
    category: 'Deluxe & Standard Rooms',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/oRLOT4ZmUeK5k07n',
    aspectRatio: 'square',
    description: 'Clean, value-centric stay option for budget pilgrims.',
  },

  // Tirupati & Scenic Views
  {
    id: 'gal-view-1',
    title: 'Tirupati Hills View 1',
    category: 'Tirupati & Scenic Views',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/wp6bJRaoBf92FZgA',
    aspectRatio: 'wide',
    description: 'Panoramic view of Tirupati hills surrounding our homestay.',
  },
  {
    id: 'gal-view-2',
    title: 'Tirupati Hills View 2',
    category: 'Tirupati & Scenic Views',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/PNdPjmCXtEwJYT0j',
    aspectRatio: 'tall',
    description: 'Scenic vistas from near PS Elite Homestay, Tirupati.',
  },
  {
    id: 'gal-view-3',
    title: 'Tirupati Hills View 3',
    category: 'Tirupati & Scenic Views',
    imageUrl: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/v6GAclHJO38Kz7JC',
    aspectRatio: 'wide',
    description: 'Serene morning light over Tirupati pilgrimage pathways.',
  },
];
