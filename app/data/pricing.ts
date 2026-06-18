export type Hotel = {
  id: string;
  name: string;
  stars: number;
  roomCategories: string[];
  roomTypes: HotelRoomType[];
  rates: Record<RoomTypeKey, number>;
  additionals: HotelAdditional[];
  countryId: string;
  regencyId: string;
  stateId: string;
};

export type LocationOption = { id: string; name: string; parentId?: string };

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
  extraBedAdult: number;
  extraBedChild: number;
  childNoBed: number;
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
  nationality: "general" | "foreign" | "domestic";
  ticketType: "general" | "adult" | "child";
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
    countryId: "indonesia", regencyId: "bali", stateId: "ubud",
    name: "Samaya Ubud",
    stars: 5,
    roomCategories: ["Hill View Suite", "Ayung Villa", "Royal Courtyard Villa"],
    roomTypes: [
      { id: "hill-view-suite", name: "Hill View Suite", pricePerNight: 2100000, extraBedAdult: 650000, extraBedChild: 425000, childNoBed: 175000 },
      { id: "ayung-villa", name: "Ayung Villa", pricePerNight: 2400000, extraBedAdult: 700000, extraBedChild: 475000, childNoBed: 200000 },
      { id: "royal-courtyard-villa", name: "Royal Courtyard Villa", pricePerNight: 2950000, extraBedAdult: 800000, extraBedChild: 525000, childNoBed: 225000 }
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
    countryId: "indonesia", regencyId: "bali", stateId: "nusa-dua",
    name: "Ayana Segara Bali",
    stars: 5,
    roomCategories: ["Resort View Room", "Ocean View Suite", "Segara Residence"],
    roomTypes: [
      { id: "resort-view-room", name: "Resort View Room", pricePerNight: 3300000, extraBedAdult: 900000, extraBedChild: 600000, childNoBed: 275000 },
      { id: "ocean-view-suite", name: "Ocean View Suite", pricePerNight: 3650000, extraBedAdult: 975000, extraBedChild: 650000, childNoBed: 300000 },
      { id: "segara-residence", name: "Segara Residence", pricePerNight: 4300000, extraBedAdult: 1100000, extraBedChild: 725000, childNoBed: 350000 }
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
    countryId: "indonesia", regencyId: "bali", stateId: "sanur",
    name: "Maya Sanur Resort",
    stars: 5,
    roomCategories: ["Deluxe Garden", "Lagoon Access", "Beachfront Suite"],
    roomTypes: [
      { id: "deluxe-garden", name: "Deluxe Garden", pricePerNight: 1850000, extraBedAdult: 575000, extraBedChild: 375000, childNoBed: 150000 },
      { id: "lagoon-access", name: "Lagoon Access", pricePerNight: 2150000, extraBedAdult: 625000, extraBedChild: 400000, childNoBed: 175000 },
      { id: "beachfront-suite", name: "Beachfront Suite", pricePerNight: 2700000, extraBedAdult: 725000, extraBedChild: 475000, childNoBed: 200000 }
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
    countryId: "indonesia", regencyId: "bali", stateId: "seminyak",
    name: "Sankara Seminyak",
    stars: 4,
    roomCategories: ["Superior Room", "Deluxe Pool View", "Two Bedroom Suite"],
    roomTypes: [
      { id: "superior-room", name: "Superior Room", pricePerNight: 1350000, extraBedAdult: 425000, extraBedChild: 275000, childNoBed: 125000 },
      { id: "deluxe-pool-view", name: "Deluxe Pool View", pricePerNight: 1600000, extraBedAdult: 475000, extraBedChild: 300000, childNoBed: 140000 },
      { id: "two-bedroom-suite", name: "Two Bedroom Suite", pricePerNight: 2100000, extraBedAdult: 550000, extraBedChild: 350000, childNoBed: 160000 }
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
    countryId: "indonesia", regencyId: "bali", stateId: "kuta",
    name: "Sunset Kuta Hotel",
    stars: 3,
    roomCategories: ["Standard Room", "Superior Room", "Family Room"],
    roomTypes: [
      { id: "standard-room", name: "Standard Room", pricePerNight: 850000, extraBedAdult: 275000, extraBedChild: 175000, childNoBed: 75000 },
      { id: "superior-room", name: "Superior Room", pricePerNight: 1050000, extraBedAdult: 325000, extraBedChild: 200000, childNoBed: 90000 },
      { id: "family-room", name: "Family Room", pricePerNight: 1450000, extraBedAdult: 375000, extraBedChild: 250000, childNoBed: 110000 }
    ],
    rates: { single: 850000, double: 1050000, tripleA: 1450000, tripleB: 1325000, childNoBed: 250000 },
    additionals: [
      { id: "none", name: "No additional", price: 0 },
      { id: "breakfast", name: "Breakfast", price: 75000 },
      { id: "extra-bed", name: "Extra bed", price: 250000 }
    ]
  },
  {
    id: "marina-bay-harbour", countryId: "singapore", regencyId: "central-region", stateId: "marina-bay",
    name: "Marina Bay Harbour Hotel", stars: 5, roomCategories: ["Deluxe Bay", "Premier Suite"],
    roomTypes: [
      { id: "deluxe-bay", name: "Deluxe Bay", pricePerNight: 4200000, extraBedAdult: 1100000, extraBedChild: 750000, childNoBed: 350000 },
      { id: "premier-suite", name: "Premier Suite", pricePerNight: 5600000, extraBedAdult: 1350000, extraBedChild: 900000, childNoBed: 425000 }
    ],
    rates: { single: 4200000, double: 4200000, tripleA: 5300000, tripleB: 4950000, childNoBed: 350000 },
    additionals: []
  },
  {
    id: "orchard-city-hotel", countryId: "singapore", regencyId: "central-region", stateId: "orchard",
    name: "Orchard City Hotel", stars: 4, roomCategories: ["City Room", "Club Room"],
    roomTypes: [
      { id: "city-room", name: "City Room", pricePerNight: 3100000, extraBedAdult: 850000, extraBedChild: 575000, childNoBed: 275000 },
      { id: "club-room", name: "Club Room", pricePerNight: 3900000, extraBedAdult: 950000, extraBedChild: 650000, childNoBed: 300000 }
    ],
    rates: { single: 3100000, double: 3100000, tripleA: 3950000, tripleB: 3675000, childNoBed: 275000 },
    additionals: []
  },
  {
    id: "bukit-bintang-grand", countryId: "malaysia", regencyId: "kuala-lumpur", stateId: "bukit-bintang",
    name: "Bukit Bintang Grand", stars: 5, roomCategories: ["Grand Deluxe", "Executive Suite"],
    roomTypes: [
      { id: "grand-deluxe", name: "Grand Deluxe", pricePerNight: 2400000, extraBedAdult: 675000, extraBedChild: 450000, childNoBed: 200000 },
      { id: "executive-suite", name: "Executive Suite", pricePerNight: 3250000, extraBedAdult: 800000, extraBedChild: 525000, childNoBed: 250000 }
    ],
    rates: { single: 2400000, double: 2400000, tripleA: 3075000, tripleB: 2850000, childNoBed: 200000 },
    additionals: []
  },
  {
    id: "klcc-park-hotel", countryId: "malaysia", regencyId: "kuala-lumpur", stateId: "klcc",
    name: "KLCC Park Hotel", stars: 4, roomCategories: ["Park View", "Tower View"],
    roomTypes: [
      { id: "park-view", name: "Park View", pricePerNight: 1900000, extraBedAdult: 550000, extraBedChild: 375000, childNoBed: 175000 },
      { id: "tower-view", name: "Tower View", pricePerNight: 2500000, extraBedAdult: 650000, extraBedChild: 425000, childNoBed: 200000 }
    ],
    rates: { single: 1900000, double: 1900000, tripleA: 2450000, tripleB: 2275000, childNoBed: 175000 },
    additionals: []
  }
];

export const countryList: LocationOption[] = [
  { id: "indonesia", name: "Indonesia" }, { id: "singapore", name: "Singapore" }, { id: "malaysia", name: "Malaysia" }
];
export const regencyList: LocationOption[] = [
  { id: "bali", name: "Bali", parentId: "indonesia" },
  { id: "central-region", name: "Central Region", parentId: "singapore" },
  { id: "kuala-lumpur", name: "Kuala Lumpur", parentId: "malaysia" }
];
export const stateList: LocationOption[] = [
  { id: "ubud", name: "Ubud", parentId: "bali" }, { id: "nusa-dua", name: "Nusa Dua", parentId: "bali" },
  { id: "sanur", name: "Sanur", parentId: "bali" }, { id: "seminyak", name: "Seminyak", parentId: "bali" }, { id: "kuta", name: "Kuta", parentId: "bali" },
  { id: "marina-bay", name: "Marina Bay", parentId: "central-region" }, { id: "orchard", name: "Orchard", parentId: "central-region" },
  { id: "bukit-bintang", name: "Bukit Bintang", parentId: "kuala-lumpur" }, { id: "klcc", name: "KLCC", parentId: "kuala-lumpur" }
];

export const visaList: Visa[] = [
  { id: "voa", name: "Visa on Arrival", fee: 500000 },
  { id: "b211a", name: "B211A Visit Visa", fee: 1650000 },
  { id: "kitas", name: "Limited Stay Permit", fee: 4200000 }
];

const createActivityTickets = (prefix: string, basePrice: number): ActivityTicket[] => {
  const nationalities = [
    { id: "general", label: "General", multiplier: 1 },
    { id: "foreign", label: "Foreign", multiplier: 1.35 },
    { id: "domestic", label: "Domestic", multiplier: 0.85 }
  ] as const;
  const types = [
    { id: "general", label: "General", multiplier: 1 },
    { id: "adult", label: "Adult", multiplier: 1.1 },
    { id: "child", label: "Child", multiplier: 0.65 }
  ] as const;
  return nationalities.flatMap((nationality) => types.map((type) => ({
    id: `${prefix}-${nationality.id}-${type.id}`,
    name: `${nationality.label} ${type.label} Ticket`,
    nationality: nationality.id,
    ticketType: type.id,
    price: Math.round(basePrice * nationality.multiplier * type.multiplier / 1000) * 1000
  })));
};

export const activityList: Activity[] = [
  {
    id: "ubud-tour",
    name: "Ubud culture day",
    price: 450000,
    tickets: createActivityTickets("ubud", 450000)
  },
  {
    id: "water-sport",
    name: "Tanjung Benoa water sport",
    price: 700000,
    tickets: createActivityTickets("water-sport", 700000)
  },
  {
    id: "nusa-penida",
    name: "Nusa Penida island trip",
    price: 950000,
    tickets: createActivityTickets("nusa-penida", 950000)
  },
  {
    id: "spa",
    name: "Balinese spa ritual",
    price: 375000,
    tickets: createActivityTickets("spa", 375000)
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
  ...stateList.map((state) => {
    const regency = regencyList.find((item) => item.id === state.parentId);
    const country = countryList.find((item) => item.id === regency?.parentId);
    return { id: state.id, name: state.name, area: `${regency?.name || ""}, ${country?.name || ""}` };
  })
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
