<template>
  <section class="product-modules">
    <div v-if="mode === 'accommodation'" class="module-section">
      <div class="module-heading">
        <div>
          <h2>Accommodation Records</h2>
          <p class="small-note">One record can cover multiple itinerary days.</p>
        </div>
        <button class="button-primary" type="button" @click="$emit('add-accommodation')">
          <Icon name="lucide:hotel" size="18" />
          <span>Add accommodation</span>
        </button>
      </div>
      <div v-if="!accommodations.length" class="empty-line">No accommodation records.</div>
      <div v-for="(item, index) in accommodations" :key="item.id" class="record-card accommodation-record">
        <div class="accommodation-group-title">Accommodation {{ toRoman(index + 1) }}</div>
        <div class="location-fields">
          <div class="field"><label :for="`country-${item.id}`">Country</label><select :id="`country-${item.id}`" v-model="item.countryId" @change="resetLocation(item, 'country')"><option value="">Select country</option><option v-for="option in countryList" :key="option.id" :value="option.id">{{ option.name }}</option></select></div>
          <div class="field"><label :for="`regency-${item.id}`">Regency</label><select :id="`regency-${item.id}`" v-model="item.regencyId" :disabled="!item.countryId" @change="resetLocation(item, 'regency')"><option value="">Select regency</option><option v-for="option in regenciesForCountry(item.countryId)" :key="option.id" :value="option.id">{{ option.name }}</option></select></div>
          <div class="field"><label :for="`state-${item.id}`">State</label><select :id="`state-${item.id}`" v-model="item.stateId" :disabled="!item.regencyId" @change="resetLocation(item, 'state')"><option value="">Select state</option><option v-for="option in statesForRegency(item.regencyId)" :key="option.id" :value="option.id">{{ option.name }}</option></select></div>
        </div>
        <div class="price-group-heading">
          <h3>Base Prices</h3>
          <p>Rates received from the selected hotel room type.</p>
        </div>
        <div class="field">
          <label :for="`accommodation-${item.id}-product`">Accommodation product</label>
          <select :id="`accommodation-${item.id}-product`" v-model="item.productId" @change="$emit('apply-accommodation', item)">
            <option value="">Select accommodation</option>
            <option v-for="product in hotelsForState(item.stateId)" :key="product.id" :value="product.id">{{ product.name }}</option>
          </select>
        </div>
        <div class="field">
          <label :for="`accommodation-${item.id}-room-type`">Room type</label>
          <select :id="`accommodation-${item.id}-room-type`" v-model="item.roomTypeId" @change="$emit('apply-accommodation', item)">
            <option value="">Select room type</option>
            <option v-for="room in roomTypesForHotel(item.productId)" :key="room.id" :value="room.id">
              {{ room.name }}
            </option>
          </select>
        </div>
        <div class="day-range-fields">
          <div class="field">
            <label :for="`accommodation-${item.id}-start`">Start</label>
            <input :id="`accommodation-${item.id}-start`" v-model.number="item.startDay" type="number" min="1" :max="totalNights" inputmode="numeric" :disabled="totalNights === 0" @change="clampAccommodationRange(item, 'start')">
          </div>
          <div class="field">
            <label :for="`accommodation-${item.id}-end`">End</label>
            <input :id="`accommodation-${item.id}-end`" v-model.number="item.endDay" type="number" :min="item.startDay" :max="totalNights" inputmode="numeric" :disabled="totalNights === 0" @change="clampAccommodationRange(item, 'end')">
          </div>
        </div>
        <div class="field">
          <label :for="`accommodation-${item.id}-price`">Room Price</label>
          <input :id="`accommodation-${item.id}-price`" :value="stayPrice(item, item.pricePerNight)" type="number" readonly>
        </div>
        <div class="record-total">
          <span>{{ accommodationNights(item) }} nights total</span>
          <strong>{{ formatCurrency(accommodationSelling(item)) }}</strong>
        </div>
        <button class="icon-button button-danger" type="button" @click="$emit('remove-record', 'accommodation', item.id)">
          <Icon name="lucide:trash-2" size="16" />
        </button>
        <div class="additional-price-fields">
          <div class="field">
            <label :for="`accommodation-${item.id}-extra-adult`">Extra Bed Adult</label>
            <input :id="`accommodation-${item.id}-extra-adult`" :value="stayPrice(item, item.additionalPrices.extraBedAdult)" type="number" readonly>
          </div>
          <div class="field">
            <label :for="`accommodation-${item.id}-extra-child`">Extra Bed Child</label>
            <input :id="`accommodation-${item.id}-extra-child`" :value="stayPrice(item, item.additionalPrices.extraBedChild)" type="number" readonly>
          </div>
          <div class="field">
            <label :for="`accommodation-${item.id}-child-no-bed`">Child No Bed (Breakfast Only)</label>
            <input :id="`accommodation-${item.id}-child-no-bed`" :value="stayPrice(item, item.additionalPrices.childNoBed)" type="number" readonly>
          </div>
        </div>
        <div class="price-type-fields">
          <div class="price-group-heading">
            <h3>1 Room Prices</h3>
            <p>Calculated room rates based on the base price and additional charges.</p>
          </div>
          <div v-for="priceType in priceTypeList" :key="priceType.key" class="field">
            <label :for="`accommodation-${item.id}-price-type-${priceType.key}`">{{ priceType.label }}</label>
            <input
              :id="`accommodation-${item.id}-price-type-${priceType.key}`"
              :value="oneRoomPrice(item, priceType.key)"
              type="number"
              min="0"
              step="1000"
              inputmode="numeric"
              readonly
            >
          </div>
        </div>
        <div class="pax-price-fields">
          <div class="price-group-heading">
            <h3>1 Pax Prices</h3>
            <p>Calculated price per guest for each occupancy type.</p>
          </div>
          <div v-for="priceType in priceTypeList" :key="priceType.key" class="field">
            <label :for="`accommodation-${item.id}-pax-price-${priceType.key}`">{{ priceType.label }}</label>
            <input
              :id="`accommodation-${item.id}-pax-price-${priceType.key}`"
              :value="onePaxPrice(item, priceType.key)"
              type="number"
              readonly
            >
          </div>
        </div>
      </div>
      <div v-if="accommodations.length" class="grand-pax-total">
        <div class="grand-pax-heading">
          <h3>Grand Total for 1 Pax</h3>
          <p>Combined per-person accommodation price for each matching price type.</p>
        </div>
        <div v-for="priceType in priceTypeList" :key="priceType.key" class="field">
          <label :for="`grand-pax-${priceType.key}`">{{ priceType.label }}</label>
          <div :id="`grand-pax-${priceType.key}`" class="grand-pax-value">{{ formatCurrency(grandPaxTotal(priceType.key)) }}</div>
        </div>
      </div>
    </div>

    <div v-if="mode === 'other'" class="module-section">
      <div class="module-heading">
        <div>
          <h2>Activity Records</h2>
          <p class="small-note">Activities are linked to one itinerary day.</p>
        </div>
        <button class="button-primary" type="button" @click="$emit('add-activity')">
          <Icon name="lucide:map" size="18" />
          <span>Add activity</span>
        </button>
      </div>
      <div v-if="!activities.length" class="empty-line">No activity records.</div>
      <div v-for="item in activities" :key="item.id" class="record-card activity-record">
        <div class="field activity-day-field">
          <label :for="`activity-${item.id}-day`">Day number</label>
          <input :id="`activity-${item.id}-day`" v-model.number="item.dayNumber" type="number" min="1" inputmode="numeric">
        </div>
        <div class="field activity-product-field">
          <label :for="`activity-${item.id}-product`">Activity product</label>
          <select :id="`activity-${item.id}-product`" v-model="item.productId" @change="$emit('apply-activity', item)">
            <option value="">Select activity</option>
            <option v-for="product in activityList" :key="product.id" :value="product.id">{{ product.name }}</option>
          </select>
        </div>
        <div class="field activity-nationality-field">
          <label :for="`activity-${item.id}-nationality`">Nationality</label>
          <select :id="`activity-${item.id}-nationality`" v-model="item.nationality" @change="$emit('apply-activity', item)">
            <option value="">Select nationality</option>
            <option value="general">General</option><option value="foreign">Foreign</option><option value="domestic">Domestic</option>
          </select>
        </div>
        <div class="field activity-type-field">
          <label :for="`activity-${item.id}-type`">Ticket Type</label>
          <select :id="`activity-${item.id}-type`" v-model="item.ticketType" :disabled="!item.nationality" @change="$emit('apply-activity', item)">
            <option value="">Select type</option>
            <option value="general">General</option><option value="adult">Adult</option><option value="child">Child</option>
          </select>
        </div>
        <div class="field activity-ticket-field">
          <label :for="`activity-${item.id}-ticket`">Ticket Name</label>
          <select :id="`activity-${item.id}-ticket`" v-model="item.ticketId" @change="$emit('apply-activity', item)">
            <option value="">Select ticket name</option>
            <option v-for="ticket in ticketsForActivity(item)" :key="ticket.id" :value="ticket.id">{{ ticket.name }}</option>
          </select>
        </div>
        <div class="field activity-price-field">
          <label :for="`activity-${item.id}-price`">Price</label>
          <input :id="`activity-${item.id}-price`" v-model.number="item.price" type="number" min="0" step="1000" inputmode="numeric" readonly>
        </div>
        <label class="checkbox-field activity-transport-field" :for="`activity-${item.id}-transport`">
          <input :id="`activity-${item.id}-transport`" v-model="item.includeTransport" type="checkbox">
          <span>Include Transport</span>
        </label>
        <div class="record-total activity-total-field"><span>Ticket price</span><strong>{{ formatCurrency(activitySelling(item)) }}</strong></div>
        <button class="icon-button button-danger activity-delete-field" type="button" @click="$emit('remove-record', 'activity', item.id)">
          <Icon name="lucide:trash-2" size="16" />
        </button>
      </div>
    </div>

    <div v-if="mode === 'other'" class="module-section">
      <div class="module-heading">
        <div>
          <h2>Transportation Records</h2>
          <p class="small-note">Route-based transfers support airport, hotel, activity, port, and terminal movements.</p>
        </div>
        <button class="button-primary" type="button" @click="$emit('add-transportation')">
          <Icon name="lucide:car" size="18" />
          <span>Add transport</span>
        </button>
      </div>
      <div v-if="!transportation.length" class="empty-line">No transportation records.</div>
      <div v-for="item in transportation" :key="item.id" class="record-card transport-record">
        <div class="field">
          <label :for="`transport-${item.id}-day`">Day number</label>
          <input :id="`transport-${item.id}-day`" v-model.number="item.dayNumber" type="number" min="1" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`transport-${item.id}-from`">From location</label>
          <input :id="`transport-${item.id}-from`" v-model="item.fromLocation" type="text">
        </div>
        <div class="field">
          <label :for="`transport-${item.id}-to`">To location</label>
          <input :id="`transport-${item.id}-to`" v-model="item.toLocation" type="text">
        </div>
        <div class="field">
          <label :for="`transport-${item.id}-car`">Car type</label>
          <select :id="`transport-${item.id}-car`" v-model="item.carTypeId" @change="$emit('apply-transportation', item)">
            <option value="">Select car type</option>
            <option v-for="car in carTypeList" :key="car.id" :value="car.id">{{ car.name }}</option>
          </select>
        </div>
        <div class="field">
          <label :for="`transport-${item.id}-pax`">Total pax</label>
          <input :id="`transport-${item.id}-pax`" v-model.number="item.totalPax" type="number" min="0" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`transport-${item.id}-luggage`">Total luggage</label>
          <input :id="`transport-${item.id}-luggage`" v-model.number="item.totalLuggage" type="number" min="0" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`transport-${item.id}-price`">Price</label>
          <input :id="`transport-${item.id}-price`" v-model.number="item.price" type="number" min="0" step="1000" inputmode="numeric">
        </div>
        <div class="record-total"><span>Transport price</span><strong>{{ formatCurrency(transportSelling(item)) }}</strong></div>
        <button class="icon-button button-danger" type="button" @click="$emit('remove-record', 'transport', item.id)">
          <Icon name="lucide:trash-2" size="16" />
        </button>
      </div>
    </div>

    <div v-if="mode === 'other'" class="module-section">
      <div class="module-heading">
        <div>
          <h2>VISA Records</h2>
          <p class="small-note">VISA is package-level and not tied to an itinerary day.</p>
        </div>
        <button class="button-primary" type="button" @click="$emit('add-visa')">
          <Icon name="lucide:badge-check" size="18" />
          <span>Add VISA</span>
        </button>
      </div>
      <div v-if="!visas.length" class="empty-line">No VISA records.</div>
      <div v-for="item in visas" :key="item.id" class="record-card visa-record">
        <div class="field">
          <label :for="`visa-${item.id}-permit`">Visa / Permit option</label>
          <select :id="`visa-${item.id}-permit`" v-model="item.visaOptionId" @change="$emit('apply-visa', item)">
            <option value="">Select visa / permit</option>
            <option v-for="option in visaPermitOptionList" :key="option.id" :value="option.id">{{ option.label }}</option>
          </select>
        </div>
        <div class="field">
          <label :for="`visa-${item.id}-service`">Service option</label>
          <select :id="`visa-${item.id}-service`" v-model="item.serviceOptionId" @change="$emit('apply-visa', item)">
            <option value="">Select service</option>
            <option v-for="option in visaServiceOptionList" :key="option.id" :value="option.id">{{ option.label }}</option>
          </select>
        </div>
        <div class="field">
          <label :for="`visa-${item.id}-price`">Auto generated price</label>
          <input :id="`visa-${item.id}-price`" v-model.number="item.price" type="number" min="0" step="1000" inputmode="numeric" readonly>
        </div>
        <div class="record-total"><span>VISA price</span><strong>{{ formatCurrency(visaSelling(item)) }}</strong></div>
        <button class="icon-button button-danger" type="button" @click="$emit('remove-record', 'visa', item.id)">
          <Icon name="lucide:trash-2" size="16" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Activity, ActivityTicket, CarType, Hotel, HotelRoomType, LocationOption, RoomType, RoomTypeKey, VisaPermitOption, VisaServiceOption } from "~/data/pricing";
