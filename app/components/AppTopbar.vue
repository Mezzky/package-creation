<template>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="brand-line">
        <h1>Package Creation Pricing</h1>
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
          <label for="guestCount">Guests</label>
          <input id="guestCount" :value="guestCount" type="number" min="0" step="1" inputmode="numeric" @input="$emit('update:guestCount', Number(($event.target as HTMLInputElement).value) || 0)">
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
  guestCount: number;
  nightCount: number;
  totalGuests: number;
}>();

defineEmits<{
  "update:packageName": [value: string];
  "update:guestCount": [value: number];
  "update:nightCount": [value: number];
}>();
</script>
