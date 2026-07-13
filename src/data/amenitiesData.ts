export interface AmenityItem {
  id: string;
  name: string;
  category: 'comfort' | 'pilgrimage' | 'connectivity' | 'safety';
  description: string;
  iconName: string;
  isFeatured?: boolean;
}

export const AMENITIES_DATA: AmenityItem[] = [
  {
    id: 'wifi',
    name: 'Free High-Speed WiFi',
    category: 'connectivity',
    description: '300 Mbps fiber internet throughout every suite, apartment, and terrace area.',
    iconName: 'Wifi',
    isFeatured: true,
  },
  {
    id: 'parking',
    name: 'Private Parking',
    category: 'safety',
    description: 'Spacious 24/7 CCTV-monitored basement & shaded car slots for SUVs and sedans.',
    iconName: 'Car',
    isFeatured: true,
  },
  {
    id: 'lift',
    name: 'Elevator Access',
    category: 'comfort',
    description: 'Smooth elevator access for elders and easy luggage transport across floors.',
    iconName: 'ArrowUpFromLine',
    isFeatured: true,
  },
  {
    id: 'ac',
    name: 'Whisper-Quiet Air Conditioning',
    category: 'comfort',
    description: 'Individual climate control inverter AC units ensuring serene, undisturbed rest.',
    iconName: 'Wind',
    isFeatured: true,
  },
  {
    id: 'lounge',
    name: 'Spacious Living & Lounge Area',
    category: 'comfort',
    description: 'Relaxing family sitting room and lobby lounge designed for comfort after temple darshan.',
    iconName: 'Sparkles',
    isFeatured: true,
  },
  {
    id: 'smart-tv',
    name: '4K Smart UHD TV',
    category: 'connectivity',
    description: '50" to 65" displays with Netflix, Prime Video, and live devotional channels.',
    iconName: 'Tv',
    isFeatured: true,
  },
  {
    id: 'power-backup',
    name: '100% Seamless Power Backup',
    category: 'safety',
    description: 'Heavy-duty silent generators ensuring uninterrupted AC, elevator, and lighting.',
    iconName: 'Zap',
    isFeatured: true,
  },
  {
    id: 'housekeeping',
    name: 'Daily Executive Housekeeping',
    category: 'comfort',
    description: 'Spotless cleaning, organic linen changes, and sanitization every morning.',
    iconName: 'Sparkles',
    isFeatured: true,
  },
  {
    id: 'hot-water',
    name: '24/7 Instant Hot Water',
    category: 'pilgrimage',
    description: 'High-capacity geysers & solar backup for continuous 24/7 hot water supply.',
    iconName: 'Droplets',
    isFeatured: true,
  },
  {
    id: 'reception',
    name: '24-Hour Concierge & Reception',
    category: 'safety',
    description: 'Always staffed to assist with check-ins, local queries, and temple schedules.',
    iconName: 'Clock',
    isFeatured: true,
  },
  {
    id: 'family-friendly',
    name: 'Family & Elder Friendly',
    category: 'comfort',
    description: 'Wheelchair-friendly corridors, peaceful ambience, and elder seating in lobbies.',
    iconName: 'HeartHandshake',
    isFeatured: true,
  },
  {
    id: 'temple-pickup',
    name: 'Tirumala Temple & GUIDE',
    category: 'pilgrimage',
    description: 'Optional private AC sedan/Innova cabs to Alipiri Ghat road or Tirupati Airport.',
    iconName: 'MapPin',
    isFeatured: true,
  },
];
