export type Hotel = {
  id: string;
  name: string;
  stars: number;
  roomCategories: string[];
  roomTypes: HotelRoomType[];
  rates: Record<RoomTypeKey, number>;
  additionals: HotelAdditional[];
};

export type RoomTypeKey = "single" | "double" | "tripleA" | "tripleB" | "childNoBed";

export type RoomType = {
  key: RoomTypeKey;
  label: string;
};

export type AccommodationPriceType = RoomType;

export type HotelRoomType = {
  id: string;
  name: string;
  pricePerNight: number;
};

export type HotelAdditional = {
  id: string;
  name: string;
  price: number;
};

export type Visa = {
  id: string;
  name: string;
  fee: number;
};

export type Activity = {
  id: string;
  name: string;
  price: number;
  tickets: ActivityTicket[];
};

export type ActivityTicket = {
  id: string;
  name: string;
  price: number;
};

export type Vehicle = {
  id: string;
  name: string;
  capacity: number;
  rate: number;
};

export type CarType = {
  id: string;
  name: string;
  capacity: number;
  luggage: number;
  price: number;
};

export type BaliLocation = {
  id: string;
  name: string;
  area: string;
};

export type ItineraryTag = {
  id: string;
  label: string;
};

export type VisaServiceOption = {
  id: string;
  label: string;
};

export type VisaPermitOption = {
  id: string;
  label: string;
  prices: Record<string, number>;
};

export const accommodationList: Hotel[] = [
  {
    id: "samaya-ubud",
    name: "Samaya Ubud",
    stars: 5,
    roomCategories: ["Hill View Suite", "Ayung Villa", "Royal Courtyard Villa"],
    roomTypes: [
      { id: "hill-view-suite", name: "Hill View Suite", pricePerNight: 2100000 },
      { id: "ayung-villa", name: "Ayung Villa", pricePerNight: 2400000 },
      { id: "royal-courtyard-villa", name: "Royal Courtyard Villa", pricePerNight: 2950000 }
    ],
    rates: { single: 2100000, double: 2400000, tripleA: 2950000, tripleB: 2800000, childNoBed: 750000 },
    additionals: [
      { id: "none", name: "No additional", price: 0 },
      { id: "breakfast", name: "Breakfast", price: 125000 },
      { id: "extra-bed", name: "Extra bed", price: 450000 }
    ]
  },
  {
    id: "ayana-segara",
    name: "Ayana Segara Bali",
    stars: 5,
    roomCategories: ["Resort View Room", "Ocean View Suite", "Segara Residence"],
    roomTypes: [
      { id: "resort-view-room", name: "Resort View Room", pricePerNight: 3300000 },
      { id: "ocean-view-suite", name: "Ocean View Suite", pricePerNight: 3650000 },
      { id: "segara-residence", name: "Segara Residence", pricePerNight: 4300000 }
    ],
    rates: { single: 3300000, double: 3650000, tripleA: 4300000, tripleB: 4100000, childNoBed: 950000 },
    additionals: [
      { id: "none", name: "No additional", price: 0 },
      { id: "breakfast", name: "Breakfast", price: 175000 },
      { id: "club-access", name: "Club access", price: 650000 }
    ]
  },
  {
    id: "maya-sanur",
    name: "Maya Sanur Resort",
    stars: 5,
    roomCategories: ["Deluxe Garden", "Lagoon Access", "Beachfront Suite"],
    roomTypes: [
      { id: "deluxe-garden", name: "Deluxe Garden", pricePerNight: 1850000 },
      { id: "lagoon-access", name: "Lagoon Access", pricePerNight: 2150000 },
      { id: "beachfront-suite", name: "Beachfront Suite", pricePerNight: 2700000 }
    ],
    rates: { single: 1850000, double: 2150000, tripleA: 2700000, tripleB: 2550000, childNoBed: 625000 },
    additionals: [
      { id: "none", name: "No additional", price: 0 },
      { id: "breakfast", name: "Breakfast", price: 125000 },
      { id: "airport-pickup", name: "Airport pickup", price: 350000 }
    ]
  },
  {
    id: "sankara-seminyak",
    name: "Sankara Seminyak",
    stars: 4,
    roomCategories: ["Superior Room", "Deluxe Pool View", "Two Bedroom Suite"],
    roomTypes: [
      { id: "superior-room", name: "Superior Room", pricePerNight: 1350000 },
      { id: "deluxe-pool-view", name: "Deluxe Pool View", pricePerNight: 1600000 },
      { id: "two-bedroom-suite", name: "Two Bedroom Suite", pricePerNight: 2100000 }
    ],
    rates: { single: 1350000, double: 1600000, tripleA: 2100000, tripleB: 1980000, childNoBed: 450000 },
    additionals: [
      { id: "none", name: "No additional", price: 0 },
      { id: "breakfast", name: "Breakfast", price: 95000 },
      { id: "late-checkout", name: "Late checkout", price: 300000 }
    ]
  },
  {
    id: "sunset-kuta",
    name: "Sunset Kuta Hotel",
    stars: 3,
    roomCategories: ["Standard Room", "Superior Room", "Family Room"],
    roomTypes: [
      { id: "standard-room", name: "Standard Room", pricePerNight: 850000 },
      { id: "superior-room", name: "Superior Room", pricePerNight: 1050000 },
      { id: "family-room", name: "Family Room", pricePerNight: 1450000 }
    ],
    rates: { single: 850000, double: 1050000, tripleA: 1450000, tripleB: 1325000, childNoBed: 250000 },
    additionals: [
      { id: "none", name: "No additional", price: 0 },
      { id: "breakfast", name: "Breakfast", price: 75000 },
      { id: "extra-bed", name: "Extra bed", price: 250000 }
    ]
  }
];

