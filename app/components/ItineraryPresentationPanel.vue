<template>
  <section class="product-modules">
    <div class="module-section">
      <div class="module-heading">
        <div>
          <h2>Itinerary Presentation</h2>
          <p class="small-note">Days only contain title and description. Product references are generated from package records.</p>
        </div>
      </div>

      <div v-for="day in itineraryDays" :key="day.id" class="itinerary-presentation-card">
        <div class="itinerary-day-header">
          <div class="day-title-group">
            <span class="day-number">Day {{ day.dayNumber }}</span>
            <input v-model="day.title" class="day-title-input" type="text" placeholder="Day title">
          </div>
          <button class="icon-button" type="button" title="Show or hide day detail" @click="day.collapsed = !day.collapsed">
            <Icon :name="day.collapsed ? 'lucide:chevron-down' : 'lucide:chevron-up'" size="18" />
          </button>
        </div>

        <div v-if="!day.collapsed" class="itinerary-day-body">
          <div class="itinerary-meta-grid">
            <div class="field">
              <label :for="`day-${day.id}-location`">Itinerary location</label>
              <select :id="`day-${day.id}-location`" v-model="day.locationId">
                <option value="">Select Bali location</option>
                <option v-for="location in baliLocationList" :key="location.id" :value="location.id">
                  {{ location.name }} / {{ location.area }}
                </option>
              </select>
            </div>
            <div class="field">
              <label :for="`day-${day.id}-departure`">Departure time</label>
              <input :id="`day-${day.id}-departure`" v-model="day.departureTime" type="time">
            </div>
            <div class="field">
              <label :for="`day-${day.id}-return`">Return time</label>
              <input :id="`day-${day.id}-return`" v-model="day.returnTime" type="time">
            </div>
            <div class="field">
              <label :for="`day-${day.id}-tag`">Tags</label>
              <select :id="`day-${day.id}-tag`" v-model="day.tagId" :disabled="day.dayNumber === totalDays">
                <option value="">Select tag</option>
                <option v-for="tag in itineraryTagList" :key="tag.id" :value="tag.id">{{ tag.label }}</option>
              </select>
            </div>
          </div>

          <div class="field">
            <label :for="`day-${day.id}-description`">Day description</label>
            <textarea :id="`day-${day.id}-description`" v-model="day.description" placeholder="Describe the itinerary flow for this day"></textarea>
          </div>

          <div class="reference-grid" :class="{ 'without-visa': day.dayNumber !== 1 }">
            <div class="reference-box">
              <h3>Accommodation</h3>
              <p v-if="!linkedProductsForDay(day.dayNumber).accommodations.length" class="empty-line">No linked accommodation.</p>
              <p v-for="record in linkedProductsForDay(day.dayNumber).accommodations" :key="record.recordId">
                {{ record.productName }} / {{ record.roomType }}
              </p>
            </div>
            <div class="reference-box">
              <h3>Activities</h3>
              <p v-if="!linkedProductsForDay(day.dayNumber).activities.length" class="empty-line">No linked activities.</p>
              <p v-for="record in linkedProductsForDay(day.dayNumber).activities" :key="record.recordId">
                {{ record.productName }} / {{ record.ticketName }}
              </p>
            </div>
            <div class="reference-box">
              <h3>Transportation</h3>
              <p v-if="!linkedProductsForDay(day.dayNumber).transportation.length && !linkedProductsForDay(day.dayNumber).activities.some((record) => record.includeTransport)" class="empty-line">No linked transportation.</p>
              <p v-for="record in linkedProductsForDay(day.dayNumber).transportation" :key="record.recordId">
                {{ formatServiceType(record.serviceType) }} / {{ record.route }} / {{ record.carType }} / {{ record.totalPax }} pax / {{ record.totalLuggage }} luggage
              </p>
              <p v-for="record in linkedProductsForDay(day.dayNumber).activities.filter((item) => item.includeTransport)" :key="`activity-transport-${record.recordId}`">
                {{ record.productName }} / Included from Activity
              </p>
            </div>
            <div v-if="day.dayNumber === 1" class="reference-box">
              <h3>VISA</h3>
              <p v-if="!linkedProductsForDay(day.dayNumber).visas.length" class="empty-line">No linked VISA.</p>
              <p v-for="record in linkedProductsForDay(day.dayNumber).visas" :key="record.recordId">
                {{ record.visaOption }} / {{ record.serviceOption }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ItineraryDay, LinkedDayProducts } from "~/composables/useItineraryPackageBuilder";
import type { BaliLocation, ItineraryTag } from "~/data/pricing";

defineProps<{
  itineraryDays: ItineraryDay[];
  baliLocationList: BaliLocation[];
  itineraryTagList: ItineraryTag[];
  totalDays: number;
  linkedProductsForDay: (dayNumber: number) => LinkedDayProducts;
}>();

const formatServiceType = (value: string) => ({
  "full-day": "Full Day",
  "check-in": "Check In",
  "check-out": "Check Out"
}[value] || "No service selected");
</script>
