<template>
  <main class="output-page">
    <section class="output-hero">
      <div class="output-hero-inner">
        <NuxtLink class="output-back-link" to="/">
          <Icon name="lucide:arrow-left" size="16" />
          <span>Back to builder</span>
        </NuxtLink>
        <div class="output-hero-copy">
          <p class="output-kicker">Package Output</p>
          <h1>{{ outputPackageTitle }}</h1>
          <p>{{ outputPackageDescription }}</p>
          <span>{{ outputDurationDays }} days / {{ outputDurationNights }} nights</span>
        </div>
      </div>
    </section>

    <section class="output-shell">
      <div class="output-itinerary">
        <div class="output-section-heading">
          <div>
            <h2>Itinerary</h2>
            <p>Every day shows the products connected from package creation.</p>
          </div>
          <div class="output-section-actions">
            <button class="button-secondary" type="button" @click="expandAllDays">
              <Icon name="lucide:chevrons-down" size="16" />
              <span>Expand all</span>
            </button>
            <button class="button-secondary" type="button" @click="closeAllDays">
              <Icon name="lucide:chevrons-up" size="16" />
              <span>Close all</span>
            </button>
          </div>
        </div>

        <div class="output-day-list">
          <article v-for="day in outputDays" :key="day.id" class="output-day-card">
            <button class="output-day-summary" type="button" @click="toggleDay(day.dayNumber)">
              <span class="output-day-badge">Day {{ day.dayNumber }}</span>
              <span class="output-day-title">{{ day.title }}</span>
              <Icon :name="isDayCollapsed(day.dayNumber) ? 'lucide:chevron-down' : 'lucide:chevron-up'" size="18" />
            </button>

            <div v-if="!isDayCollapsed(day.dayNumber)" class="output-day-body">
              <div class="output-day-meta">
                <span>
                  <Icon name="lucide:map-pin" size="15" />
                  {{ day.location }}
                </span>
                <span v-if="day.tag">
                  <Icon name="lucide:tag" size="15" />
                  {{ day.tag }}
                </span>
                <span v-if="day.departureTime || day.returnTime">
                  <Icon name="lucide:clock" size="15" />
                  {{ day.departureTime || "--:--" }} - {{ day.returnTime || "--:--" }}
                </span>
              </div>

              <ul class="output-day-description">
                <li v-for="item in day.description" :key="item">{{ item }}</li>
              </ul>

              <div class="output-products-grid" :class="{ 'without-visa': day.dayNumber !== 1 }">
                <div class="output-product-box">
                  <h3>Accommodation</h3>
                  <p v-if="!day.accommodations.length" class="empty-line">No linked accommodation.</p>
                  <p v-for="record in day.accommodations" :key="record">
                    {{ record }}
                  </p>
                </div>

                <div class="output-product-box">
                  <h3>Activity</h3>
                  <p v-if="!day.activities.length" class="empty-line">No linked activity.</p>
                  <p v-for="record in day.activities" :key="record">
                    {{ record }}
                  </p>
                </div>

                <div class="output-product-box">
                  <h3>Transportation</h3>
                  <p v-if="!day.transportation.length" class="empty-line">No linked transportation.</p>
                  <p v-for="record in day.transportation" :key="record">
                    {{ record }}
                  </p>
                </div>

                <div v-if="day.dayNumber === 1" class="output-product-box">
                  <h3>VISA</h3>
                  <p v-if="!day.visas.length" class="empty-line">No linked VISA.</p>
                  <p v-for="record in day.visas" :key="record">
                    {{ record }}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <aside class="output-pricing">
        <div class="output-section-heading">
          <h2>Pricing Options</h2>
          <p>COMBO comparison using the new price types, connected hotels, other products, and markup.</p>
        </div>

        <div class="combo-price-table">
          <div class="combo-price-head">
            <span>Name</span>
            <span>Hotels Description</span>
            <span>Single</span>
            <span>Double</span>
            <span>Triple A<br><small>3 Adult</small></span>
            <span>Triple B<br><small>2 Adult + 1 Child</small></span>
            <span>Child No Bed</span>
            <span>Info</span>
          </div>
          <div v-for="combo in comboRows" :key="combo.code" class="combo-price-row">
            <strong class="combo-code">{{ combo.code }}</strong>
            <div class="combo-hotels">
              <div v-for="hotel in combo.hotels" :key="`${combo.code}-${hotel.day}`" class="combo-hotel-line">
                <strong>Day {{ hotel.day }} - {{ hotel.name }}</strong>
                <span>{{ hotel.room }}</span>
                <small>{{ hotel.location }} / {{ hotel.stars }} Stars</small>
              </div>
            </div>
            <div v-for="price in combo.prices" :key="`${combo.code}-${price.key}`" class="combo-price-cell">
              <strong>{{ price.value ? formatCurrency(price.value) : "-" }}</strong>
              <span>Per Pax</span>
            </div>
            <div class="combo-actions">
              <button class="button-secondary" type="button">Show Price Info</button>
              <button class="button-primary" type="button">Select Package</button>
            </div>
          </div>
        </div>

        <div class="output-hotel-summary">
          <h2>Hotel Records</h2>
          <div v-for="record in hotelSummaryRows" :key="record.id" class="output-hotel-item">
            <div>
              <strong>Day {{ record.day }}</strong>
              <p>{{ record.name }}</p>
              <span>{{ record.room }} / {{ record.location }}</span>
            </div>
            <span class="output-stars">{{ record.stars }} Stars</span>
          </div>
        </div>
      </aside>
    </section>
  </main>
