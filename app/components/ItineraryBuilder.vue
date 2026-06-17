<template>
  <div class="app-shell">
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand-line">
          <h1>Central Package Builder</h1>
          <div class="status-pill">
            <span>{{ totalDays }} {{ totalDays === 1 ? "day" : "days" }}</span>
            <span>{{ totalNights }} {{ totalNights === 1 ? "night" : "nights" }}</span>
          </div>
        </div>

        <div class="setup-grid package-setup-grid">
          <div class="field">
            <label for="packageName">Package name</label>
            <input id="packageName" v-model="packageName" type="text" autocomplete="off">
          </div>
          <div class="field">
            <label for="destination">Destination</label>
            <input id="destination" v-model="destination" type="text" autocomplete="off">
          </div>
          <div class="field">
            <label for="totalDays">Days</label>
            <input id="totalDays" :value="totalDays" type="number" min="1" step="1" inputmode="numeric" @input="setTotalDays(Number(($event.target as HTMLInputElement).value) || 1)">
          </div>
          <div class="field">
            <label for="totalNights">Nights</label>
            <input id="totalNights" :value="totalNights" type="number" min="0" step="1" inputmode="numeric" @input="setTotalNights(Number(($event.target as HTMLInputElement).value) || 0)">
          </div>
        </div>
      </div>
    </header>

    <main class="workspace">
      <section class="main-panel" aria-label="Central package builder">
        <nav class="tabs" aria-label="Package builder tabs">
          <button class="tab-button" type="button" :aria-selected="activeTab === 'products'" @click="activeTab = 'products'">
            <Icon name="lucide:boxes" size="18" />
            <span>Products</span>
          </button>
          <button class="tab-button" type="button" :aria-selected="activeTab === 'itinerary'" @click="activeTab = 'itinerary'">
            <Icon name="lucide:calendar-days" size="18" />
            <span>Itinerary</span>
          </button>
        </nav>

        <div v-show="activeTab === 'products'" class="tab-panel active">
          <ProductModulesPanel
            :accommodations="accommodations"
            :activities="activities"
            :transportation="transportation"
            :visas="visas"
            :accommodation-list="accommodationList"
            :activity-list="activityList"
            :car-type-list="carTypeList"
            :visa-permit-option-list="visaPermitOptionList"
            :visa-service-option-list="visaServiceOptionList"
            :price-type-list="roomTypes"
            :format-currency="formatCurrency"
            :accommodation-nights="accommodationNights"
            :accommodation-selling="accommodationSelling"
            :activity-selling="activitySelling"
            :transport-selling="transportSelling"
            :visa-selling="visaSelling"
            @add-accommodation="addAccommodation"
            @add-activity="addActivity"
            @add-transportation="addTransportation"
            @add-visa="addVisa"
            @remove-record="removeRecord"
            @apply-accommodation="applyAccommodationDefaults"
            @apply-activity="applyActivityDefaults"
            @apply-transportation="applyTransportationDefaults"
            @apply-visa="applyVisaDefaults"
          />
        </div>

        <div v-show="activeTab === 'itinerary'" class="tab-panel active">
          <ItineraryPresentationPanel
            :itinerary-days="itineraryDays"
            :bali-location-list="baliLocationList"
            :itinerary-tag-list="itineraryTagList"
            :linked-products-for-day="linkedProductsForDay"
          />
        </div>
      </section>

      <CentralPricingSummary
        v-model:markup-percent="markupPercent"
        :total-days="totalDays"
        :total-nights="totalNights"
        :totals="totals"
        :package-output="packageOutput"
        :format-currency="formatCurrency"
        @generate="createPackageOutput"
        @copy-json="copyFrontendJson"
        @print="printPackage"
        @reset="resetBuilder"
      />
    </main>

    <div class="drawer" :class="{ visible: toastVisible }" role="status" aria-live="polite">{{ toastMessage }}</div>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref("products");

const {
  accommodationList,
  activityList,
  carTypeList,
  visaPermitOptionList,
  visaServiceOptionList,
  roomTypes,
  baliLocationList,
  itineraryTagList,
  packageName,
  destination,
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
  accommodationSelling,
  activitySelling,
  transportSelling,
  visaSelling,
  linkedProductsForDay,
  createPackageOutput,
  copyFrontendJson,
  printPackage,
  resetBuilder,
  formatCurrency
} = useItineraryPackageBuilder();
</script>
