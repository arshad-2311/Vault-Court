/**
 * VAULT 147 — DATA CATALOG & REPOSITORY
 * Source of truth for games, units, verified tariffs, venue info & gallery
 */

export const VENUE_INFO = {
  name: 'VAULT 147',
  tagline: 'SNOOKER. PS5. THE GAME STARTS HERE.',
  subTagline: 'A premium gaming and snooker experience built for players who want more than just a game.',
  address: {
    line1: '9/1, Mahalingam Street',
    locality: 'Royapuram',
    city: 'Chennai',
    full: '9/1, Mahalingam Street, Royapuram, Chennai'
  },
  contact: {
    phone: '+91 8807500147',
    phoneRaw: '8807500147',
    whatsapp: '8807500147',
    instagram: 'vault.147',
    instagramUrl: 'https://instagram.com/vault.147',
    mapsUrl: 'https://maps.google.com/?q=9/1+Mahalingam+Street+Royapuram+Chennai'
  },
  hours: {
    days: 'Monday – Sunday',
    timing: '10:00 AM – 12:00 AM (Midnight)',
    full: '10:00 AM – 12:00 AM (Daily)'
  }
};

export const PRICING_RULES = {
  snooker: {
    baseRate: 250, // ₹250 per hour
    unit: 'hour'
  },
  ps5: {
    1: 150, // 1 Player: ₹150 / hr
    2: 300, // 2 Players: ₹300 / hr
    3: 400, // 3 Players: ₹400 / hr
    4: 500  // 4 Players: ₹500 / hr
  }
};

export const BOOKING_UNITS = [
  {
    id: 'snooker-01',
    name: 'SNOOKER TABLE 01',
    category: 'snooker',
    categoryLabel: 'Snooker & Billiards',
    image: 'assets/images/snooker-arena-3tables.jpg',
    basePrice: 250,
    priceLabel: '₹250 / HOUR',
    specs: [
      'Tournament Championship Grade Cloth',
      'Precision Warm Overhead Drop Lighting',
      'Full Aramith Tournament Ball Set & Cue Racks',
      'Seating Area for Spectators & Opponents'
    ],
    status: 'AVAILABLE'
  },
  {
    id: 'snooker-02',
    name: 'SNOOKER TABLE 02',
    category: 'snooker',
    categoryLabel: 'Snooker & Billiards',
    image: 'assets/images/snooker-table-cues.jpg',
    basePrice: 250,
    priceLabel: '₹250 / HOUR',
    specs: [
      'Tournament Championship Grade Cloth',
      'Precision Drop Lamps with Anti-Glare Cone',
      'Custom Weighted Cue Sticks & Scoreboards',
      'Private Atmosphere for High-Break Sessions'
    ],
    status: 'AVAILABLE'
  },
  {
    id: 'snooker-03',
    name: 'SNOOKER TABLE 03',
    category: 'snooker',
    categoryLabel: 'Snooker & Billiards',
    image: 'assets/images/snooker-solo-table.jpg',
    basePrice: 250,
    priceLabel: '₹250 / HOUR',
    specs: [
      'Tournament Championship Grade Cloth',
      'Isolated Low-Key Accent Illumination',
      'Full Accessory Suite: Spiders, Rest Sticks, Chalk',
      'Ideal for Focused 1v1 Matches'
    ],
    status: 'AVAILABLE'
  },
  {
    id: 'ps5-01',
    name: 'PS5 COCKPIT STATION 01',
    category: 'ps5',
    categoryLabel: 'PlayStation 5 Console',
    image: 'assets/images/ps5-racing-cockpit.jpg',
    basePrice: 150,
    priceLabel: 'FROM ₹150 / HOUR',
    specs: [
      'PlayStation 5 Disc Edition Console',
      'Logitech G-Series Force Feedback Racing Wheel & Pedals',
      'Gran Turismo 7 & High-Performance Racers',
      '4K HDR Low-Latency Gaming Screen'
    ],
    status: 'AVAILABLE'
  },
  {
    id: 'ps5-02',
    name: 'PS5 DUALSENSE ARENA 02',
    category: 'ps5',
    categoryLabel: 'PlayStation 5 Console',
    image: 'assets/images/ps5-eafc-station.jpg',
    basePrice: 150,
    priceLabel: 'FROM ₹150 / HOUR',
    specs: [
      'PlayStation 5 Console with High-Speed NVMe',
      'EA FC / FIFA, Mortal Kombat, WWE & Action Titles',
      'Up to 4 DualSense Wireless Controllers',
      'Deep Crimson Ambient Backlit Atmosphere'
    ],
    status: 'AVAILABLE'
  },
  {
    id: 'ps5-03',
    name: 'PS5 SQUAD LOUNGE 03',
    category: 'ps5',
    categoryLabel: 'PlayStation 5 Console',
    image: 'assets/images/ps5-lounge-beanbags.jpg',
    basePrice: 150,
    priceLabel: 'FROM ₹150 / HOUR',
    specs: [
      'PlayStation 5 Multi-Player Setup',
      'Plush Ergonomic Red & Black Beanbag Lounge',
      'Full Digital Library of Multiplayer Games',
      'Built for Squad Battles & Weekend Tournaments'
    ],
    status: 'AVAILABLE'
  }
];

