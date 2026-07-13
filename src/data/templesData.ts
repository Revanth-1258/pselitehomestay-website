export interface NearbyAttraction {
  id: string;
  name: string;
  type: 'temple' | 'transport' | 'nature';
  distanceKm: string;
  travelTimeMin: string;
  description: string;
  bestTime: string;
  mapCoords: { lat: number; lng: number };
  badge: string;
}

export const NEARBY_ATTRACTIONS: NearbyAttraction[] = [
  {
    id: 'tirumala-temple',
    name: 'Tirumala Sri Venkateswara Swamy Temple',
    type: 'temple',
    distanceKm: '22 km (via Ghat Road)',
    travelTimeMin: '38 mins by Car',
    description:
      'The holiest shrine of Lord Sri Venkateswara atop the sacred Seshachalam hills. PS Elite is located minutes from Alipiri Checkpost for quick ascent.',
    bestTime: 'Early Morning / VIP Break Darshan',
    mapCoords: { lat: 13.6833, lng: 79.3472 },
    badge: 'Primary Sacred Shrine',
  },
  {
    id: 'alipiri-footpath',
    name: 'Alipiri Metlu (Sacred Footpath Entry)',
    type: 'temple',
    distanceKm: '3.5 km',
    travelTimeMin: '8 mins by Car / Taxi',
    description:
      'The starting point of the historic 3,550-step walking pilgrimage to Tirumala. Ideal starting location for pilgrims undertaking the holy climb.',
    bestTime: '4:00 AM - 6:00 AM',
    mapCoords: { lat: 13.6548, lng: 79.4011 },
    badge: 'Pilgrim Footpath Gateway',
  },
  {
    id: 'padmavathi-temple',
    name: 'Sri Padmavathi Ammavaru Temple, Tiruchanoor',
    type: 'temple',
    distanceKm: '4 km',
    travelTimeMin: '10 mins by Car',
    description:
      'Dedicated to Goddess Padmavathi, consort of Lord Venkateswara. Traditional pilgrimage practice recommends visiting Goddess Padmavathi prior to or after Tirumala.',
    bestTime: 'Morning or Golden Hour Evening',
    mapCoords: { lat: 13.6063, lng: 79.4447 },
    badge: 'Must-Visit Sacred Shrine',
  },
  {
    id: 'kapila-theertham',
    name: 'Kapila Theertham Temple & Waterfall',
    type: 'temple',
    distanceKm: '2.8 km',
    travelTimeMin: '7 mins by Car',
    description:
      'Ancient Shaivite shrine located at the foot of Tirumala hills featuring a dramatic mountain waterfall cascading into a sacred temple tank.',
    bestTime: 'Monsoon & Morning Hours',
    mapCoords: { lat: 13.6515, lng: 79.4128 },
    badge: 'Scenic Mountain Waterfall',
  },
  {
    id: 'govindaraja-swamy',
    name: 'Sri Govindaraja Swamy Temple',
    type: 'temple',
    distanceKm: '4.0 km',
    travelTimeMin: '10 mins by Car',
    description:
      'One of the largest and oldest temples in Tirupati with towering Dravidian gopurams and exquisite Chola-era architecture.',
    bestTime: 'Early Morning / Evening Aarati',
    mapCoords: { lat: 13.6288, lng: 79.4192 },
    badge: 'Historic Heritage Temple',
  },
  {
    id: 'iskcon-tirupati',
    name: 'ISKCON Radha Govinda Mandir',
    type: 'temple',
    distanceKm: '3.1 km',
    travelTimeMin: '8 mins by Car',
    description:
      'Serene white-marble temple surrounded by gardens, known for melodious kirtan, Vedic literature, and spiritual tranquility.',
    bestTime: 'Evening Sandhya Aarti',
    mapCoords: { lat: 13.6456, lng: 79.4121 },
    badge: 'Spiritual Sanctuary',
  },
  {
    id: 'tirupati-airport',
    name: 'Tirupati International Airport (Renigunta)',
    type: 'transport',
    distanceKm: '16 km',
    travelTimeMin: '25 mins via Highway',
    description:
      'Well-connected airport serving flights from Hyderabad, Bengaluru, Delhi, Chennai, and Mumbai. Chauffeur pickup available.',
    bestTime: '24/7 Connectivity',
    mapCoords: { lat: 13.6325, lng: 79.5433 },
    badge: 'Airport Terminal',
  },
  {
    id: 'railway-station',
    name: 'Tirupati Main Railway Station',
    type: 'transport',
    distanceKm: '1.5 km',
    travelTimeMin: '5 mins by Car / Auto',
    description:
      'Major railway junction with direct Vande Bharat and superfast connections just 1.5 km away from PS Elite Homestay.',
    bestTime: '24/7 Access',
    mapCoords: { lat: 13.6291, lng: 79.4198 },
    badge: 'Railway Hub',
  },
  {
    id: 'bus-stand',
    name: 'Tirupati Main Bus Stand (APSRTC Hub)',
    type: 'transport',
    distanceKm: '1.0 km',
    travelTimeMin: '3 mins by Car / Auto',
    description:
      'Central APSRTC Bus Station serving interstate and regional pilgrim buses, located just 1.0 km away.',
    bestTime: '24/7 Access',
    mapCoords: { lat: 13.6305, lng: 79.4215 },
    badge: 'Central Bus Station',
  },
];
