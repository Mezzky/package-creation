<template>
  <section class="product-modules">
    <div class="module-section">
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
      <div v-for="item in accommodations" :key="item.id" class="record-card accommodation-record">
        <div class="field">
          <label :for="`accommodation-${item.id}-product`">Accommodation product</label>
          <select :id="`accommodation-${item.id}-product`" v-model="item.productId" @change="$emit('apply-accommodation', item)">
            <option value="">Select accommodation</option>
            <option v-for="product in accommodationList" :key="product.id" :value="product.id">{{ product.name }}</option>
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
            <input :id="`accommodation-${item.id}-start`" v-model.number="item.startDay" type="number" min="1" inputmode="numeric">
          </div>
          <div class="field">
            <label :for="`accommodation-${item.id}-end`">End</label>
            <input :id="`accommodation-${item.id}-end`" v-model.number="item.endDay" type="number" min="1" inputmode="numeric">
          </div>
        </div>
        <div class="field">
          <label :for="`accommodation-${item.id}-price-type`">Price type</label>
          <select :id="`accommodation-${item.id}-price-type`" v-model="item.priceType">
            <option value="">Select price type</option>
            <option v-for="priceType in priceTypeList" :key="priceType.key" :value="priceType.key">{{ priceType.label }}</option>
          </select>
        </div>
        <div class="field">
          <label :for="`accommodation-${item.id}-price`">Price per night</label>
          <input :id="`accommodation-${item.id}-price`" v-model.number="item.pricePerNight" type="number" min="0" step="1000" inputmode="numeric">
        </div>
        <div class="record-total">
          <span>{{ accommodationNights(item) }} nights total</span>
          <strong>{{ formatCurrency(accommodationSelling(item)) }}</strong>
        </div>
        <button class="icon-button button-danger" type="button" @click="$emit('remove-record', 'accommodation', item.id)">
          <Icon name="lucide:trash-2" size="16" />
        </button>
      </div>
    </div>

    <div class="module-section">
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
        <div class="field">
          <label :for="`activity-${item.id}-day`">Day number</label>
          <input :id="`activity-${item.id}-day`" v-model.number="item.dayNumber" type="number" min="1" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`activity-${item.id}-product`">Activity product</label>
          <select :id="`activity-${item.id}-product`" v-model="item.productId" @change="$emit('apply-activity', item)">
            <option value="">Select activity</option>
            <option v-for="product in activityList" :key="product.id" :value="product.id">{{ product.name }}</option>
          </select>
        </div>
        <div class="field">
          <label :for="`activity-${item.id}-ticket`">Ticket type</label>
          <select :id="`activity-${item.id}-ticket`" v-model="item.ticketId" @change="$emit('apply-activity', item)">
            <option value="">Select ticket</option>
            <option v-for="ticket in ticketsForActivity(item.productId)" :key="ticket.id" :value="ticket.id">{{ ticket.name }}</option>
          </select>
        </div>
        <div class="field">
          <label :for="`activity-${item.id}-price`">Price</label>
          <input :id="`activity-${item.id}-price`" v-model.number="item.price" type="number" min="0" step="1000" inputmode="numeric" readonly>
        </div>
        <div class="record-total"><span>Ticket price</span><strong>{{ formatCurrency(activitySelling(item)) }}</strong></div>
        <button class="icon-button button-danger" type="button" @click="$emit('remove-record', 'activity', item.id)">
          <Icon name="lucide:trash-2" size="16" />
        </button>
      </div>
    </div>

    <div class="module-section">
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

    <div class="module-section">
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
import type { Activity, ActivityTicket, CarType, Hotel, HotelRoomType, RoomType, VisaPermitOption, VisaServiceOption } from "~/data/pricing";
import type { AccommodationRecord, ActivityRecord, TransportationRecord, VisaRecord } from "~/composables/useItineraryPackageBuilder";

const props = defineProps<{
  accommodations: AccommodationRecord[];
  activities: ActivityRecord[];
  transportation: TransportationRecord[];
  visas: VisaRecord[];
  accommodationList: Hotel[];
  activityList: Activity[];
  carTypeList: CarType[];
  visaPermitOptionList: VisaPermitOption[];
  visaServiceOptionList: VisaServiceOption[];
  priceTypeList: RoomType[];
  formatCurrency: (value: number) => string;
  accommodationNights: (record: AccommodationRecord) => number;
  accommodationSelling: (record: AccommodationRecord) => number;
  activitySelling: (record: ActivityRecord) => number;
  transportSelling: (record: TransportationRecord) => number;
  visaSelling: (record: VisaRecord) => number;
}>();

const ticketsForActivity = (productId: string): ActivityTicket[] => {
  return props.activityList.find((item) => item.id === productId)?.tickets || [];
};

const roomTypesForHotel = (productId: string): HotelRoomType[] => {
  return props.accommodationList.find((item) => item.id === productId)?.roomTypes || [];
};

defineEmits<{
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