import type { AccommodationRecord, ActivityRecord, TransportationRecord, VisaRecord } from "~/composables/useItineraryPackageBuilder";

const props = defineProps<{
  mode: "accommodation" | "other";
  accommodations: AccommodationRecord[];
  activities: ActivityRecord[];
  transportation: TransportationRecord[];
  visas: VisaRecord[];
  accommodationList: Hotel[];
  countryList: LocationOption[];
  regencyList: LocationOption[];
  stateList: LocationOption[];
  activityList: Activity[];
  carTypeList: CarType[];
  visaPermitOptionList: VisaPermitOption[];
  visaServiceOptionList: VisaServiceOption[];
  priceTypeList: RoomType[];
  totalNights: number;
  formatCurrency: (value: number) => string;
  accommodationNights: (record: AccommodationRecord) => number;
  accommodationSelling: (record: AccommodationRecord) => number;
  activitySelling: (record: ActivityRecord) => number;
  transportSelling: (record: TransportationRecord) => number;
  visaSelling: (record: VisaRecord) => number;
}>();

const ticketsForActivity = (record: ActivityRecord): ActivityTicket[] => {
  return props.activityList.find((item) => item.id === record.productId)?.tickets.filter((ticket) => {
    return ticket.nationality === record.nationality && ticket.ticketType === record.ticketType;
  }) || [];
};

