<template>
  <section class="hotel-card">
    <div class="hotel-card-header">
      <div class="hotel-title-field">
        <label class="field-label" :for="`hotel-${hotel.uid}-name`">Hotel name</label>
        <input :id="`hotel-${hotel.uid}-name`" v-model="hotel.name" type="text">
      </div>
      <div class="hotel-card-actions">
        <div class="hotel-card-total">{{ formatCurrency(total) }}</div>
        <button class="icon-button" type="button" title="Show or hide hotel detail" :aria-expanded="!hotel.collapsed" @click="hotel.collapsed = !hotel.collapsed">
          <Icon :name="hotel.collapsed ? 'lucide:chevron-down' : 'lucide:chevron-up'" size="18" />
        </button>
        <button class="icon-button button-danger" type="button" title="Remove hotel" @click="$emit('remove', hotel.uid)">
          <Icon name="lucide:trash-2" size="17" />
        </button>
      </div>
    </div>

    <div v-if="!hotel.collapsed" class="hotel-body">
      <div class="form-grid three">
        <div class="field">
          <label :for="`hotel-${hotel.uid}-select`">Select hotel</label>
          <select :id="`hotel-${hotel.uid}-select`" v-model="hotel.hotelId" @change="$emit('hotel-change', hotel)">
            <option value="">Select hotel</option>
            <option v-for="item in accommodationList" :key="item.id" :value="item.id">{{ item.name }}</option>
          </select>
        </div>
        <div class="field">
          <label :for="`hotel-${hotel.uid}-category`">Room category</label>
          <select :id="`hotel-${hotel.uid}-category`" v-model="hotel.category">
            <option value="">Select category</option>
            <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>
        <div class="field">
          <span class="field-label">Stars</span>
          <div class="readonly-value">{{ starLabel }}</div>
        </div>
      </div>

      <div class="form-grid three">
        <div class="field">
          <label :for="`hotel-${hotel.uid}-selected-rate`">Package room rate</label>
          <select :id="`hotel-${hotel.uid}-selected-rate`" v-model="hotel.selectedRate">
            <option v-for="room in roomTypes" :key="room.key" :value="room.key">{{ room.label }}</option>
          </select>
        </div>
        <div class="field">
          <label :for="`hotel-${hotel.uid}-meal`">Meal plan</label>
          <select :id="`hotel-${hotel.uid}-meal`" v-model.number="hotel.mealPlan">
            <option :value="0">Room only</option>
            <option :value="125000">Breakfast - IDR 125,000 / guest / night</option>
            <option :value="260000">Half board - IDR 260,000 / guest / night</option>
          </select>
        </div>
        <div class="field">
          <label :for="`hotel-${hotel.uid}-nights`">Nights</label>
          <input :id="`hotel-${hotel.uid}-nights`" v-model.number="hotel.nights" type="number" min="0" step="1" inputmode="numeric">
        </div>
      </div>

      <div class="rate-grid">
        <div class="field-label">Rate type</div>
        <div class="field-label">Rate / night</div>
        <div class="field-label">Room category</div>
        <div class="field-label">Additional</div>
        <div v-for="room in roomTypes" :key="room.key" class="rate-row">
          <div class="rate-name">{{ room.label }}</div>
          <div class="field">
            <input :id="`hotel-${hotel.uid}-${room.key}-rate`" v-model.number="hotel.rates[room.key].rate" type="number" min="0" step="1000" inputmode="numeric">
          </div>
          <div class="field">
            <select :id="`hotel-${hotel.uid}-${room.key}-category`" v-model="hotel.rates[room.key].category">
              <option value="">Select category</option>
              <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>
          <div class="field">
            <select :id="`hotel-${hotel.uid}-${room.key}-additional`" v-model="hotel.rates[room.key].additionalId">
              <option v-for="additional in additionalOptions" :key="additional.id" :value="additional.id">
                {{ additional.name }} ({{ formatCurrency(additional.price) }})
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Hotel, RoomType } from "~/data/pricing";
import type { HotelState } from "~/composables/usePackagePricing";

const props = defineProps<{
  hotel: HotelState;
  accommodationList: Hotel[];
  roomTypes: RoomType[];
  total: number;
  formatCurrency: (value: number) => string;
}>();

defineEmits<{
  remove: [uid: number];
  "hotel-change": [hotel: HotelState];
}>();

const selectedHotel = computed(() => props.accommodationList.find((hotel) => hotel.id === props.hotel.hotelId));
const categoryOptions = computed(() => selectedHotel.value?.roomCategories || []);
const additionalOptions = computed(() => selectedHotel.value?.additionals || [{ id: "none", name: "No additional", price: 0 }]);
const starLabel = computed(() => {
  const stars = selectedHotel.value?.stars;
  return stars ? `${stars} Star${stars > 1 ? "s" : ""}` : "-";
});
</script>