</template>

<script setup lang="ts">
const collapsedDayNumbers = ref<number[]>([2, 3, 4, 5, 6, 7, 8, 9, 10]);

type OutputDay = {
  id: number;
  dayNumber: number;
  title: string;
  location: string;
  tag: string;
  departureTime: string;
  returnTime: string;
  description: string[];
  accommodations: string[];
  activities: string[];
  transportation: string[];
  visas: string[];
};

type PriceKey = "single" | "double" | "tripleA" | "tripleB" | "childNoBed";

const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
}).format(Math.round(value || 0));

const sampleTourDays = [
  {
    title: "Check-in - Seminyak Arrival",
    location: "Seminyak",
    tag: "Check-in",
    departureTime: "13:30",
    returnTime: "18:00",
    description: ["Arrival at Ngurah Rai International Airport.", "Meet and greet with our representative.", "Private transfer to Seminyak hotel.", "Hotel check-in and free program for rest or dinner around Seminyak."],
    accommodations: ["Sankara Seminyak / Deluxe Pool View"],
    activities: ["Free Program"],
    transportation: ["Check In / Airport -> Seminyak Hotel / Toyota Innova"],
    visas: ["Electronic Visa on Arrival (e-VoA) (B1) / Regular Process"]
  },
  {
    title: "Seminyak Leisure Day",
    location: "Seminyak",
    tag: "",
    departureTime: "10:00",
    returnTime: "18:00",
    description: ["Breakfast at hotel.", "Free program to enjoy Seminyak beach, cafes, and shopping area.", "Optional sunset dinner arrangement."],
    accommodations: ["Sankara Seminyak / Deluxe Pool View"],
    activities: ["Free Program"],
    transportation: [],
    visas: []
  },
  {
    title: "Ubud Culture Tour",
    location: "Ubud",
    tag: "",
    departureTime: "08:30",
    returnTime: "18:30",
    description: ["Breakfast at hotel.", "Visit Tegenungan Waterfall, Ubud Monkey Forest, and Ubud Palace.", "Lunch at local restaurant.", "Return to Seminyak hotel in the evening."],
    accommodations: ["Sankara Seminyak / Deluxe Pool View"],
    activities: ["Ubud culture day / General Adult Ticket"],
    transportation: ["Full Day / Seminyak Hotel -> Ubud Tour -> Seminyak Hotel / Toyota Innova"],
    visas: []
  },
  {
    title: "Spa and Free Program",
    location: "Seminyak",
    tag: "",
    departureTime: "10:00",
    returnTime: "16:00",
    description: ["Breakfast at hotel.", "Balinese spa ritual session.", "Free program for shopping or beach club visit."],
    accommodations: ["Sankara Seminyak / Deluxe Pool View"],
    activities: ["Balinese spa ritual / General Adult Ticket"],
    transportation: ["Included from Activity: Balinese spa ritual"],
    visas: []
  },
  {
    title: "Check-out Seminyak - Transfer to Ubud",
    location: "Ubud",
    tag: "Check-in",
    departureTime: "10:00",
    returnTime: "17:00",
    description: ["Breakfast and check-out from Seminyak hotel.", "Transfer to Ubud with stop at Celuk silver village and Tegalalang rice terrace.", "Check-in at Ubud hotel.", "Free evening in Ubud."],
    accommodations: ["Samaya Ubud / Hill View Suite"],
    activities: ["Ubud transfer sightseeing"],
    transportation: ["Check In / Seminyak Hotel -> Ubud Hotel / Toyota Innova"],
    visas: []
  },
  {
    title: "Ubud Free Program",
    location: "Ubud",
    tag: "",
    departureTime: "10:00",
    returnTime: "18:00",
    description: ["Breakfast at hotel.", "Free program to enjoy the resort or Ubud center.", "Optional dinner arrangement with valley view."],
    accommodations: ["Samaya Ubud / Hill View Suite"],
    activities: ["Free Program"],
    transportation: [],
    visas: []
  },
  {
    title: "Nusa Penida Island Trip",
    location: "Nusa Dua",
    tag: "",
    departureTime: "06:30",
    returnTime: "19:00",
    description: ["Early breakfast at hotel.", "Transfer to harbor and join Nusa Penida island trip.", "Visit Kelingking Beach, Broken Beach, Angel's Billabong, and Crystal Bay.", "Return to hotel after tour."],
    accommodations: ["Samaya Ubud / Hill View Suite"],
    activities: ["Nusa Penida island trip / Foreign Adult Ticket"],
    transportation: ["Full Day / Ubud Hotel -> Harbor -> Nusa Penida Tour -> Ubud Hotel / Toyota HiAce"],
    visas: []
  },
  {
    title: "Check-out Ubud - Nusa Dua Water Sport",
    location: "Nusa Dua",
    tag: "Check-in",
    departureTime: "09:30",
    returnTime: "17:30",
    description: ["Breakfast and check-out from Ubud hotel.", "Transfer to Nusa Dua.", "Tanjung Benoa water sport activity.", "Check-in at Nusa Dua hotel."],
    accommodations: ["Ayana Segara Bali / Resort View Room"],
    activities: ["Tanjung Benoa water sport / General Adult Ticket"],
    transportation: ["Check In / Ubud Hotel -> Tanjung Benoa -> Nusa Dua Hotel / Toyota Innova"],
    visas: []
  },
  {
    title: "Nusa Dua Leisure Day",
    location: "Nusa Dua",
    tag: "",
    departureTime: "10:00",
    returnTime: "18:00",
    description: ["Breakfast at hotel.", "Free program to enjoy the beach and resort facilities.", "Optional farewell dinner."],
    accommodations: ["Ayana Segara Bali / Resort View Room"],
    activities: ["Free Program"],
    transportation: [],
    visas: []
  },
  {
    title: "Departure",
    location: "Nusa Dua",
    tag: "Check-out",
    departureTime: "11:00",
    returnTime: "14:00",
    description: ["Breakfast at hotel.", "Check-out from hotel.", "Private transfer to airport.", "Departure from Bali."],
    accommodations: [],
    activities: [],
    transportation: ["Check Out / Nusa Dua Hotel -> Airport / Toyota Innova"],
    visas: []
  }
];

