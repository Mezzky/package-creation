import { accommodationList, activityList, vehicleList, visaList, roomTypes, baliLocationList, countryList, regencyList, stateList, itineraryTagList, carTypeList, visaPermitOptionList, visaServiceOptionList } from "~/data/pricing";
import type { RoomTypeKey } from "~/data/pricing";

export type AccommodationPriceTypes = Record<RoomTypeKey, number>;
export type AccommodationAdditionalPrices = {
  extraBedAdult: number;
  extraBedChild: number;
  childNoBed: number;
};

const createAccommodationPriceTypes = (defaultPrice = 0, saved?: Partial<AccommodationPriceTypes>): AccommodationPriceTypes => ({
  single: amount(saved?.single ?? defaultPrice),
  double: amount(saved?.double ?? defaultPrice),
  tripleA: amount(saved?.tripleA ?? defaultPrice),
  tripleB: amount(saved?.tripleB ?? defaultPrice),
  childNoBed: amount(saved?.childNoBed ?? defaultPrice)
});

export type AccommodationRecord = {
  id: number;
  productId: string;
  countryId: string;
  regencyId: string;
  stateId: string;
  roomTypeId: string;
  additionalPrices: AccommodationAdditionalPrices;
  priceTypePrices: AccommodationPriceTypes;
  startDay: number;
  endDay: number;
  pricePerNight: number;
};

export type ActivityRecord = {
  id: number;
  productId: string;
  ticketId: string;
  nationality: "general" | "foreign" | "domestic" | "";
  ticketType: "general" | "adult" | "child" | "";
  includeTransport: boolean;
  dayNumber: number;
  price: number;
};

export type TransportationRecord = {
  id: number;
  dayNumber: number;
  serviceType: "full-day" | "check-in" | "check-out" | "";
  fromLocation: string;
  toLocation: string;
  carTypeId: string;
  totalPax: number;
  totalLuggage: number;
  price: number;
};

export type VisaRecord = {
  id: number;
  visaOptionId: string;
  serviceOptionId: string;
  price: number;
};

export type ItineraryDay = {
  id: number;
  dayNumber: number;
  locationId: string;
  departureTime: string;
  returnTime: string;
  tagId: string;
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
  priceTypePrices: AccommodationPriceTypes;
  startDay: number;
  endDay: number;
  pricePerNight: number;
};

type LinkedActivity = {
  recordId: number;
  productId: string;
  productName: string;
  ticketId: string;
  ticketName: string;
  nationality: string;
  ticketType: string;
  includeTransport: boolean;
  dayNumber: number;
  price: number;
};

type LinkedTransportation = {
  recordId: number;
  dayNumber: number;
  serviceType: string;
  fromLocation: string;
  toLocation: string;
  route: string;
  carType: string;
  totalPax: number;
  totalLuggage: number;
  price: number;
};

type LinkedVisa = {
  recordId: number;
  visaOptionId: string;
  visaOption: string;
  serviceOptionId: string;
  serviceOption: string;
  price: number;
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
};

