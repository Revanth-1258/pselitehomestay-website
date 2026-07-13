export interface ReviewItem {
  id: string;
  name: string;
  origin: string;
  stayDate: string;
  roomBooked: string;
  rating: number;
  comment: string;
  avatarUrl: string;
  verified: boolean;
  pilgrimType: string;
}

export const REVIEWS_DATA: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Dr. Rajeshwar Rao & Family',
    origin: 'Hyderabad, Telangana',
    stayDate: 'July 2026',
    roomBooked: 'Family Double Room (2BHK — AC / Non-AC)',
    rating: 5,
    comment:
      'We stayed at PS Elite Homestay for our family Tirumala darshan. The 2BHK apartment was immaculate—spacious, peaceful, and truly felt like a luxury home. Having our own clean kitchen to prepare early morning tea before our 4 AM Alipiri climb was a blessing!',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Rajeshwar+Rao&backgroundColor=B8860B&textColor=000000',
    verified: true,
    pilgrimType: 'Family Pilgrim Group (8 Guests)',
  },
  {
    id: 'rev-2',
    name: 'Ananya & Karthik Sundaram',
    origin: 'San Jose, CA (NRI Visitors)',
    stayDate: 'June 2026',
    roomBooked: 'Terrace Room (AC / Non-AC)',
    rating: 5,
    comment:
      'The Terrace Room (1BHK) at PS Elite exceeded every expectation. The private terrace view of the hills at dawn is breathtaking. Pristine bathrooms, super fast Wi-Fi, and the management arranged our temple drop flawlessly.',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ananya+Sundaram&backgroundColor=D4AF37&textColor=000000',
    verified: true,
    pilgrimType: 'NRI Couple on Temple Visit',
  },
  {
    id: 'rev-3',
    name: 'Suresh V. Kulkarni',
    origin: 'Bengaluru, Karnataka',
    stayDate: 'July 2026',
    roomBooked: 'Deluxe King Room (AC / Non-AC)',
    rating: 5,
    comment:
      'Remarkable hospitality! Fast digital check-in, spotless linen, and whisper-quiet air conditioning. Just minutes from Alipiri checkpost and Air Bypass Road. Best luxury homestay in Tirupati without overcrowded hotel chaos.',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Suresh+Kulkarni&backgroundColor=B8860B&textColor=000000',
    verified: true,
    pilgrimType: 'Senior Executive Pilgrim',
  },
  {
    id: 'rev-4',
    name: 'Meenakshi & Venkataraman Family',
    origin: 'Chennai, Tamil Nadu',
    stayDate: 'June 2026',
    roomBooked: 'Standard Room (AC / Non-AC)',
    rating: 5,
    comment:
      'Traveling with elderly parents required an elevator-accessible, clean luxury room. PS Elite provided elder-friendly seating, instant hot water at 3:00 AM, and utmost hygiene. 10/10 recommendation!',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Meenakshi+V&backgroundColor=D4AF37&textColor=000000',
    verified: true,
    pilgrimType: 'Multi-Generation Family',
  },
  {
    id: 'rev-5',
    name: 'Praveen Kumar Reddy',
    origin: 'Vijayawada, Andhra Pradesh',
    stayDate: 'July 2026',
    roomBooked: 'Budget Room',
    rating: 5,
    comment:
      'At ₹1,000/night, the Budget Room at PS Elite offers 5-star hygiene and comfort. Super clean washroom, 24x7 hot water, covered parking, and divine ambience. Highly recommended!',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Praveen+Reddy&backgroundColor=B8860B&textColor=000000',
    verified: true,
    pilgrimType: 'Solo Devotional Pilgrim',
  },
  {
    id: 'rev-6',
    name: 'Lakshmi & Srinivasa Murthy',
    origin: 'Visakhapatnam, Andhra Pradesh',
    stayDate: 'July 2026',
    roomBooked: 'Family Double Room (2BHK - AC)',
    rating: 5,
    comment:
      'Escape the commercial hotel environment! PS Elite gave our entire family private bedrooms, a huge living hall, and peaceful surroundings right near STV Nagar. We will stay here every time we visit Lord Venkateswara.',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Lakshmi+Murthy&backgroundColor=D4AF37&textColor=000000',
    verified: true,
    pilgrimType: 'Extended Family Group',
  },
];