const isDayCollapsed = (dayNumber: number) => collapsedDayNumbers.value.includes(dayNumber);

const toggleDay = (dayNumber: number) => {
  collapsedDayNumbers.value = isDayCollapsed(dayNumber)
    ? collapsedDayNumbers.value.filter((item) => item !== dayNumber)
    : [...collapsedDayNumbers.value, dayNumber];
};

const expandAllDays = () => {
  collapsedDayNumbers.value = [];
};

const closeAllDays = () => {
  collapsedDayNumbers.value = outputDays.value.map((day) => day.dayNumber);
};

const outputPackageTitle = "Bali Signature Journey - Seminyak, Ubud, and Nusa Dua";

const outputPackageDescription = "A frontend preview package showing a complete Bali tour flow with connected accommodation, activity, transportation, VISA, and pricing options by guest type.";

const outputDays = computed<OutputDay[]>(() => sampleTourDays.map((day, index) => ({
  id: index + 1,
  dayNumber: index + 1,
  ...day
})));

const outputDurationDays = computed(() => outputDays.value.length);
const outputDurationNights = computed(() => outputDurationDays.value - 1);

const basePricing: Record<PriceKey, number> = {
  single: 15500000,
  double: 8625000,
  tripleA: 7925000,
  tripleB: 7537500,
  childNoBed: 3762500
};