type PricingReviewRow = {
  key: RoomTypeKey;
  label: string;
  accommodationTotal: number;
  otherProductsTotal: number;
  baseTotal: number;
  markup: number;
  total: number;
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
  const totalDays = ref(1);
  const totalNights = ref(0);
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
    locationId: "",
    departureTime: "",
    returnTime: "",
    tagId: "",
    title: "",
    description: "",
    collapsed: false
  });

  const syncItineraryDays = () => {
    const count = positiveDay(totalDays.value);
    totalDays.value = count;
    totalNights.value = Math.max(0, count - 1);

    while (itineraryDays.value.length < count) {
      itineraryDays.value.push(createDay(itineraryDays.value.length + 1));
    }
    if (itineraryDays.value.length > count) {
      itineraryDays.value = itineraryDays.value.slice(0, count);
    }
    itineraryDays.value.forEach((day, index) => {
      day.dayNumber = index + 1;
      if (day.dayNumber !== count && day.tagId === "check-out") day.tagId = "";
      if (day.dayNumber === count) day.tagId = "check-out";
    });

    accommodations.value.forEach((record) => {
      if (totalNights.value === 0) {
        record.startDay = 0;
        record.endDay = 0;
        return;
      }
      record.startDay = Math.min(totalNights.value, Math.max(1, record.startDay));
      record.endDay = Math.min(totalNights.value, Math.max(record.startDay, record.endDay));
    });
    syncAccommodationLocations();
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
      countryId: "",
      regencyId: "",
      stateId: "",
      roomTypeId: "",
      additionalPrices: { extraBedAdult: 0, extraBedChild: 0, childNoBed: 0 },
      priceTypePrices: createAccommodationPriceTypes(),
      startDay: totalNights.value > 0 ? 1 : 0,
      endDay: totalNights.value > 0 ? Math.min(2, totalNights.value) : 0,
      pricePerNight: 0
    });
    showToast("Accommodation record added.");
  };

  const addActivity = () => {
    activities.value.push({
      id: nextId(),
      productId: "",
      ticketId: "",
      nationality: "",
      ticketType: "",
      includeTransport: false,
      dayNumber: 1,
      price: 0
    });
    showToast("Activity record added.");
  };

  const addTransportation = () => {
    transportation.value.push({
      id: nextId(),
      dayNumber: 1,
      serviceType: "",
      fromLocation: "",
      toLocation: "",
      carTypeId: "",
      totalPax: 0,
      totalLuggage: 0,
      price: 0
    });
    showToast("Transportation record added.");
  };

  const addVisa = () => {
    visas.value.push({
      id: nextId(),
      visaOptionId: "",
      serviceOptionId: "",
      price: 0
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
      record.pricePerNight = 0;
      record.additionalPrices = { extraBedAdult: 0, extraBedChild: 0, childNoBed: 0 };
      record.priceTypePrices = createAccommodationPriceTypes();
      return;
    }
    if (!product.roomTypes.some((room) => room.id === record.roomTypeId)) {
      record.roomTypeId = product.roomTypes[0]?.id || "";
    }
    const room = product.roomTypes.find((item) => item.id === record.roomTypeId);
    record.pricePerNight = room?.pricePerNight || 0;
    record.additionalPrices = {
      extraBedAdult: room?.extraBedAdult || 0,
      extraBedChild: room?.extraBedChild || 0,
      childNoBed: room?.childNoBed || 0
    };
    record.priceTypePrices = {
      single: record.pricePerNight,
      double: record.pricePerNight,
      tripleA: record.pricePerNight + record.additionalPrices.extraBedAdult,
      tripleB: record.pricePerNight + record.additionalPrices.extraBedChild,
      childNoBed: record.additionalPrices.childNoBed
    };
    syncAccommodationLocations();
  };

  const applyActivityDefaults = (record: ActivityRecord) => {
    const product = activityList.find((item) => item.id === record.productId);
    if (!product) {
      record.ticketId = "";
      record.price = 0;
      return;
    }
    const matchingTickets = product.tickets.filter((ticket) => ticket.nationality === record.nationality && ticket.ticketType === record.ticketType);
    if (!matchingTickets.some((ticket) => ticket.id === record.ticketId)) record.ticketId = matchingTickets[0]?.id || "";
    const ticket = product.tickets.find((item) => item.id === record.ticketId);
    record.price = ticket?.price || 0;
  };

  const applyTransportationDefaults = (record: TransportationRecord) => {
    const car = carTypeList.find((item) => item.id === record.carTypeId);
    record.price = car?.price || 0;
    if (car) {
      if (!record.totalPax) record.totalPax = car.capacity;
      if (!record.totalLuggage) record.totalLuggage = car.luggage;
    }
  };

  const applyVisaDefaults = (record: VisaRecord) => {
    const permit = visaPermitOptionList.find((item) => item.id === record.visaOptionId);
    record.price = permit?.prices[record.serviceOptionId] || 0;
  };

  const accommodationNights = (record: AccommodationRecord) => {
    if (totalNights.value === 0) return 0;
    return Math.max(0, record.endDay - record.startDay + 1);
  };
  const accommodationAppliesToDay = (record: AccommodationRecord, dayNumber: number) => {
    return dayNumber < totalDays.value && dayNumber >= record.startDay && dayNumber <= record.endDay;
  };

  const syncAccommodationLocations = () => {
    itineraryDays.value.forEach((day) => {
      const linkedAccommodation = accommodations.value.find((record) => {
        return Boolean(record.productId && record.stateId) && accommodationAppliesToDay(record, day.dayNumber);
      });
      day.locationId = linkedAccommodation?.stateId || "";
    });
  };

  const accommodationCost = (record: AccommodationRecord) => amount(record.pricePerNight) * accommodationNights(record);
  const accommodationSelling = (record: AccommodationRecord) => accommodationCost(record);
  const activityCost = (record: ActivityRecord) => amount(record.price);
  const activitySelling = (record: ActivityRecord) => activityCost(record);
  const transportCost = (record: TransportationRecord) => amount(record.price);
  const transportSelling = (record: TransportationRecord) => transportCost(record);
  const visaCost = (record: VisaRecord) => amount(record.price);
  const visaSelling = (record: VisaRecord) => visaCost(record);

  const priceGroup = (cost: number, selling: number): PricingGroup => ({ cost, selling });

  const accommodationRoomPrice = (record: AccommodationRecord, priceType: RoomTypeKey) => {
    return amount(record.priceTypePrices[priceType]) * accommodationNights(record);
  };

  const accommodationPaxPrice = (record: AccommodationRecord, priceType: RoomTypeKey) => {
    const divisors: Record<RoomTypeKey, number> = {
      single: 1,
      double: 2,
      tripleA: 3,
      tripleB: 3,
      childNoBed: 1
    };
    return Math.round(accommodationRoomPrice(record, priceType) / divisors[priceType]);
  };

  const accommodationPaxTotal = (priceType: RoomTypeKey) => {
    return accommodations.value.reduce((sum, record) => sum + accommodationPaxPrice(record, priceType), 0);
  };

  const otherProductsPaxTotal = computed(() => {
    const activityTotal = activities.value.reduce((sum, record) => sum + activitySelling(record), 0);
    const visaTotal = visas.value.reduce((sum, record) => sum + visaSelling(record), 0);
    const transportTotal = transportation.value.reduce((sum, record) => {
      const divisor = Math.max(1, Number(record.totalPax) || 1);
      return sum + Math.round(transportSelling(record) / divisor);
    }, 0);
    return activityTotal + visaTotal + transportTotal;
  });

  const pricingReviewRows = computed<PricingReviewRow[]>(() => roomTypes.map((priceType) => {
    const accommodationTotal = accommodationPaxTotal(priceType.key);
    const otherProductsTotal = otherProductsPaxTotal.value;
    const baseTotal = accommodationTotal + otherProductsTotal;
    const markup = baseTotal * (amount(markupPercent.value) / 100);
    return {
      key: priceType.key,
      label: priceType.label,
      accommodationTotal,
      otherProductsTotal,
      baseTotal,
      markup,
      total: baseTotal + markup
    };
  }));

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
      profit: sellingPrice - totalCost
    };
  });

  const referencesForDay = (dayNumber: number): PackageReferences => ({
    accommodations: dayNumber === totalDays.value ? [] : accommodations.value.filter((item) => accommodationAppliesToDay(item, dayNumber)),
    activities: activities.value.filter((item) => item.dayNumber === dayNumber),
    transportation: transportation.value.filter((item) => item.dayNumber === dayNumber)
  });

  const getAccommodationName = (id: string) => accommodationList.find((item) => item.id === id)?.name || "No accommodation selected";
  const getActivityName = (id: string) => activityList.find((item) => item.id === id)?.name || "No activity selected";
  const getVehicleName = (id: string) => vehicleList.find((item) => item.id === id)?.name || "No transportation selected";
  const getVisaName = (id: string) => visaList.find((item) => item.id === id)?.name || "No VISA selected";
  const getHotelRoomTypeName = (productId: string, roomTypeId: string) => accommodationList.find((item) => item.id === productId)?.roomTypes.find((room) => room.id === roomTypeId)?.name || "No room type selected";
  const getLocationName = (id: string) => baliLocationList.find((item) => item.id === id)?.name || "";
  const getTagLabel = (id: string) => itineraryTagList.find((item) => item.id === id)?.label || "";
  const getTicketName = (productId: string, ticketId: string) => activityList.find((item) => item.id === productId)?.tickets.find((ticket) => ticket.id === ticketId)?.name || "No ticket selected";
  const getCarTypeName = (id: string) => carTypeList.find((item) => item.id === id)?.name || "No car type selected";
  const getVisaPermitLabel = (id: string) => visaPermitOptionList.find((item) => item.id === id)?.label || "No visa option selected";
  const getVisaServiceLabel = (id: string) => visaServiceOptionList.find((item) => item.id === id)?.label || "No service option selected";

  const linkedVisas = (): LinkedVisa[] => visas.value.map((item) => ({
    recordId: item.id,
    visaOptionId: item.visaOptionId,
    visaOption: getVisaPermitLabel(item.visaOptionId),
    serviceOptionId: item.serviceOptionId,
    serviceOption: getVisaServiceLabel(item.serviceOptionId),
    price: item.price
  }));

  const linkedProductsForDay = (dayNumber: number): LinkedDayProducts => {
    const refs = referencesForDay(dayNumber);
    return {
      accommodations: refs.accommodations.map((item) => ({
        recordId: item.id,
        productId: item.productId,
        productName: getAccommodationName(item.productId),
        roomType: getHotelRoomTypeName(item.productId, item.roomTypeId),
        priceTypePrices: item.priceTypePrices,
        startDay: item.startDay,
        endDay: item.endDay,
        pricePerNight: item.pricePerNight
      })),
      activities: refs.activities.map((item) => ({
        recordId: item.id,
        productId: item.productId,
        productName: getActivityName(item.productId),
        ticketId: item.ticketId,
        ticketName: getTicketName(item.productId, item.ticketId),
        nationality: item.nationality,
        ticketType: item.ticketType,
        includeTransport: item.includeTransport,
        dayNumber: item.dayNumber,
        price: item.price
      })),
      transportation: refs.transportation.map((item) => {
        const fromLocation = item.fromLocation || "From";
        const toLocation = item.toLocation || "To";
        return {
          recordId: item.id,
          dayNumber: item.dayNumber,
          serviceType: item.serviceType,
          fromLocation,
          toLocation,
          route: `${fromLocation} -> ${toLocation}`,
          carType: getCarTypeName(item.carTypeId),
          totalPax: item.totalPax,
          totalLuggage: item.totalLuggage,
          price: item.price
        };
      }),
      visas: dayNumber === 1 ? linkedVisas() : []
    };
  };

  const frontendPackage = computed(() => ({
    package: {
      name: packageName.value || "Untitled Package",
      duration: `${totalDays.value} Days / ${totalNights.value} Nights`
    },
    pricing: totals.value,
    accommodationSummary: accommodations.value.map((item) => ({
      product: getAccommodationName(item.productId),
      roomType: getHotelRoomTypeName(item.productId, item.roomTypeId),
      priceTypePrices: item.priceTypePrices,
      pricingBasis: "Selected hotel room type per night with editable price type rates",
      startDay: item.startDay,
      endDay: item.endDay,
      nights: accommodationNights(item),
      pricePerNight: item.pricePerNight,
      totalPrice: accommodationCost(item)
    })),
    activitySummary: activities.value.map((item) => ({
      product: getActivityName(item.productId),
      ticketType: getTicketName(item.productId, item.ticketId),
      nationality: item.nationality,
      includeTransport: item.includeTransport,
      dayNumber: item.dayNumber,
      serviceType: item.serviceType,
      price: item.price
    })),
    transportationSummary: transportation.value.map((item) => ({
      dayNumber: item.dayNumber,
      fromLocation: item.fromLocation,
      toLocation: item.toLocation,
      carType: getCarTypeName(item.carTypeId),
      totalPax: item.totalPax,
      totalLuggage: item.totalLuggage,
      price: item.price
    })),
    visaSummary: visas.value.map((item) => ({
      visaOption: getVisaPermitLabel(item.visaOptionId),
      serviceOption: getVisaServiceLabel(item.serviceOptionId),
      price: item.price
    })),
    itinerary: itineraryDays.value.map((day) => ({
      dayNumber: day.dayNumber,
      location: getLocationName(day.locationId) || null,
      departureTime: day.departureTime || null,
      returnTime: day.returnTime || null,
      tag: getTagLabel(day.tagId) || null,
      title: day.title,
      description: day.description,
      linkedProducts: linkedProductsForDay(day.dayNumber)
    }))
  }));

  const createPackageOutput = () => {
    packageOutput.value = [
      packageName.value || "Untitled Package",
      `${totalDays.value} Days / ${totalNights.value} Nights`,
      "",
      "Pricing Summary",
      `Total cost: ${formatIdr(totals.value.totalCost)}`,
      `Product selling subtotal: ${formatIdr(totals.value.productSellingSubtotal)}`,
      `Markup: ${formatIdr(totals.value.markup)}`,
      `Package selling price: ${formatIdr(totals.value.sellingPrice)}`,
      "",
      ...itineraryDays.value.flatMap((day) => {
        const refs = referencesForDay(day.dayNumber);
        return [
          `Day ${day.dayNumber}: ${day.title || "Untitled day"}`,
          `Location: ${getLocationName(day.locationId) || "None"}`,
          `Departure time: ${day.departureTime || "None"}`,
          `Return time: ${day.returnTime || "None"}`,
          `Tag: ${getTagLabel(day.tagId) || "None"}`,
          day.description || "No description",
          `Accommodation: ${refs.accommodations.map((item) => getAccommodationName(item.productId)).join(", ") || "None"}`,
          `Activities: ${refs.activities.map((item) => `${getActivityName(item.productId)} (${getTicketName(item.productId, item.ticketId)})`).join(", ") || "None"}`,
          `Transportation: ${refs.transportation.map((item) => `${item.fromLocation || "From"} -> ${item.toLocation || "To"} (${getCarTypeName(item.carTypeId)}, ${item.totalPax} pax, ${item.totalLuggage} luggage)`).join(", ") || "None"}`,
          `VISA: ${visas.value.map((item) => `${getVisaPermitLabel(item.visaOptionId)} / ${getVisaServiceLabel(item.serviceOptionId)}`).join(", ") || "None"}`
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
    totalDays.value = 1;
    totalNights.value = 0;
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
    totalDays: totalDays.value,
    totalNights: totalNights.value,
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
    locationId: day.locationId || "",
    departureTime: day.departureTime || "",
    returnTime: day.returnTime || "",
    tagId: day.tagId || "",
    title: day.title || "",
    description: day.description || "",
    collapsed: Boolean(day.collapsed)
  });

  const normalizeAccommodation = (record: Partial<AccommodationRecord> & { priceType?: string; roomType?: string; quantity?: number; supplierCost?: number; sellingPrice?: number }): AccommodationRecord => {
    const pricePerNight = amount(Number(record.pricePerNight ?? record.sellingPrice ?? record.supplierCost) || 0);
    return {
      id: Number(record.id) || nextId(),
      productId: record.productId || "",
      countryId: record.countryId || accommodationList.find((hotel) => hotel.id === record.productId)?.countryId || "",
      regencyId: record.regencyId || accommodationList.find((hotel) => hotel.id === record.productId)?.regencyId || "",
      stateId: record.stateId || accommodationList.find((hotel) => hotel.id === record.productId)?.stateId || "",
      roomTypeId: record.roomTypeId || record.roomType || "",
      additionalPrices: {
        extraBedAdult: amount(record.additionalPrices?.extraBedAdult || 0),
        extraBedChild: amount(record.additionalPrices?.extraBedChild || 0),
        childNoBed: amount(record.additionalPrices?.childNoBed || 0)
      },
      priceTypePrices: createAccommodationPriceTypes(pricePerNight, record.priceTypePrices),
      startDay: positiveDay(Number(record.startDay) || 1),
      endDay: positiveDay(Number(record.endDay) || Number(record.startDay) || 1),
      pricePerNight
    };
  };

  const normalizeActivity = (record: Partial<ActivityRecord> & { quantity?: number; supplierCost?: number; sellingPrice?: number }): ActivityRecord => ({
    id: Number(record.id) || nextId(),
    productId: record.productId || "",
    ticketId: record.ticketId || "",
    nationality: record.nationality || "",
    ticketType: record.ticketType || "",
    includeTransport: Boolean(record.includeTransport),
    dayNumber: positiveDay(Number(record.dayNumber) || 1),
    price: amount(Number(record.price ?? record.sellingPrice ?? record.supplierCost) || 0)
  });

  const normalizeTransportation = (record: Partial<TransportationRecord> & { productId?: string; quantity?: number; supplierCost?: number; sellingPrice?: number }): TransportationRecord => ({
    id: Number(record.id) || nextId(),
    dayNumber: positiveDay(Number(record.dayNumber) || 1),
    serviceType: record.serviceType || "",
    fromLocation: record.fromLocation || "",
    toLocation: record.toLocation || "",
    carTypeId: record.carTypeId || record.productId || "",
    totalPax: amount(Number(record.totalPax ?? record.quantity) || 0),
    totalLuggage: amount(Number(record.totalLuggage) || 0),
    price: amount(Number(record.price ?? record.sellingPrice ?? record.supplierCost) || 0)
  });

  const normalizeVisa = (record: Partial<VisaRecord> & { productId?: string; quantity?: number; supplierCost?: number; sellingPrice?: number }): VisaRecord => ({
    id: Number(record.id) || nextId(),
    visaOptionId: record.visaOptionId || record.productId || "",
    serviceOptionId: record.serviceOptionId || "",
    price: amount(Number(record.price ?? record.sellingPrice ?? record.supplierCost) || 0)
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
      totalDays.value = positiveDay(Number(saved.totalDays) || 1);
      totalNights.value = Math.max(0, totalDays.value - 1);
      markupPercent.value = amount(Number(saved.markupPercent) || 0);
      accommodations.value = (saved.accommodations || []).map(normalizeAccommodation);
      activities.value = (saved.activities || []).map(normalizeActivity);
      transportation.value = (saved.transportation || []).map(normalizeTransportation);
      visas.value = (saved.visas || []).map(normalizeVisa);
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
    syncAccommodationLocations();
    watch(accommodations, syncAccommodationLocations, { deep: true });
    watch(serializableState, (value) => {
      if (restored.value) localStorage.setItem(storageKey, JSON.stringify(value));
    }, { deep: true });
  });

  return {
    accommodationList,
    countryList,
    regencyList,
    stateList,
    activityList,
    carTypeList,
    visaPermitOptionList,
    visaServiceOptionList,
    baliLocationList,
    itineraryTagList,
    roomTypes,
    packageName,
    totalDays,
    totalNights,
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
    pricingReviewRows,
    otherProductsPaxTotal,
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
    getTicketName,
    getCarTypeName,
    getVisaPermitLabel,
    getVisaServiceLabel,
    getLocationName,
    getTagLabel,
    getHotelRoomTypeName,
    createPackageOutput,
    copyFrontendJson,
    printPackage,
    resetBuilder,
    formatCurrency: formatIdr
  };
};
