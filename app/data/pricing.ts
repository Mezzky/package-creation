export type Hotel = {
  id: string;
  name: string;
  stars: number;
  roomCategories: string[];
  rates: Record<RoomTypeKey, number>;
};

export type RoomTypeKey = "single" | "double" | "tripleA" | "tripleB" | "childNoBed";

export type RoomType = {
  key: RoomTypeKey;
  label: string;
  defaultUnits: number;
  linkable: boolean;
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
};

export type Vehicle = {
  id: string;
  name: string;
  capacity: number;
  rate: number;
};

export const accommodationList: Hotel[] = [
  {
    id: "samaya-ubud",
    name: "Samaya Ubud",
    stars: 5,
    roomCategories: ["Hill View Suite", "Ayung Villa", "Royal Courtyard Villa"],
    rates: { single: 2100000, double: 2400000, tripleA: 2950000, tripleB: 2800000, childNoBed: 750000 }
  },
  {
    id: "ayana-segara",
    name: "Ayana Segara Bali",
    stars: 5,
    roomCategories: ["Resort View Room", "Ocean View Suite", "Segara Residence"],
    rates: { single: 3300000, double: 3650000, tripleA: 4300000, tripleB: 4100000, childNoBed: 950000 }
  },
  {
    id: "maya-sanur",
    name: "Maya Sanur Resort",
    stars: 5,
    roomCategories: ["Deluxe Garden", "Lagoon Access", "Beachfront Suite"],
    rates: { single: 1850000, double: 2150000, tripleA: 2700000, tripleB: 2550000, childNoBed: 625000 }
  },
  {
    id: "sankara-seminyak",
    name: "Sankara Seminyak",
    stars: 4,
    roomCategories: ["Superior Room", "Deluxe Pool View", "Two Bedroom Suite"],
    rates: { single: 1350000, double: 1600000, tripleA: 2100000, tripleB: 1980000, childNoBed: 450000 }
  }
];

export const visaList: Visa[] = [
  { id: "voa", name: "Visa on Arrival", fee: 500000 },
  { id: "b211a", name: "B211A Visit Visa", fee: 1650000 },
  { id: "kitas", name: "Limited Stay Permit", fee: 4200000 }
];

export const activityList: Activity[] = [
  { id: "ubud-tour", name: "Ubud culture day", price: 450000 },
  { id: "water-sport", name: "Tanjung Benoa water sport", price: 700000 },
  { id: "nusa-penida", name: "Nusa Penida island trip", price: 950000 },
  { id: "spa", name: "Balinese spa ritual", price: 375000 }
];

export const vehicleList: Vehicle[] = [
  { id: "avanza", name: "Toyota Avanza", capacity: 4, rate: 700000 },
  { id: "hiace", name: "Toyota HiAce", capacity: 12, rate: 1450000 },
  { id: "elf", name: "Isuzu ELF", capacity: 18, rate: 1900000 },
  { id: "bus", name: "Medium Bus", capacity: 30, rate: 2850000 }
];

export const roomTypes: RoomType[] = [
  { key: "single", label: "Single", defaultUnits: 0, linkable: true },
  { key: "double", label: "Double", defaultUnits: 0, linkable: true },
  { key: "tripleA", label: "Triple A (3 Adult)", defaultUnits: 0, linkable: true },
  { key: "tripleB", label: "Triple B (2 Adult + 1 Child)", defaultUnits: 0, linkable: true },
  { key: "childNoBed", label: "Child No Bed", defaultUnits: 0, linkable: false }
];