const comboHotelSets = [
  [
    { day: "1 - 4", name: "Sankara Seminyak", room: "Deluxe Pool View", location: "Seminyak", stars: 4 },
    { day: "5 - 7", name: "Samaya Ubud", room: "Hill View Suite", location: "Ubud", stars: 5 },
    { day: "8 - 9", name: "Ayana Segara Bali", room: "Resort View Room", location: "Nusa Dua", stars: 5 }
  ],
  [
    { day: "1 - 4", name: "Maya Sanur Resort", room: "Lagoon Access", location: "Sanur", stars: 5 },
    { day: "5 - 7", name: "Samaya Ubud", room: "Ayung Villa", location: "Ubud", stars: 5 },
    { day: "8 - 9", name: "Ayana Segara Bali", room: "Ocean View Suite", location: "Nusa Dua", stars: 5 }
  ],
  [
    { day: "1 - 4", name: "Sunset Kuta Hotel", room: "Family Room", location: "Kuta", stars: 3 },
    { day: "5 - 7", name: "Bukit Bintang Grand", room: "Grand Deluxe", location: "Kuala Lumpur", stars: 5 },
    { day: "8 - 9", name: "Marina Bay Harbour Hotel", room: "Deluxe Bay", location: "Singapore", stars: 5 }
  ],
  [
    { day: "1 - 4", name: "Orchard City Hotel", room: "Club Room", location: "Singapore", stars: 4 },
    { day: "5 - 7", name: "KLCC Park Hotel", room: "Tower View", location: "Kuala Lumpur", stars: 4 },
    { day: "8 - 9", name: "Maya Sanur Resort", room: "Beachfront Suite", location: "Sanur", stars: 5 }
  ],
  [
    { day: "1 - 4", name: "Ayana Segara Bali", room: "Segara Residence", location: "Nusa Dua", stars: 5 },
    { day: "5 - 7", name: "Samaya Ubud", room: "Royal Courtyard Villa", location: "Ubud", stars: 5 },
    { day: "8 - 9", name: "Marina Bay Harbour Hotel", room: "Premier Suite", location: "Singapore", stars: 5 }
  ]
];

const comboRows = computed(() => {
  const multipliers = [1, 1.18, 1.34, 1.48, 1.65];
  return comboHotelSets.map((hotels, index) => ({
    code: `COMBO-0${index + 1}`,
    hotels,
    prices: [
      { key: "single", value: Math.round(basePricing.single * multipliers[index]) },
      { key: "double", value: Math.round(basePricing.double * multipliers[index]) },
      { key: "tripleA", value: index === 0 ? 0 : Math.round(basePricing.tripleA * multipliers[index]) },
      { key: "tripleB", value: index === 0 ? 0 : Math.round(basePricing.tripleB * multipliers[index]) },
      { key: "childNoBed", value: Math.round(basePricing.childNoBed * multipliers[index]) }
    ]
  }));
});

const hotelSummaryRows = computed(() => comboHotelSets[0].map((hotel, index) => ({
  id: index + 1,
  ...hotel
})));
</script>