const roomTypesForHotel = (productId: string): HotelRoomType[] => {
  return props.accommodationList.find((item) => item.id === productId)?.roomTypes || [];
};

const regenciesForCountry = (countryId: string) => props.regencyList.filter((item) => item.parentId === countryId);
const statesForRegency = (regencyId: string) => props.stateList.filter((item) => item.parentId === regencyId);
const hotelsForState = (stateId: string) => props.accommodationList.filter((item) => item.stateId === stateId);

const resetLocation = (record: AccommodationRecord, level: "country" | "regency" | "state") => {
  if (level === "country") { record.regencyId = ""; record.stateId = ""; }
  if (level === "regency") record.stateId = "";
  record.productId = "";
  record.roomTypeId = "";
  emit("apply-accommodation", record);
};

const updateAccommodationPrices = (record: AccommodationRecord) => {
  const basePrice = Math.max(0, Number(record.pricePerNight) || 0);
  record.priceTypePrices.single = basePrice;
  record.priceTypePrices.double = basePrice;
  record.priceTypePrices.tripleA = basePrice + record.additionalPrices.extraBedAdult;
  record.priceTypePrices.tripleB = basePrice + record.additionalPrices.extraBedChild;
  record.priceTypePrices.childNoBed = record.additionalPrices.childNoBed;
};