export const TIME_SLOTS = [
  '10:30 AM',
  '12:00 PM',
  '01:30 PM',
  '03:00 PM',
  '04:30 PM',
  '06:00 PM',
  '07:30 PM',
  '09:00 PM',
  '10:30 PM'
];

export const GALLERY_CATALOG = [
  {
    id: 'g-01',
    title: '3-TABLE TOURNAMENT ARENA',
    category: 'snooker',
    categoryLabel: 'SNOOKER',
    image: 'assets/images/snooker-arena-3tables.jpg',
    spanClass: 'span-2-row'
  },
  {
    id: 'g-02',
    title: 'GRAN TURISMO RACING COCKPIT',
    category: 'ps5',
    categoryLabel: 'PS5 GAMING',
    image: 'assets/images/ps5-racing-cockpit.jpg',
    spanClass: ''
  },
  {
    id: 'g-03',
    title: 'CRIMSON BALL RACK CLOSING IN',
    category: 'snooker',
    categoryLabel: 'SNOOKER',
    image: 'assets/images/snooker-balls-racked.jpg',
    spanClass: ''
  },
  {
    id: 'g-04',
    title: 'CHAMPIONSHIP CUE ARRANGEMENT',
    category: 'snooker',
    categoryLabel: 'SNOOKER',
    image: 'assets/images/snooker-table-cues.jpg',
    spanClass: ''
  },
  {
    id: 'g-05',
    title: 'SQUAD LOUNGE & BEANBAG SUITE',
    category: 'the-lounge',
    categoryLabel: 'THE LOUNGE',
    image: 'assets/images/ps5-lounge-beanbags.jpg',
    spanClass: 'span-2-col'
  },
  {
    id: 'g-06',
    title: 'SOLO ILLUMINATED MATCH TABLE',
    category: 'snooker',
    categoryLabel: 'SNOOKER',
    image: 'assets/images/snooker-solo-table.jpg',
    spanClass: ''
  },
  {
    id: 'g-07',
    title: 'EA FC HIGH-INTENSITY SHOWDOWN',
    category: 'ps5',
    categoryLabel: 'PS5 GAMING',
    image: 'assets/images/ps5-eafc-station.jpg',
    spanClass: ''
  },
  {
    id: 'g-08',
    title: 'PANORAMIC ARENA PERSPECTIVE',
    category: 'the-lounge',
    categoryLabel: 'THE LOUNGE',
    image: 'assets/images/vault147-panorama-lounge.webp',
    spanClass: 'span-2-row'
  },
  {
    id: 'g-09',
    title: 'OFFICIAL VAULT 147 FLYER & LOCATION',
    category: 'the-lounge',
    categoryLabel: 'THE LOUNGE',
    image: 'assets/images/vault147-flyer.jpg',
    spanClass: ''
  }
];
