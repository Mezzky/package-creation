import { accommodationList, activityList, roomTypes, vehicleList, visaList, type Hotel, type RoomTypeKey } from "~/data/pricing";

type RoomRateState = {
  units: number;
  rate: number;
  category: string;
};

export type HotelState = {
  uid: number;
  name: string;
  hotelId: string;
  category: string;
  stars: string;
  mealPlan: number;
  nights: number;
  childRateLink: RoomTypeKey;
  rates: Record<RoomTypeKey, RoomRateState>;
  collapsed: boolean;
};

const storageKey = "luxbali-nuxt-package-pricing-v1";

const defaultRates = (): Record<RoomTypeKey, RoomRateState> => ({
  single: { units: 0, rate: 0, category: "" },
  double: { units: 0, rate: 0, category: "" },
  tripleA: { units: 0, rate: 0, category: "" },
  tripleB: { units: 0, rate: 0, category: "" },
  childNoBed: { units: 0, rate: 0, category: "" }
});

export const formatCurrency = (value: number) => new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
}).format(Math.round(value || 0));

export const usePackagePricing = () => {
  const packageName = ref("");
  const adultCount = ref(0);
  const childCount = ref(0);
  const infantCount = ref(0);
  const nightCount = ref(0);
  const hotels = ref<HotelState[]>([]);
  const hotelCounter = ref(0);

  const visaType = ref("");
  const visaFee = ref(0);
  const visaServiceFee = ref(0);
  const visaExpress = ref(false);

  const selectedActivities = ref<Record<string, boolean>>(
    Object.fromEntries(activityList.map((activity) => [activity.id, false]))
  );
  const privateGuideFee = ref(0);
  const activityBuffer = ref(0);

  const vehicleType = ref("");
  const vehicleQty = ref(0);
  const transportDays = ref(0);
  const vehicleRate = ref(0);
  const airportTransferFee = ref(0);
  const parkingFuelFee = ref(0);
  const includeAirportTransfer = ref(false);

  const markupPercent = ref(0);
  const contingencyPercent = ref(0);
  const packageOutput = ref("");
  const toastMessage = ref("");
  const toastVisible = ref(false);
  const restored = ref(false);

  const chargeableGuests = computed(() => adultCount.value + childCount.value);
  const totalGuests = computed(() => chargeableGuests.value + infantCount.value);

  const selectedVisa = computed(() => visaList.find((visa) => visa.id === visaType.value));
  const selectedVehicle = computed(() => vehicleList.find((vehicle) => vehicle.id === vehicleType.value));

  const selectedHotel = (hotelId: string): Hotel | undefined => accommodationList.find((hotel) => hotel.id === hotelId);

  const createHotel = (): HotelState => {
    hotelCounter.value += 1;
    return {
      uid: hotelCounter.value,
      name: "",
      hotelId: "",
      category: "",
      stars: "",
      mealPlan: 0,
      nights: 0,
      childRateLink: "double",
      rates: defaultRates(),
      collapsed: false
    };
  };

  const addHotel = () => {
    hotels.value.push(createHotel());
    showToast("Hotel added.");
  };

  const removeHotel = (uid: number) => {
    if (hotels.value.length === 1) {
      showToast("At least one hotel is required.");
      return;
    }
    hotels.value = hotels.value.filter((hotel) => hotel.uid !== uid);
    showToast("Hotel removed.");
  };

  const applyHotelDefaults = (hotel: HotelState) => {
    const selected = selectedHotel(hotel.hotelId);
    if (!selected) {
      hotel.category = "";
      hotel.stars = "";
      hotel.rates = defaultRates();
      return;
    }

    hotel.category = "";
    hotel.stars = String(selected.stars);
    roomTypes.forEach((room) => {
      hotel.rates[room.key].rate = selected.rates[room.key] || 0;
      hotel.rates[room.key].category = "";
    });
    updateChildRateFromLinked(hotel);
  };

  const updateChildRateFromLinked = (hotel: HotelState) => {
    hotel.rates.childNoBed.rate = hotel.rates[hotel.childRateLink].rate || 0;
  };

  const applyVisaDefaults = () => {
    visaFee.value = selectedVisa.value?.fee || 0;
  };

  const applyVehicleDefaults = () => {
    vehicleRate.value = selectedVehicle.value?.rate || 0;
  };

  const hotelTotal = (hotel: HotelState) => {
    const mealCost = hotel.mealPlan * chargeableGuests.value * hotel.nights;
    const roomCost = roomTypes.reduce((sum, room) => {
      const rate = hotel.rates[room.key];
      return sum + rate.units * rate.rate * hotel.nights;
    }, 0);
    return roomCost + mealCost;
  };

  const totals = computed(() => {
    const accommodation = hotels.value.reduce((sum, hotel) => sum + hotelTotal(hotel), 0);
    const visaGuests = chargeableGuests.value;
    const visa = visaFee.value * visaGuests + visaServiceFee.value + (visaExpress.value ? 200000 * visaGuests : 0);
    const activityBase = activityList.reduce((sum, activity) => {
      return selectedActivities.value[activity.id] ? sum + activity.price * visaGuests : sum;
    }, 0);
    const activity = (activityBase + privateGuideFee.value) * (1 + activityBuffer.value / 100);
    const transport = vehicleRate.value * vehicleQty.value * transportDays.value
      + (includeAirportTransfer.value ? airportTransferFee.value : 0)
      + parkingFuelFee.value;
    const subtotal = accommodation + visa + activity + transport;
    const markup = subtotal * (markupPercent.value / 100);
    const contingency = subtotal * (contingencyPercent.value / 100);
    const grand = subtotal + markup + contingency;

    return {
      accommodation,
      visa,
      activity,
      transport,
      subtotal,
      markup,
      contingency,
      grand,
      perGuest: chargeableGuests.value > 0 ? grand / chargeableGuests.value : 0
    };
  });

  const createPackageSummary = () => {
    const hotelSummary = hotels.value.map((hotel, index) => {
      const selected = selectedHotel(hotel.hotelId);
      const name = hotel.name || `Hotel ${index + 1}`;
      return selected
        ? `${name}: ${selected.name}, ${hotel.category || "No category"}, ${hotel.stars || "No"} star`
        : `${name}: No hotel selected`;
    }).join("; ") || "No hotel selected";
    const activities = activityList
      .filter((activity) => selectedActivities.value[activity.id])
      .map((activity) => activity.name)
      .join(", ") || "No activity selected";

    packageOutput.value = [
      packageName.value || "Untitled Package",
      `${chargeableGuests.value} chargeable guests, ${nightCount.value} nights`,
      `Hotels: ${hotelSummary}`,
      `Visa: ${selectedVisa.value?.name || "No visa selected"}`,
      `Activities: ${activities}`,
      `Transportation: ${selectedVehicle.value?.name || "No vehicle selected"} x ${vehicleQty.value}`,
      `Total package: ${formatCurrency(totals.value.grand)}`,
      `Price per guest: ${formatCurrency(totals.value.perGuest)}`
    ].join("\n");
    showToast("Package is ready.");
  };

  const copyPackageSummary = async () => {
    if (!packageOutput.value) createPackageSummary();
    try {
      await navigator.clipboard.writeText(packageOutput.value);
      showToast("Package summary copied.");
    } catch {
      showToast("Copy failed. Select the summary text manually.");
    }
  };

  const printPackage = () => {
    if (!packageOutput.value) createPackageSummary();
    window.print();
  };

  const resetForm = () => {
    packageName.value = "";
    adultCount.value = 0;
    childCount.value = 0;
    infantCount.value = 0;
    nightCount.value = 0;
    hotels.value = [createHotel()];
    visaType.value = "";
    visaFee.value = 0;
    visaServiceFee.value = 0;
    visaExpress.value = false;
    selectedActivities.value = Object.fromEntries(activityList.map((activity) => [activity.id, false]));
    privateGuideFee.value = 0;
    activityBuffer.value = 0;
    vehicleType.value = "";
    vehicleQty.value = 0;
    transportDays.value = 0;
    vehicleRate.value = 0;
    airportTransferFee.value = 0;
    parkingFuelFee.value = 0;
    includeAirportTransfer.value = false;
    markupPercent.value = 0;
    contingencyPercent.value = 0;
    packageOutput.value = "";
    showToast("Pricing form reset.");
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
    adultCount: adultCount.value,
    childCount: childCount.value,
    infantCount: infantCount.value,
    nightCount: nightCount.value,
    hotels: hotels.value,
    visaType: visaType.value,
    visaFee: visaFee.value,
    visaServiceFee: visaServiceFee.value,
    visaExpress: visaExpress.value,
    selectedActivities: selectedActivities.value,
    privateGuideFee: privateGuideFee.value,
    activityBuffer: activityBuffer.value,
    vehicleType: vehicleType.value,
    vehicleQty: vehicleQty.value,
    transportDays: transportDays.value,
    vehicleRate: vehicleRate.value,
    airportTransferFee: airportTransferFee.value,
    parkingFuelFee: parkingFuelFee.value,
    includeAirportTransfer: includeAirportTransfer.value,
    markupPercent: markupPercent.value,
    contingencyPercent: contingencyPercent.value,
    packageOutput: packageOutput.value
  }));

  const restoreState = () => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      hotels.value = [createHotel()];
      return;
    }

    try {
      const saved = JSON.parse(raw);
      packageName.value = saved.packageName || "";
      adultCount.value = Number(saved.adultCount) || 0;
      childCount.value = Number(saved.childCount) || 0;
      infantCount.value = Number(saved.infantCount) || 0;
      nightCount.value = Number(saved.nightCount) || 0;
      hotels.value = saved.hotels?.length ? saved.hotels : [createHotel()];
      hotelCounter.value = Math.max(0, ...hotels.value.map((hotel) => hotel.uid || 0));
      visaType.value = saved.visaType || "";
      visaFee.value = Number(saved.visaFee) || 0;
      visaServiceFee.value = Number(saved.visaServiceFee) || 0;
      visaExpress.value = Boolean(saved.visaExpress);
      selectedActivities.value = saved.selectedActivities || Object.fromEntries(activityList.map((activity) => [activity.id, false]));
      privateGuideFee.value = Number(saved.privateGuideFee) || 0;
      activityBuffer.value = Number(saved.activityBuffer) || 0;
      vehicleType.value = saved.vehicleType || "";
      vehicleQty.value = Number(saved.vehicleQty) || 0;
      transportDays.value = Number(saved.transportDays) || 0;
      vehicleRate.value = Number(saved.vehicleRate) || 0;
      airportTransferFee.value = Number(saved.airportTransferFee) || 0;
      parkingFuelFee.value = Number(saved.parkingFuelFee) || 0;
      includeAirportTransfer.value = Boolean(saved.includeAirportTransfer);
      markupPercent.value = Number(saved.markupPercent) || 0;
      contingencyPercent.value = Number(saved.contingencyPercent) || 0;
      packageOutput.value = saved.packageOutput || "";
    } catch {
      localStorage.removeItem(storageKey);
      hotels.value = [createHotel()];
    } finally {
      restored.value = true;
    }
  };

  onMounted(() => {
    restoreState();
    watch(serializableState, (value) => {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }, { deep: true });
  });

  return {
    accommodationList,
    activityList,
    roomTypes,
    vehicleList,
    visaList,
    packageName,
    adultCount,
    childCount,
    infantCount,
    nightCount,
    hotels,
    visaType,
    visaFee,
    visaServiceFee,
    visaExpress,
    selectedActivities,
    privateGuideFee,
    activityBuffer,
    vehicleType,
    vehicleQty,
    transportDays,
    vehicleRate,
    airportTransferFee,
    parkingFuelFee,
    includeAirportTransfer,
    markupPercent,
    contingencyPercent,
    packageOutput,
    toastMessage,
    toastVisible,
    chargeableGuests,
    totalGuests,
    selectedVehicle,
    totals,
    selectedHotel,
    addHotel,
    removeHotel,
    applyHotelDefaults,
    updateChildRateFromLinked,
    applyVisaDefaults,
    applyVehicleDefaults,
    hotelTotal,
    createPackageSummary,
    copyPackageSummary,
    printPackage,
    resetForm,
    formatCurrency
  };
};