const stayPrice = (record: AccommodationRecord, nightlyPrice: number) => {
  return nightlyPrice * props.accommodationNights(record);
};

const oneRoomPrice = (record: AccommodationRecord, priceType: RoomTypeKey) => {
  return stayPrice(record, record.priceTypePrices[priceType]);
};

const onePaxPrice = (record: AccommodationRecord, priceType: RoomTypeKey) => {
  const divisors: Record<RoomTypeKey, number> = {
    single: 1,
    double: 2,
    tripleA: 3,
    tripleB: 3,
    childNoBed: 1
  };
  return Math.round(oneRoomPrice(record, priceType) / divisors[priceType]);
};

const grandPaxTotal = (priceType: RoomTypeKey) => {
  return props.accommodations.reduce((total, record) => total + onePaxPrice(record, priceType), 0);
};

const clampAccommodationRange = (record: AccommodationRecord, changedField: "start" | "end") => {
  if (props.totalNights === 0) {
    record.startDay = 0;
    record.endDay = 0;
    return;
  }
  record.startDay = Math.min(props.totalNights, Math.max(1, Number(record.startDay) || 1));
  record.endDay = Math.min(props.totalNights, Math.max(1, Number(record.endDay) || record.startDay));
  if (record.startDay > record.endDay) {
    if (changedField === "start") record.endDay = record.startDay;
    else record.startDay = record.endDay;
  }
};

const toRoman = (value: number) => {
  const numerals: Array<[number, string]> = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
  ];
  let remainder = value;
  return numerals.reduce((result, [amount, numeral]) => {
    while (remainder >= amount) {
      result += numeral;
      remainder -= amount;
    }
    return result;
  }, "");
};

const emit = defineEmits<{
  "add-accommodation": [];
  "add-activity": [];
  "add-transportation": [];
  "add-visa": [];
  "remove-record": [kind: "accommodation" | "activity" | "transport" | "visa", id: number];
  "apply-accommodation": [record: AccommodationRecord];
  "apply-activity": [record: ActivityRecord];
  "apply-transportation": [record: TransportationRecord];
  "apply-visa": [record: VisaRecord];
}>();
</script>
