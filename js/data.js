/**
 * VAULT 147 — ARENA DATA REPOSITORY & ASSET CATALOG
 * Official Rates, Dynamic Duration Rules, 1-Hour Slot Intervals
 */

export const VENUE_INFO = {
  name: 'VAULT 147',
  tagline: 'PREMIUM SNOOKER & PLAYSTATION 5 LOUNGE',
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
    whatsapp: '8825975491',
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
    categoryLabel: 'SNOOKER',
    image: 'assets/images/snooker-arena-3tables.jpg?v=2',
    basePrice: 250,
    priceLabel: '₹250 / HOUR',
    oneLineDesc: 'Championship red cloth table with precision overhead drop lighting and Aramith tournament balls.',
    status: 'AVAILABLE'
  },
  {
    id: 'snooker-02',
    name: 'SNOOKER TABLE 02',
    category: 'snooker',
    categoryLabel: 'SNOOKER',
    image: 'assets/images/snooker-table-cues.jpg?v=2',
    basePrice: 250,
    priceLabel: '₹250 / HOUR',
    oneLineDesc: 'Tournament-spec table with anti-glare cone lamps and weighted match cues.',
    status: 'AVAILABLE'
  },
  {
    id: 'snooker-03',
    name: 'SNOOKER TABLE 03',
    category: 'snooker',
    categoryLabel: 'SNOOKER',
    image: 'assets/images/snooker-solo-table.jpg?v=2',
    basePrice: 250,
    priceLabel: '₹250 / HOUR',
    oneLineDesc: 'Low-key isolated accent lighting designed for high-focus 1v1 match play.',
    status: 'AVAILABLE'
  },
  {
    id: 'ps5-01',
    name: 'PS5 COCKPIT STATION 01',
    category: 'ps5',
    categoryLabel: 'PS5 CONSOLE',
    image: 'assets/images/ps5-racing-cockpit.jpg?v=2',
    basePrice: 150,
    priceLabel: 'FROM ₹150 / HOUR',
    oneLineDesc: 'Logitech G-Series force-feedback racing wheel, pedals, and 4K HDR display.',
    status: 'AVAILABLE'
  },
  {
    id: 'ps5-02',
    name: 'PS5 DUALSENSE ARENA 02',
    category: 'ps5',
    categoryLabel: 'PS5 CONSOLE',
    image: 'assets/images/ps5-eafc-station.jpg?v=2',
    basePrice: 150,
    priceLabel: 'FROM ₹150 / HOUR',
    oneLineDesc: 'EA FC 25, Mortal Kombat & top action titles with up to 4 DualSense wireless controllers.',
    status: 'AVAILABLE'
  },
  {
    id: 'ps5-03',
    name: 'PS5 SQUAD LOUNGE 03',
    category: 'ps5',
    categoryLabel: 'PS5 CONSOLE',
    image: 'assets/images/ps5-lounge-beanbags.jpg?v=2',
    basePrice: 150,
    priceLabel: 'FROM ₹150 / HOUR',
    oneLineDesc: 'Plush red and black beanbag lounge setup engineered for squad sessions and weekend battles.',
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
    title: '3-Table Tournament Arena',
    category: 'snooker',
    categoryLabel: 'Snooker Arena',
    image: 'assets/images/snooker-arena-3tables.jpg?v=2',
    spanClass: 'span-2-row'
  },
  {
    id: 'g-02',
    title: 'Gran Turismo Racing Cockpit',
    category: 'ps5',
    categoryLabel: 'PS5 Rig',
    image: 'assets/images/ps5-racing-cockpit.jpg?v=2',
    spanClass: ''
  },
  {
    id: 'g-03',
    title: 'Crimson Tournament Ball Rack',
    category: 'snooker',
    categoryLabel: 'Snooker Arena',
    image: 'assets/images/snooker-balls-racked.jpg?v=2',
    spanClass: ''
  },
  {
    id: 'g-04',
    title: 'Championship Cue Setup',
    category: 'snooker',
    categoryLabel: 'Snooker Arena',
    image: 'assets/images/snooker-table-cues.jpg?v=2',
    spanClass: ''
  },
  {
    id: 'g-05',
    title: 'Squad Lounge & Beanbag Suite',
    category: 'the-lounge',
    categoryLabel: 'The Lounge',
    image: 'assets/images/ps5-lounge-beanbags.jpg?v=2',
    spanClass: 'span-2-col'
  },
  {
    id: 'g-06',
    title: 'Solo Illuminated Match Table',
    category: 'snooker',
    categoryLabel: 'Snooker Arena',
    image: 'assets/images/snooker-solo-table.jpg?v=2',
    spanClass: ''
  },
  {
    id: 'g-07',
    title: 'EA FC Competitive Showdown',
    category: 'ps5',
    categoryLabel: 'PS5 Rig',
    image: 'assets/images/ps5-eafc-station.jpg?v=2',
    spanClass: ''
  },
  {
    id: 'g-08',
    title: 'Arena Perspective Panorama',
    category: 'the-lounge',
    categoryLabel: 'The Lounge',
    image: 'assets/images/vault147-panorama-lounge.webp?v=2',
    spanClass: 'span-2-row'
  },
  {
    id: 'g-09',
    title: 'Official Royapuram Venue Details',
    category: 'the-lounge',
    categoryLabel: 'The Lounge',
    image: 'assets/images/vault147-flyer.jpg?v=2',
    spanClass: ''
  }
];