export const visaList: Visa[] = [
  { id: "voa", name: "Visa on Arrival", fee: 500000 },
  { id: "b211a", name: "B211A Visit Visa", fee: 1650000 },
  { id: "kitas", name: "Limited Stay Permit", fee: 4200000 }
];

export const activityList: Activity[] = [
  {
    id: "ubud-tour",
    name: "Ubud culture day",
    price: 450000,
    tickets: [
      { id: "standard", name: "Standard ticket", price: 450000 },
      { id: "private-guide", name: "Private guide ticket", price: 675000 }
    ]
  },
  {
    id: "water-sport",
    name: "Tanjung Benoa water sport",
    price: 700000,
    tickets: [
      { id: "basic", name: "Basic water sport pass", price: 700000 },
      { id: "premium", name: "Premium water sport pass", price: 1150000 }
    ]
  },
  {
    id: "nusa-penida",
    name: "Nusa Penida island trip",
    price: 950000,
    tickets: [
      { id: "shared-boat", name: "Shared boat ticket", price: 950000 },
      { id: "private-boat", name: "Private boat ticket", price: 1850000 }
    ]
  },
  {
    id: "spa",
    name: "Balinese spa ritual",
    price: 375000,
    tickets: [
      { id: "one-hour", name: "One hour spa ticket", price: 375000 },
      { id: "two-hour", name: "Two hour spa ticket", price: 650000 }
    ]
  }
];

export const vehicleList: Vehicle[] = [
  { id: "avanza", name: "Toyota Avanza", capacity: 4, rate: 700000 },
  { id: "hiace", name: "Toyota HiAce", capacity: 12, rate: 1450000 },
  { id: "elf", name: "Isuzu ELF", capacity: 18, rate: 1900000 },
  { id: "bus", name: "Medium Bus", capacity: 30, rate: 2850000 }
];

export const carTypeList: CarType[] = [
  { id: "innova", name: "Toyota Innova", capacity: 4, luggage: 2, price: 800000 },
  { id: "alphard", name: "Toyota Alphard", capacity: 4, luggage: 3, price: 1750000 },
  { id: "hiace", name: "Toyota HiAce", capacity: 12, luggage: 10, price: 1450000 },
  { id: "elf", name: "Isuzu ELF", capacity: 18, luggage: 14, price: 1900000 }
];

export const baliLocationList: BaliLocation[] = [
  { id: "seminyak", name: "Seminyak", area: "Badung" },
  { id: "ubud", name: "Ubud", area: "Gianyar" },
  { id: "canggu", name: "Canggu", area: "Badung" },
  { id: "nusa-dua", name: "Nusa Dua", area: "Badung" },
  { id: "uluwatu", name: "Uluwatu", area: "Badung" }
];

export const itineraryTagList: ItineraryTag[] = [
  { id: "check-in", label: "Check-in" },
  { id: "check-out", label: "Check-out" }
];

export const visaServiceOptionList: VisaServiceOption[] = [
  { id: "regular", label: "Regular Process (9 - 14 working days)" },
  { id: "voa-same-day", label: "VOA - Same Day (1 - 2 working days)" }
];

export const visaPermitOptionList: VisaPermitOption[] = [
  {
    id: "e-voa-b1",
    label: "Electronic Visa on Arrival (e-VoA) (B1)",
    prices: { regular: 500000, "voa-same-day": 850000 }
  },
  {
    id: "d12-1-year",
    label: "Pre-Investment Visitor Visa (D12) (1 year)",
    prices: { regular: 4500000, "voa-same-day": 5200000 }
  },
  {
    id: "d12-2-year",
    label: "Pre-Investment Visitor Visa (D12) (2 year)",
    prices: { regular: 7600000, "voa-same-day": 8400000 }
  },
  {
    id: "e33g",
    label: "Remote Worker Special Residency Visa (E33G)",
    prices: { regular: 12500000, "voa-same-day": 13750000 }
  },
  {
    id: "c1",
    label: "Single-Entry Visitor Visas (C1)",
    prices: { regular: 1800000, "voa-same-day": 2400000 }
  }
];

export const roomTypes: RoomType[] = [
  { key: "single", label: "Single" },
  { key: "double", label: "Double" },
  { key: "tripleA", label: "Triple A (3 Adult)" },
  { key: "tripleB", label: "Triple B (2 Adult + 1 Child)" },
  { key: "childNoBed", label: "Child No Bed" }
];
