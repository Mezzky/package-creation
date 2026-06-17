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
          <label :for="`accommodation-${item.id}-room`">Room type</label>
          <select :id="`accommodation-${item.id}-room`" v-model="item.roomType" @change="$emit('apply-accommodation', item)">
            <option value="">Select room type</option>
            <option v-for="room in roomTypes" :key="room.key" :value="room.key">{{ room.label }}</option>
          </select>
        </div>
        <div class="field">
          <label :for="`accommodation-${item.id}-start`">Start day</label>
          <input :id="`accommodation-${item.id}-start`" v-model.number="item.startDay" type="number" min="1" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`accommodation-${item.id}-end`">End day</label>
          <input :id="`accommodation-${item.id}-end`" v-model.number="item.endDay" type="number" min="1" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`accommodation-${item.id}-quantity`">Quantity</label>
          <input :id="`accommodation-${item.id}-quantity`" v-model.number="item.quantity" type="number" min="0" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`accommodation-${item.id}-cost`">Supplier cost / night</label>
          <input :id="`accommodation-${item.id}-cost`" v-model.number="item.supplierCost" type="number" min="0" step="1000" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`accommodation-${item.id}-selling`">Selling price / night</label>
          <input :id="`accommodation-${item.id}-selling`" v-model.number="item.sellingPrice" type="number" min="0" step="1000" inputmode="numeric">
        </div>
        <div class="record-total">
          <span>{{ accommodationNights(item) }} nights total</span>
          <strong>{{ formatCurrency(accommodationSelling(item)) }}</strong>
        </div>
        <button class="icon-button button-danger" type="button" @click="$emit('remove-record', 'accommodation', item.id)">
          <Icon name="lucide:x" size="16" />
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
          <label :for="`activity-${item.id}-product`">Activity product</label>
          <select :id="`activity-${item.id}-product`" v-model="item.productId" @change="$emit('apply-activity', item)">
            <option value="">Select activity</option>
            <option v-for="product in activityList" :key="product.id" :value="product.id">{{ product.name }}</option>
          </select>
        </div>
        <div class="field">
          <label :for="`activity-${item.id}-day`">Day number</label>
          <input :id="`activity-${item.id}-day`" v-model.number="item.dayNumber" type="number" min="1" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`activity-${item.id}-quantity`">Quantity</label>
          <input :id="`activity-${item.id}-quantity`" v-model.number="item.quantity" type="number" min="0" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`activity-${item.id}-cost`">Supplier cost</label>
          <input :id="`activity-${item.id}-cost`" v-model.number="item.supplierCost" type="number" min="0" step="1000" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`activity-${item.id}-selling`">Selling price</label>
          <input :id="`activity-${item.id}-selling`" v-model.number="item.sellingPrice" type="number" min="0" step="1000" inputmode="numeric">
        </div>
        <div class="record-total"><span>Line selling total</span><strong>{{ formatCurrency(activitySelling(item)) }}</strong></div>
        <button class="icon-button button-danger" type="button" @click="$emit('remove-record', 'activity', item.id)">
          <Icon name="lucide:x" size="16" />
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
          <label :for="`transport-${item.id}-product`">Transportation product</label>
          <select :id="`transport-${item.id}-product`" v-model="item.productId" @change="$emit('apply-transportation', item)">
            <option value="">Select transportation</option>
            <option v-for="product in vehicleList" :key="product.id" :value="product.id">{{ product.name }} - {{ product.capacity }} pax</option>
          </select>
        </div>
        <div class="field">
          <label :for="`transport-${item.id}-quantity`">Quantity</label>
          <input :id="`transport-${item.id}-quantity`" v-model.number="item.quantity" type="number" min="0" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`transport-${item.id}-cost`">Supplier cost</label>
          <input :id="`transport-${item.id}-cost`" v-model.number="item.supplierCost" type="number" min="0" step="1000" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`transport-${item.id}-selling`">Selling price</label>
          <input :id="`transport-${item.id}-selling`" v-model.number="item.sellingPrice" type="number" min="0" step="1000" inputmode="numeric">
        </div>
        <div class="record-total"><span>Line selling total</span><strong>{{ formatCurrency(transportSelling(item)) }}</strong></div>
        <button class="icon-button button-danger" type="button" @click="$emit('remove-record', 'transport', item.id)">
          <Icon name="lucide:x" size="16" />
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
          <label :for="`visa-${item.id}-product`">VISA product</label>
          <select :id="`visa-${item.id}-product`" v-model="item.productId" @change="$emit('apply-visa', item)">
            <option value="">Select VISA</option>
            <option v-for="product in visaList" :key="product.id" :value="product.id">{{ product.name }}</option>
          </select>
        </div>
        <div class="field">
          <label :for="`visa-${item.id}-quantity`">Quantity</label>
          <input :id="`visa-${item.id}-quantity`" v-model.number="item.quantity" type="number" min="0" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`visa-${item.id}-cost`">Supplier cost</label>
          <input :id="`visa-${item.id}-cost`" v-model.number="item.supplierCost" type="number" min="0" step="1000" inputmode="numeric">
        </div>
        <div class="field">
          <label :for="`visa-${item.id}-selling`">Selling price</label>
          <input :id="`visa-${item.id}-selling`" v-model.number="item.sellingPrice" type="number" min="0" step="1000" inputmode="numeric">
        </div>
        <div class="record-total"><span>Line selling total</span><strong>{{ formatCurrency(visaSelling(item)) }}</strong></div>
        <button class="icon-button button-danger" type="button" @click="$emit('remove-record', 'visa', item.id)">
          <Icon name="lucide:x" size="16" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Activity, Hotel, RoomType, Vehicle, Visa } from "~/data/pricing";
import type { AccommodationRecord, ActivityRecord, TransportationRecord, VisaRecord } from "~/composables/useItineraryPackageBuilder";

defineProps<{
  accommodations: AccommodationRecord[];
  activities: ActivityRecord[];
  transportation: TransportationRecord[];
  visas: VisaRecord[];
  accommodationList: Hotel[];
  activityList: Activity[];
  vehicleList: Vehicle[];
  visaList: Visa[];
  roomTypes: RoomType[];
  formatCurrency: (value: number) => string;
  accommodationNights: (record: AccommodationRecord) => number;
  accommodationSelling: (record: AccommodationRecord) => number;
  activitySelling: (record: ActivityRecord) => number;
  transportSelling: (record: TransportationRecord) => number;
  visaSelling: (record: VisaRecord) => number;
}>();

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
