import { accommodationList, activityList, vehicleList, visaList, roomTypes } from "~/data/pricing";

export type AccommodationRecord = {
  id: number;
  productId: string;
  roomType: string;
  startDay: number;
  endDay: number;
  quantity: number;
  supplierCost: number;
  sellingPrice: number;
};

export type ActivityRecord = {
  id: number;
  productId: string;
  dayNumber: number;
  quantity: number;
  supplierCost: number;
  sellingPrice: number;
};

export type TransportationRecord = {
  id: number;
  dayNumber: number;
  fromLocation: string;
  toLocation: string;
  productId: string;
  quantity: number;
  supplierCost: number;
  sellingPrice: number;
};

export type VisaRecord = {
  id: number;
  productId: string;
  quantity: number;
  supplierCost: number;
  sellingPrice: number;
};

export type ItineraryDay = {
  id: number;
  dayNumber: number;
  title: string;
  description: string;
  collapsed: boolean;
};

export type PackageReferences = {
  accommodations: AccommodationRecord[];
  activities: ActivityRecord[];
  transportation: TransportationRecord[];
};

type LinkedAccommodation = {
  recordId: number;
  productId: string;
  productName: string;
  roomType: string;
  startDay: number;
  endDay: number;
  quantity: number;
};

type LinkedActivity = {
  recordId: number;
  productId: string;
  productName: string;
  dayNumber: number;
  quantity: number;
};

type LinkedTransportation = {
  recordId: number;
  productId: string;
  productName: string;
  dayNumber: number;
  fromLocation: string;
  toLocation: string;
  route: string;
  quantity: number;
};

type LinkedVisa = {
  recordId: number;
  productId: string;
  productName: string;
  quantity: number;
};

export type LinkedDayProducts = {
  accommodations: LinkedAccommodation[];
  activities: LinkedActivity[];
  transportation: LinkedTransportation[];
  visas: LinkedVisa[];
};

type PricingGroup = {
  cost: number;
  selling: number;
};

type PricingTotals = {
  accommodation: PricingGroup;
  activity: PricingGroup;
  transport: PricingGroup;
  visa: PricingGroup;
  totalCost: number;
  productSellingSubtotal: number;
  markup: number;
  sellingPrice: number;
  profit: number;
  pricePerGuest: number;
};

const storageKey = "luxbali-centralized-package-builder-v1";

const formatIdr = (value: number) => new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
}).format(Math.round(value || 0));

const amount = (value: number) => Math.max(0, Number.isFinite(value) ? value : 0);
const positiveDay = (value: number, fallback = 1) => Math.max(1, Number.isFinite(value) ? value : fallback);

