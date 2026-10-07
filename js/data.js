/**
 * VAULT 147 — ARENA DATA REPOSITORY & ASSET CATALOG (AUTHENTIC & VERIFIED)
 * Official Rates, Dynamic Duration Rules, 1-Hour Slot Intervals
 * Pure verified information — no invented specs or equipment.
 */

export const VENUE_INFO = {
  name: 'VAULT 147',
  tagline: 'SNOOKER. PS5. THE GAME STARTS HERE.',
  subTagline: 'A premium gaming and snooker experience built for players who want more than just a game.',
  location: {
    line1: 'Mannarsamy 6/1, Somu Nagar',
    area: 'Royapuram',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600013',
    full: 'Mannarsamy 6/1, Somu Nagar, Royapuram, Chennai, Tamil Nadu 600013'
  },
  contact: {
    phone: '+91 88259 75491',
    phoneRaw: '8825975491',
    phoneFormatted: '088259 75491',
    whatsapp: '918825975491',
    instagram: 'vault.147',
    instagramUrl: 'https://instagram.com/vault.147',
    mapsUrl: 'https://maps.google.com/?q=Mannarsamy+6/1+Somu+Nagar+Royapuram+Chennai+600013'
  },
  hours: {
    days: 'Monday – Sunday',
    timing: '10:00 AM – 12:00 AM (Midnight)',
    full: '10:00 AM – 12:00 AM (Open Daily)'
  }
};

export const PRICING_RULES = {
  snooker: {
    hourlyRate: 250,
    unit: 'hour'
  },
  ps5: {
    1: 150, // 1 Player: ₹150 / hr
    2: 300, // 2 Players: ₹300 / hr
    3: 400, // 3 Players: ₹400 / hr
    4: 500  // 4 Players: ₹500 / hr
  },
  durationOptions: [1, 2, 3, 4] // Dynamic durations in hours
};

export const BOOKING_UNITS = [
  {
    id: 'snooker-01',
    name: 'SNOOKER TABLE 01',
    category: 'snooker',
    categoryLabel: 'SNOOKER ARENA',
    image: 'assets/images/snooker-arena-3tables.jpg',
    basePrice: 250,
    priceLabel: '₹250 / HOUR',
    oneLineDesc: 'Full-size championship table with tournament red cloth, overhead match lighting, and Aramith match balls.',
    status: 'AVAILABLE'
  },
  {
    id: 'snooker-02',
    name: 'SNOOKER TABLE 02',
    category: 'snooker',
    categoryLabel: 'SNOOKER ARENA',
    image: 'assets/images/snooker-table-cues.jpg',
    basePrice: 250,
    priceLabel: '₹250 / HOUR',
    oneLineDesc: 'Championship-specification table equipped with anti-glare cone lamps and balanced match cues.',
    status: 'AVAILABLE'
  },
  {
    id: 'snooker-03',
    name: 'SNOOKER TABLE 03',
    category: 'snooker',
    categoryLabel: 'SNOOKER ARENA',
    image: 'assets/images/snooker-solo-table.jpg',
    basePrice: 250,
    priceLabel: '₹250 / HOUR',
    oneLineDesc: 'Dedicated match table featuring focused overhead illumination engineered for 1v1 match play.',
    status: 'AVAILABLE'
  },
  {
    id: 'ps5-01',
    name: 'PLAYSTATION 5 STATION 01',
    category: 'ps5',
    categoryLabel: 'PS5 ARENA',
    image: 'assets/images/ps5-eafc-station.jpg',
    basePrice: 150,
    priceLabel: 'FROM ₹150 / HOUR',
    oneLineDesc: 'PlayStation 5 console station with high-refresh display and DualSense wireless controllers.',
    status: 'AVAILABLE'
  },
  {
    id: 'ps5-02',
    name: 'PLAYSTATION 5 STATION 02',
    category: 'ps5',
    categoryLabel: 'PS5 ARENA',
    image: 'assets/images/vault147-panorama-lounge.webp',
    basePrice: 150,
    priceLabel: 'FROM ₹150 / HOUR',
    oneLineDesc: 'Multiplayer battle station supporting 1 to 4 players for EA Sports FC and head-to-head competition.',
    status: 'AVAILABLE'
  },
  {
    id: 'ps5-03',
    name: 'PLAYSTATION 5 STATION 03',
    category: 'ps5',
    categoryLabel: 'PS5 ARENA',
    image: 'assets/images/ps5-eafc-station.jpg',
    basePrice: 150,
    priceLabel: 'FROM ₹150 / HOUR',
    oneLineDesc: 'Console station with comfortable squad seating and signature ambient crimson lighting.',
    status: 'AVAILABLE'
  }
];

export const TIME_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM',
  '10:00 PM',
  '11:00 PM'
];

export const GALLERY_CATALOG = [
  {
    id: 'g-01',
    title: 'Championship 3-Table Arena',
    category: 'snooker',
    categoryLabel: 'SNOOKER ARENA',
    image: 'assets/images/snooker-arena-3tables.jpg',
    spanClass: 'span-col-8'
  },
  {
    id: 'g-02',
    title: 'Match Cues & Precision Rails',
    category: 'snooker',
    categoryLabel: 'SNOOKER ARENA',
    image: 'assets/images/snooker-table-cues.jpg',
    spanClass: 'span-col-4'
  },
  {
    id: 'g-03',
    title: 'Aramith Crimson Ball Rack',
    category: 'snooker',
    categoryLabel: 'SNOOKER ARENA',
    image: 'assets/images/snooker-balls-racked.jpg',
    spanClass: 'span-col-4'
  },
  {
    id: 'g-04',
    title: 'PlayStation 5 Competitive Station',
    category: 'ps5',
    categoryLabel: 'PS5 ARENA',
    image: 'assets/images/ps5-eafc-station.jpg',
    spanClass: 'span-col-8'
  },
  {
    id: 'g-05',
    title: 'Arena Perspective Panorama',
    category: 'the-lounge',
    categoryLabel: 'THE LOUNGE',
    image: 'assets/images/vault147-panorama-lounge.webp',
    spanClass: 'span-col-7'
  },
  {
    id: 'g-06',
    title: 'Solo Match Table Illumination',
    category: 'snooker',
    categoryLabel: 'SNOOKER ARENA',
    image: 'assets/images/snooker-solo-table.jpg',
    spanClass: 'span-col-5'
  },
  {
    id: 'g-07',
    title: 'Official Royapuram Venue Details',
    category: 'the-lounge',
    categoryLabel: 'THE LOUNGE',
    image: 'assets/images/vault147-flyer.jpg',
    spanClass: 'span-col-6'
  },
  {
    id: 'g-08',
    title: 'Official Arena Tariff & Pricing',
    category: 'the-lounge',
    categoryLabel: 'THE LOUNGE',
    image: 'assets/images/vault147-tariff.jpg',
    spanClass: 'span-col-6'
  }
];
