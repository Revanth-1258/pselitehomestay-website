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
  /** Hand-written <title> (max 60 chars) and meta description (max 160 chars). */
  seoTitle?: string;
  seoDescription?: string;
}

export const NEARBY_ATTRACTIONS: NearbyAttraction[] = [
  {
    id: 'tirumala-temple',
    seoTitle: 'Stay in Tirupati for Tirumala Darshan (24 km) | PS Elite',
    seoDescription:
      'Base your Tirumala darshan in Tirupati: AC rooms & family apartments 24 km from the temple, with early-morning cab help, lift & parking. Rated 4.8 on Google.',
    name: 'Tirumala Sri Venkateswara Swamy Temple',
    type: 'temple',
    distanceKm: '24 km (via Ghat Road)',
    travelTimeMin: '38 mins by Car',
    description:
      'The holiest shrine of Lord Sri Venkateswara atop the sacred Seshachalam hills. PS Elite is located minutes from Alipiri Checkpost for quick ascent.',
    bestTime: 'Early Morning / VIP Break Darshan',
    mapCoords: { lat: 13.6833, lng: 79.3472 },
    badge: 'Primary Sacred Shrine',
  },
  {
    id: 'alipiri-footpath',
    seoTitle: 'Homestay Near Alipiri Footpath, Tirupati (6 km) | PS Elite',
    seoDescription:
      'Rooms 6 km from the Alipiri footpath to Tirumala. Our desk arranges early-morning autos (3:30–5 AM) for the climb. Family rooms, lift & parking. Book direct.',
    name: 'Alipiri Metlu (Sacred Footpath Entry)',
    type: 'temple',
    distanceKm: '6 km',
    travelTimeMin: '8 mins by Car / Taxi',
    description:
      'The starting point of the historic 3,550-step walking pilgrimage to Tirumala. Ideal starting location for pilgrims undertaking the holy climb.',
    bestTime: '4:00 AM - 6:00 AM',
    mapCoords: { lat: 13.6548, lng: 79.4011 },
    badge: 'Pilgrim Footpath Gateway',
  },
  {
    id: 'padmavathi-temple',
    seoTitle: 'Homestay Near Padmavathi Temple, Tiruchanur | PS Elite',
    seoDescription:
      'Stay 3.5 km from Sri Padmavathi Ammavari Temple, Tiruchanur. AC rooms & family apartments with lift, parking and a 24/7 desk. Rated 4.8 on Google.',
    name: 'Sri Padmavathi Ammavaru Temple, Tiruchanoor',
    type: 'temple',
    distanceKm: '3.5 km',
    travelTimeMin: '10 mins by Car',
    description:
      'Dedicated to Goddess Padmavathi, consort of Lord Venkateswara. Traditional pilgrimage practice recommends visiting Goddess Padmavathi prior to or after Tirumala.',
    bestTime: 'Morning or Golden Hour Evening',
    mapCoords: { lat: 13.6063, lng: 79.4447 },
    badge: 'Must-Visit Sacred Shrine',
  },
  {
    id: 'kapila-theertham',
    seoTitle: 'Rooms Near Kapila Theertham, Tirupati (4.4 km) | PS Elite',
    seoDescription:
      'Stay 4.4 km from Kapila Theertham temple & waterfall. AC rooms & family service apartments with lift, parking and a 24/7 desk. Rated 4.8 on Google.',
    name: 'Kapila Theertham Temple & Waterfall',
    type: 'temple',
    distanceKm: '4.4 km',
    travelTimeMin: '7 mins by Car',
    description:
      'Ancient Shaivite shrine located at the foot of Tirumala hills featuring a dramatic mountain waterfall cascading into a sacred temple tank.',
    bestTime: 'Monsoon & Morning Hours',
    mapCoords: { lat: 13.6515, lng: 79.4128 },
    badge: 'Scenic Mountain Waterfall',
  },
  {
    id: 'govindaraja-swamy',
    seoTitle: 'Homestay Near Govindaraja Swamy Temple (1.3 km) | PS Elite',
    seoDescription:
      'Just 1.3 km from Sri Govindaraja Swamy Temple in Tirupati town. AC rooms & family apartments with lift, parking and a 24/7 desk. Rated 4.8 on Google.',
    name: 'Sri Govindaraja Swamy Temple',
    type: 'temple',
    distanceKm: '1.3 km',
    travelTimeMin: '5 mins by Car / Auto',
    description:
      'One of the largest and oldest temples in Tirupati with towering Dravidian gopurams and exquisite Chola-era architecture.',
    bestTime: 'Early Morning / Evening Aarati',
    mapCoords: { lat: 13.6288, lng: 79.4192 },
    badge: 'Historic Heritage Temple',
  },
  {
    id: 'iskcon-tirupati',
    seoTitle: 'Homestay Near ISKCON Tirupati (4.3 km) | PS Elite',
    seoDescription:
      'Stay 4.3 km from ISKCON Tirupati. AC rooms & 1BHK/2BHK service apartments with lift, parking and a 24/7 desk. Rated 4.8 on Google. Book direct.',
    name: 'ISKCON Radha Govinda Mandir',
    type: 'temple',
    distanceKm: '4.3 km',
    travelTimeMin: '10 mins by Car',
    description:
      'Serene white-marble temple surrounded by gardens, known for melodious kirtan, Vedic literature, and spiritual tranquility.',
    bestTime: 'Evening Sandhya Aarti',
    mapCoords: { lat: 13.6456, lng: 79.4121 },
    badge: 'Spiritual Sanctuary',
  },
  {
    id: 'tirupati-airport',
    seoTitle: 'Stay Near Tirupati Airport, Renigunta (16 km) | PS Elite',
    seoDescription:
      'Flying into Tirupati (Renigunta)? Stay 16 km from the airport in AC rooms or family apartments with parking and a 24/7 desk. Rated 4.8 on Google.',
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
    seoTitle: 'Homestay Near Tirupati Railway Station (1.5 km) | PS Elite',
    seoDescription:
      'AC rooms & 2BHK family apartments 1.5 km from Tirupati railway station, about 5 mins by auto. 24/7 desk, lift & parking. Rated 4.8 on Google. Book direct.',
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
    seoTitle: 'Homestay Near Tirupati Bus Stand (1.4 km) | PS Elite',
    seoDescription:
      'Rooms & family apartments 1.4 km from the Tirupati APSRTC central bus stand, about 5 mins by auto. 24/7 desk, lift & parking. Rated 4.8 on Google. Book direct.',
    name: 'Tirupati Main Bus Stand (APSRTC Hub)',
    type: 'transport',
    distanceKm: '1.4 km',
    travelTimeMin: '5 mins by Car / Auto',
    description:
      'Central APSRTC Bus Station serving interstate and regional pilgrim buses, located just 1.4 km away.',
    bestTime: '24/7 Access',
    mapCoords: { lat: 13.6305, lng: 79.4215 },
    badge: 'Central Bus Station',
  },
  {
    id: 'sv-zoo',
    seoTitle: 'Stay Near SV Zoo Park, Tirupati | PS Elite',
    seoDescription:
      'Visiting Sri Venkateswara Zoological Park? Stay in Tirupati in AC rooms or family service apartments with parking and a 24/7 desk. Rated 4.8 on Google.',
    name: 'Sri Venkateswara Zoological Park',
    type: 'nature',
    distanceKm: '9 km',
    travelTimeMin: '18 mins by Car / Auto',
    description:
      'One of the largest zoological parks in Asia, themed on mythological concepts and surrounded by scenic Eastern Ghats hills.',
    bestTime: 'Morning 9:00 AM - 1:00 PM',
    mapCoords: { lat: 13.6128, lng: 79.3512 },
    badge: 'Nature & Wildlife',
  },
  {
    id: 'chandragiri-fort',
    seoTitle: 'Stay Near Chandragiri Fort, Tirupati (17.5 km) | PS Elite',
    seoDescription:
      'Stay in Tirupati, 17.5 km from Chandragiri Fort & Raja Mahal. AC rooms & family apartments with parking and a 24/7 desk. Rated 4.8 on Google.',
    name: 'Chandragiri Fort & Raja Mahal Palace',
    type: 'temple',
    distanceKm: '17.5 km',
    travelTimeMin: '25 mins by Car',
    description:
      'Historical 11th-century fort palace of the Vijayanagara Empire with royal sound and light shows, manicured gardens, and ancient architecture.',
    bestTime: 'Afternoon to Evening Sound & Light Show',
    mapCoords: { lat: 13.5829, lng: 79.3175 },
    badge: 'Heritage Monument',
  },
  {
    id: 'srikalahasthi-temple',
    seoTitle: 'Tirupati Stay for Srikalahasti Temple Trip | PS Elite',
    seoDescription:
      'Combine Tirumala & Srikalahasti (38 km): stay in Tirupati in AC rooms or family apartments with parking and a 24/7 desk. Rated 4.8 on Google.',
    name: 'Srikalahasthi Shiva Temple (Rahu Ketu Kshetra)',
    type: 'temple',
    distanceKm: '38 km',
    travelTimeMin: '45 mins via Highway',
    description:
      'Renowned ancient Pancha Bhoota Sthalam representing the element Air (Vayu Linga), famous worldwide for Rahu-Ketu Sarpa Dosha Nivarana poojas.',
    bestTime: 'Rahu Kalam Poojas / Early Morning',
    mapCoords: { lat: 13.7498, lng: 79.6984 },
    badge: 'Vayu Linga Kshetram',
  },
];