export const useItineraryPackageBuilder = () => {
  const packageName = ref("");
  const destination = ref("Bali");
  const totalDays = ref(1);
  const totalNights = ref(0);
  const guestCount = ref(0);
  const markupPercent = ref(0);
  const accommodations = ref<AccommodationRecord[]>([]);
  const activities = ref<ActivityRecord[]>([]);
  const transportation = ref<TransportationRecord[]>([]);
  const visas = ref<VisaRecord[]>([]);
  const itineraryDays = ref<ItineraryDay[]>([]);
  const packageOutput = ref("");
  const toastMessage = ref("");
  const toastVisible = ref(false);
  const recordCounter = ref(0);
  const restored = ref(false);

  const nextId = () => {
    recordCounter.value += 1;
    return recordCounter.value;
  };

  const createDay = (dayNumber: number): ItineraryDay => ({
    id: nextId(),
    dayNumber,
    title: "",
    description: "",
    collapsed: false
  });

  const syncItineraryDays = () => {
    const count = positiveDay(totalDays.value);
    totalDays.value = count;
    totalNights.value = Math.max(0, Math.min(totalNights.value, count - 1));

    while (itineraryDays.value.length < count) {
      itineraryDays.value.push(createDay(itineraryDays.value.length + 1));
    }
    if (itineraryDays.value.length > count) {
      itineraryDays.value = itineraryDays.value.slice(0, count);
    }
    itineraryDays.value.forEach((day, index) => {
      day.dayNumber = index + 1;
    });
  };

  const setTotalDays = (value: number) => {
    totalDays.value = positiveDay(value);
    syncItineraryDays();
  };

  const setTotalNights = (value: number) => {
    totalNights.value = Math.max(0, Math.min(amount(value), Math.max(0, totalDays.value - 1)));
  };

  const addAccommodation = () => {
    accommodations.value.push({
      id: nextId(),
      productId: "",
      roomType: "",
      startDay: 1,
      endDay: Math.min(2, totalDays.value),
      quantity: 0,
      supplierCost: 0,
      sellingPrice: 0
    });
    showToast("Accommodation record added.");
  };

  const addActivity = () => {
    activities.value.push({
      id: nextId(),
      productId: "",
      dayNumber: 1,
      quantity: guestCount.value,
      supplierCost: 0,
      sellingPrice: 0
    });
    showToast("Activity record added.");
  };

  const addTransportation = () => {
    transportation.value.push({
      id: nextId(),
      dayNumber: 1,
      fromLocation: "",
      toLocation: "",
      productId: "",
      quantity: 1,
      supplierCost: 0,
      sellingPrice: 0
    });
    showToast("Transportation record added.");
  };

  const addVisa = () => {
    visas.value.push({
      id: nextId(),
      productId: "",
      quantity: guestCount.value,
      supplierCost: 0,
      sellingPrice: 0
    });
    showToast("VISA record added.");
  };

  const removeRecord = (kind: "accommodation" | "activity" | "transport" | "visa", id: number) => {
    if (kind === "accommodation") accommodations.value = accommodations.value.filter((item) => item.id !== id);
    if (kind === "activity") activities.value = activities.value.filter((item) => item.id !== id);
    if (kind === "transport") transportation.value = transportation.value.filter((item) => item.id !== id);
    if (kind === "visa") visas.value = visas.value.filter((item) => item.id !== id);
  };

  const applyAccommodationDefaults = (record: AccommodationRecord) => {
    const product = accommodationList.find((item) => item.id === record.productId);
    if (!product) {
      record.supplierCost = 0;
      record.sellingPrice = 0;
      return;
    }
    if (!record.roomType) record.roomType = "double";
    const base = product.rates[record.roomType as keyof typeof product.rates] || 0;
    record.supplierCost = base;
    record.sellingPrice = base;
  };

  const applyActivityDefaults = (record: ActivityRecord) => {
    const product = activityList.find((item) => item.id === record.productId);
    record.supplierCost = product?.price || 0;
    record.sellingPrice = product?.price || 0;
    if (!record.quantity) record.quantity = guestCount.value;
  };

  const applyTransportationDefaults = (record: TransportationRecord) => {
    const product = vehicleList.find((item) => item.id === record.productId);
    record.supplierCost = product?.rate || 0;
    record.sellingPrice = product?.rate || 0;
    if (!record.quantity) record.quantity = 1;
  };

  const applyVisaDefaults = (record: VisaRecord) => {
    const product = visaList.find((item) => item.id === record.productId);
    record.supplierCost = product?.fee || 0;
    record.sellingPrice = product?.fee || 0;
    if (!record.quantity) record.quantity = guestCount.value;
  };

  const accommodationNights = (record: AccommodationRecord) => Math.max(0, positiveDay(record.endDay, record.startDay) - positiveDay(record.startDay));
  const accommodationAppliesToDay = (record: AccommodationRecord, dayNumber: number) => {
    return dayNumber >= positiveDay(record.startDay) && dayNumber <= positiveDay(record.endDay);
  };

  const lineTotal = (quantity: number, unitPrice: number, multiplier = 1) => amount(quantity) * amount(unitPrice) * amount(multiplier);
  const accommodationCost = (record: AccommodationRecord) => lineTotal(record.quantity, record.supplierCost, accommodationNights(record));
  const accommodationSelling = (record: AccommodationRecord) => lineTotal(record.quantity, record.sellingPrice, accommodationNights(record));
  const activityCost = (record: ActivityRecord) => lineTotal(record.quantity, record.supplierCost);
  const activitySelling = (record: ActivityRecord) => lineTotal(record.quantity, record.sellingPrice);
  const transportCost = (record: TransportationRecord) => lineTotal(record.quantity, record.supplierCost);
  const transportSelling = (record: TransportationRecord) => lineTotal(record.quantity, record.sellingPrice);
  const visaCost = (record: VisaRecord) => lineTotal(record.quantity, record.supplierCost);
  const visaSelling = (record: VisaRecord) => lineTotal(record.quantity, record.sellingPrice);

  const priceGroup = (cost: number, selling: number): PricingGroup => ({ cost, selling });

  const totals = computed<PricingTotals>(() => {
    const accommodation = priceGroup(
      accommodations.value.reduce((sum, item) => sum + accommodationCost(item), 0),
      accommodations.value.reduce((sum, item) => sum + accommodationSelling(item), 0)
    );
    const activity = priceGroup(
      activities.value.reduce((sum, item) => sum + activityCost(item), 0),
      activities.value.reduce((sum, item) => sum + activitySelling(item), 0)
    );
    const transport = priceGroup(
      transportation.value.reduce((sum, item) => sum + transportCost(item), 0),
      transportation.value.reduce((sum, item) => sum + transportSelling(item), 0)
    );
    const visa = priceGroup(
      visas.value.reduce((sum, item) => sum + visaCost(item), 0),
      visas.value.reduce((sum, item) => sum + visaSelling(item), 0)
    );
    const totalCost = accommodation.cost + activity.cost + transport.cost + visa.cost;
    const productSellingSubtotal = accommodation.selling + activity.selling + transport.selling + visa.selling;
    const markup = totalCost * (amount(markupPercent.value) / 100);
    const sellingPrice = productSellingSubtotal || totalCost + markup;

    return {
      accommodation,
      activity,
      transport,
      visa,
      totalCost,
      productSellingSubtotal,
      markup,
      sellingPrice,
      profit: sellingPrice - totalCost,
      pricePerGuest: guestCount.value > 0 ? sellingPrice / guestCount.value : 0
    };
  });

  const referencesForDay = (dayNumber: number): PackageReferences => ({
    accommodations: accommodations.value.filter((item) => accommodationAppliesToDay(item, dayNumber)),
    activities: activities.value.filter((item) => item.dayNumber === dayNumber),
    transportation: transportation.value.filter((item) => item.dayNumber === dayNumber)
  });

  const getAccommodationName = (id: string) => accommodationList.find((item) => item.id === id)?.name || "No accommodation selected";
  const getActivityName = (id: string) => activityList.find((item) => item.id === id)?.name || "No activity selected";
  const getVehicleName = (id: string) => vehicleList.find((item) => item.id === id)?.name || "No transportation selected";
  const getVisaName = (id: string) => visaList.find((item) => item.id === id)?.name || "No VISA selected";
  const getRoomLabel = (key: string) => roomTypes.find((item) => item.key === key)?.label || "No room type";

  const linkedVisas = (): LinkedVisa[] => visas.value.map((item) => ({
    recordId: item.id,
    productId: item.productId,
    productName: getVisaName(item.productId),
    quantity: item.quantity
  }));

  const linkedProductsForDay = (dayNumber: number): LinkedDayProducts => {
    const refs = referencesForDay(dayNumber);
    return {
      accommodations: refs.accommodations.map((item) => ({
        recordId: item.id,
        productId: item.productId,
        productName: getAccommodationName(item.productId),
        roomType: getRoomLabel(item.roomType),
        startDay: item.startDay,
        endDay: item.endDay,
        quantity: item.quantity
      })),
      activities: refs.activities.map((item) => ({
        recordId: item.id,
        productId: item.productId,
        productName: getActivityName(item.productId),
        dayNumber: item.dayNumber,
        quantity: item.quantity
      })),
      transportation: refs.transportation.map((item) => {
        const fromLocation = item.fromLocation || "From";
        const toLocation = item.toLocation || "To";
        return {
          recordId: item.id,
          productId: item.productId,
          productName: getVehicleName(item.productId),
          dayNumber: item.dayNumber,
          fromLocation,
          toLocation,
          route: `${fromLocation} -> ${toLocation}`,
          quantity: item.quantity
        };
      }),
      visas: linkedVisas()
    };
  };

  const frontendPackage = computed(() => ({
    package: {
      name: packageName.value || "Untitled Package",
      destination: destination.value,
      duration: `${totalDays.value} Days / ${totalNights.value} Nights`,
      guests: guestCount.value
    },
    pricing: totals.value,
    accommodationSummary: accommodations.value.map((item) => ({
      product: getAccommodationName(item.productId),
      roomType: getRoomLabel(item.roomType),
      startDay: item.startDay,
      endDay: item.endDay,
      nights: accommodationNights(item),
      quantity: item.quantity,
      supplierCost: item.supplierCost,
      sellingPrice: item.sellingPrice
    })),
    activitySummary: activities.value.map((item) => ({
      product: getActivityName(item.productId),
      dayNumber: item.dayNumber,
      quantity: item.quantity,
      supplierCost: item.supplierCost,
      sellingPrice: item.sellingPrice
    })),
    transportationSummary: transportation.value.map((item) => ({
      product: getVehicleName(item.productId),
      dayNumber: item.dayNumber,
      fromLocation: item.fromLocation,
      toLocation: item.toLocation,
      quantity: item.quantity,
      supplierCost: item.supplierCost,
      sellingPrice: item.sellingPrice
    })),
    visaSummary: visas.value.map((item) => ({
      product: getVisaName(item.productId),
      quantity: item.quantity,
      supplierCost: item.supplierCost,
      sellingPrice: item.sellingPrice
    })),
    itinerary: itineraryDays.value.map((day) => ({
      dayNumber: day.dayNumber,
      title: day.title,
      description: day.description,
      linkedProducts: linkedProductsForDay(day.dayNumber)
    }))
  }));

  const createPackageOutput = () => {
    packageOutput.value = [
      packageName.value || "Untitled Package",
      `${totalDays.value} Days / ${totalNights.value} Nights`,
      `${guestCount.value} guests`,
      "",
      "Pricing Summary",
      `Total cost: ${formatIdr(totals.value.totalCost)}`,
      `Product selling subtotal: ${formatIdr(totals.value.productSellingSubtotal)}`,
      `Markup: ${formatIdr(totals.value.markup)}`,
      `Package selling price: ${formatIdr(totals.value.sellingPrice)}`,
      `Price per guest: ${formatIdr(totals.value.pricePerGuest)}`,
      "",
      ...itineraryDays.value.flatMap((day) => {
        const refs = referencesForDay(day.dayNumber);
        return [
          `Day ${day.dayNumber}: ${day.title || "Untitled day"}`,
          day.description || "No description",
          `Accommodation: ${refs.accommodations.map((item) => getAccommodationName(item.productId)).join(", ") || "None"}`,
          `Activities: ${refs.activities.map((item) => getActivityName(item.productId)).join(", ") || "None"}`,
          `Transportation: ${refs.transportation.map((item) => `${item.fromLocation || "From"} -> ${item.toLocation || "To"}`).join(", ") || "None"}`,
          `VISA: ${visas.value.map((item) => getVisaName(item.productId)).join(", ") || "None"}`
        ];
      })
    ].join("\n");
    showToast("Package output generated.");
  };

  const copyFrontendJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(frontendPackage.value, null, 2));
      showToast("Frontend package JSON copied.");
    } catch {
      showToast("Copy failed. Generate output and copy manually.");
    }
  };

  const printPackage = () => {
    if (!packageOutput.value) createPackageOutput();
    window.print();
  };

  const resetBuilder = () => {
    packageName.value = "";
    destination.value = "Bali";
    totalDays.value = 1;
    totalNights.value = 0;
    guestCount.value = 0;
    markupPercent.value = 0;
    accommodations.value = [];
    activities.value = [];
    transportation.value = [];
    visas.value = [];
    itineraryDays.value = [];
    recordCounter.value = 0;
    packageOutput.value = "";
    syncItineraryDays();
    showToast("Package builder reset.");
  };

  const showToast = (message: string) => {
    toastMessage.value = message;
    toastVisible.value = true;
    window.clearTimeout((showToast as typeof showToast & { timer?: number }).timer);
    (showToast as typeof showToast & { timer?: number }).timer = window.setTimeout(() => {
      toastVisible.value = false;
    }, 1900);
  };

  const serializableState = computed(() => ({
    packageName: packageName.value,
    destination: destination.value,
    totalDays: totalDays.value,
    totalNights: totalNights.value,
    guestCount: guestCount.value,
    markupPercent: markupPercent.value,
    accommodations: accommodations.value,
    activities: activities.value,
    transportation: transportation.value,
    visas: visas.value,
    itineraryDays: itineraryDays.value,
    recordCounter: recordCounter.value,
    packageOutput: packageOutput.value
  }));

  const normalizeDay = (day: Partial<ItineraryDay>, index: number): ItineraryDay => ({
    id: Number(day.id) || nextId(),
    dayNumber: index + 1,
    title: day.title || "",
    description: day.description || "",
    collapsed: Boolean(day.collapsed)
  });

  const restoreState = () => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      syncItineraryDays();
      restored.value = true;
      return;
    }
    try {
      const saved = JSON.parse(raw);
      packageName.value = saved.packageName || "";
      destination.value = saved.destination || "Bali";
      totalDays.value = positiveDay(Number(saved.totalDays) || 1);
      totalNights.value = amount(Number(saved.totalNights) || 0);
      guestCount.value = amount(Number(saved.guestCount) || 0);
      markupPercent.value = amount(Number(saved.markupPercent) || 0);
      accommodations.value = saved.accommodations || [];
      activities.value = saved.activities || [];
      transportation.value = saved.transportation || [];
      visas.value = saved.visas || [];
      itineraryDays.value = saved.itineraryDays?.length ? saved.itineraryDays.map(normalizeDay) : [];
      recordCounter.value = Number(saved.recordCounter) || 0;
      packageOutput.value = saved.packageOutput || "";
      syncItineraryDays();
      recordCounter.value = Math.max(recordCounter.value, ...[
        ...accommodations.value.map((item) => item.id),
        ...activities.value.map((item) => item.id),
        ...transportation.value.map((item) => item.id),
        ...visas.value.map((item) => item.id),
        ...itineraryDays.value.map((item) => item.id)
      ]);
    } catch {
      localStorage.removeItem(storageKey);
      syncItineraryDays();
    } finally {
      restored.value = true;
    }
  };

  onMounted(() => {
    restoreState();
    watch(serializableState, (value) => {
      if (restored.value) localStorage.setItem(storageKey, JSON.stringify(value));
    }, { deep: true });
  });

  return {
    accommodationList,
    activityList,
    vehicleList,
    visaList,
    roomTypes,
    packageName,
    destination,
    totalDays,
    totalNights,
    guestCount,
    markupPercent,
    accommodations,
    activities,
    transportation,
    visas,
    itineraryDays,
    packageOutput,
    toastMessage,
    toastVisible,
    totals,
    frontendPackage,
    setTotalDays,
    setTotalNights,
    addAccommodation,
    addActivity,
    addTransportation,
    addVisa,
    removeRecord,
    applyAccommodationDefaults,
    applyActivityDefaults,
    applyTransportationDefaults,
    applyVisaDefaults,
    accommodationNights,
    accommodationCost,
    accommodationSelling,
    activityCost,
    activitySelling,
    transportCost,
    transportSelling,
    visaCost,
    visaSelling,
    referencesForDay,
    linkedProductsForDay,
    getAccommodationName,
    getActivityName,
    getVehicleName,
    getVisaName,
    getRoomLabel,
    createPackageOutput,
    copyFrontendJson,
    printPackage,
    resetBuilder,
    formatCurrency: formatIdr
  };
};
