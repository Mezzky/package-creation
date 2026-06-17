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
          <div class="field">
            <label :for="`day-${day.id}-description`">Day description</label>
            <textarea :id="`day-${day.id}-description`" v-model="day.description" placeholder="Describe the itinerary flow for this day"></textarea>
          </div>

          <div class="reference-grid">
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
              <p v-for="record in linkedProductsForDay(day.dayNumber).activities" :key="record.recordId">{{ record.productName }}</p>
            </div>
            <div class="reference-box">
              <h3>Transportation</h3>
              <p v-if="!linkedProductsForDay(day.dayNumber).transportation.length" class="empty-line">No linked transportation.</p>
              <p v-for="record in linkedProductsForDay(day.dayNumber).transportation" :key="record.recordId">{{ record.route }}</p>
            </div>
            <div class="reference-box">
              <h3>VISA</h3>
              <p v-if="!linkedProductsForDay(day.dayNumber).visas.length" class="empty-line">No linked VISA.</p>
              <p v-for="record in linkedProductsForDay(day.dayNumber).visas" :key="record.recordId">{{ record.productName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ItineraryDay, LinkedDayProducts } from "~/composables/useItineraryPackageBuilder";

defineProps<{
  itineraryDays: ItineraryDay[];
  linkedProductsForDay: (dayNumber: number) => LinkedDayProducts;
}>();
</script>
