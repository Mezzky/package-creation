<template>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand-line">
        <div class="brand-title">
          <img class="brand-logo" src="/logo-luxbali.png" alt="LuxBali">
          <h1>Package Creation Pricing</h1>
        </div>
        <div class="status-pill">
          <span>{{ totalGuests }} {{ totalGuests === 1 ? "guest" : "guests" }}</span>
          <span>{{ nightCount }} {{ nightCount === 1 ? "night" : "nights" }}</span>
        </div>
      </div>

      <div class="setup-grid">
        <div class="field">
          <label for="packageName">Package name</label>
          <input id="packageName" :value="packageName" type="text" autocomplete="off" required @input="$emit('update:packageName', ($event.target as HTMLInputElement).value)">
        </div>
        <div class="field">
          <label for="adultCount">Adults</label>
          <input id="adultCount" :value="adultCount" type="number" min="0" step="1" inputmode="numeric" @input="$emit('update:adultCount', Number(($event.target as HTMLInputElement).value) || 0)">
        </div>
        <div class="field">
          <label for="childCount">Children</label>
          <input id="childCount" :value="childCount" type="number" min="0" step="1" inputmode="numeric" @input="$emit('update:childCount', Number(($event.target as HTMLInputElement).value) || 0)">
        </div>
        <div class="field">
          <label for="infantCount">Infants</label>
          <input id="infantCount" :value="infantCount" type="number" min="0" step="1" inputmode="numeric" @input="$emit('update:infantCount', Number(($event.target as HTMLInputElement).value) || 0)">
        </div>
        <div class="field">
          <label for="nightCount">Nights</label>
          <input id="nightCount" :value="nightCount" type="number" min="0" step="1" inputmode="numeric" @input="$emit('update:nightCount', Number(($event.target as HTMLInputElement).value) || 0)">
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  packageName: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  nightCount: number;
  totalGuests: number;
}>();

defineEmits<{
  "update:packageName": [value: string];
  "update:adultCount": [value: number];
  "update:childCount": [value: number];
  "update:infantCount": [value: number];
  "update:nightCount": [value: number];
}>();
</script>
