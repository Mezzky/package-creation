<template>
  <div class="app-shell">
    <AppTopbar
      v-model:package-name="packageName"
      v-model:adult-count="adultCount"
      v-model:child-count="childCount"
      v-model:infant-count="infantCount"
      v-model:night-count="nightCount"
      :total-guests="totalGuests"
    />

    <main class="workspace">
      <section class="main-panel" aria-label="Package components">
        <nav class="tabs" aria-label="Pricing tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-button"
            type="button"
            role="tab"
            :aria-selected="activeTab === tab.id"
            @click="activeTab = tab.id"
          >
            <Icon :name="tab.icon" size="18" />
            <span>{{ tab.label }}</span>
          </button>
        </nav>

        <div v-show="activeTab === 'accommodation'" class="tab-panel active" role="tabpanel">
          <div class="panel-heading">
            <div>
              <h2>Accommodation / Hotel</h2>
              <p class="small-note">Add one or more hotels and edit each hotel detail below.</p>
            </div>
            <div class="panel-actions">
              <div class="panel-total">{{ formatCurrency(totals.accommodation) }}</div>
              <button class="button-primary" type="button" @click="addHotel">
                <Icon name="lucide:plus" size="18" />
                <span>Add hotel</span>
              </button>
            </div>
          </div>

          <div class="hotel-list" aria-live="polite">
            <HotelCard
              v-for="hotel in hotels"
              :key="hotel.uid"
              :hotel="hotel"
              :accommodation-list="accommodationList"
              :room-types="roomTypes"
              :total="hotelTotal(hotel)"
              :format-currency="formatCurrency"
              @remove="removeHotel"
              @hotel-change="applyHotelDefaults"
              @child-link-change="updateChildRateFromLinked"
            />
          </div>
        </div>

        <div v-show="activeTab === 'visa'" class="tab-panel active" role="tabpanel">
          <div class="panel-heading">
            <div>
              <h2>VISA</h2>
              <p class="small-note">Guest quantity follows the package setup.</p>
            </div>
            <div class="panel-total">{{ formatCurrency(totals.visa) }}</div>
          </div>

          <div class="form-grid three">
            <div class="field">
              <label for="visaType">Visa type</label>
              <select id="visaType" v-model="visaType" @change="applyVisaDefaults">
                <option value="">Select visa type</option>
                <option v-for="visa in visaList" :key="visa.id" :value="visa.id">{{ visa.name }}</option>
              </select>
            </div>
            <div class="field">
              <label for="visaFee">Fee / guest</label>
              <input id="visaFee" v-model.number="visaFee" type="number" min="0" step="1000" inputmode="numeric">
            </div>
            <div class="field">
              <label for="visaServiceFee">Service fee</label>
              <input id="visaServiceFee" v-model.number="visaServiceFee" type="number" min="0" step="1000" inputmode="numeric">
            </div>
          </div>

          <div class="section-line"></div>

          <div class="toggle-row">
            <div class="toggle-copy">
              <strong>Express handling</strong>
              <span>IDR 200,000 / guest</span>
            </div>
            <label class="switch" aria-label="Express handling">
              <input v-model="visaExpress" type="checkbox">
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div v-show="activeTab === 'activity'" class="tab-panel active" role="tabpanel">
          <div class="panel-heading">
            <div>
              <h2>Activity</h2>
              <p class="small-note">Selected activities are multiplied by total guests.</p>
            </div>
            <div class="panel-total">{{ formatCurrency(totals.activity) }}</div>
          </div>

          <div>
            <div v-for="activity in activityList" :key="activity.id" class="toggle-row">
              <div class="toggle-copy">
                <strong>{{ activity.name }}</strong>
                <span>{{ formatCurrency(activity.price) }} / guest</span>
              </div>
              <label class="switch" :aria-label="activity.name">
                <input v-model="selectedActivities[activity.id]" type="checkbox">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="section-line"></div>

          <div class="form-grid">
            <div class="field">
              <label for="privateGuideFee">Private guide fee</label>
              <input id="privateGuideFee" v-model.number="privateGuideFee" type="number" min="0" step="1000" inputmode="numeric">
            </div>
            <div class="field">
              <label for="activityBuffer">Activity buffer</label>
              <select id="activityBuffer" v-model.number="activityBuffer">
                <option :value="0">No buffer</option>
                <option :value="5">5%</option>
                <option :value="10">10%</option>
                <option :value="15">15%</option>
              </select>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'transport'" class="tab-panel active" role="tabpanel">
          <div class="panel-heading">
            <div>
              <h2>Transportation</h2>
              <p class="small-note">Vehicle capacity is shown to help match the group size.</p>
            </div>
            <div class="panel-total">{{ formatCurrency(totals.transport) }}</div>
          </div>

          <div class="form-grid three">
            <div class="field">
              <label for="vehicleType">Vehicle</label>
              <select id="vehicleType" v-model="vehicleType" @change="applyVehicleDefaults">
                <option value="">Select vehicle</option>
                <option v-for="vehicle in vehicleList" :key="vehicle.id" :value="vehicle.id">{{ vehicle.name }} - {{ vehicle.capacity }} pax</option>
              </select>
            </div>
            <div class="field">
              <label for="vehicleQty">Vehicles</label>
              <input id="vehicleQty" v-model.number="vehicleQty" type="number" min="0" step="1" inputmode="numeric">
            </div>
            <div class="field">
              <label for="transportDays">Days</label>
              <input id="transportDays" v-model.number="transportDays" type="number" min="0" step="1" inputmode="numeric">
            </div>
          </div>

          <div class="section-line"></div>

          <div class="form-grid three">
            <div class="field">
              <label for="vehicleRate">Rate / day</label>
              <input id="vehicleRate" v-model.number="vehicleRate" type="number" min="0" step="1000" inputmode="numeric">
            </div>
            <div class="field">
              <label for="airportTransferFee">Airport transfer</label>
              <input id="airportTransferFee" v-model.number="airportTransferFee" type="number" min="0" step="1000" inputmode="numeric">
            </div>
            <div class="field">
              <label for="parkingFuelFee">Parking & fuel</label>
              <input id="parkingFuelFee" v-model.number="parkingFuelFee" type="number" min="0" step="1000" inputmode="numeric">
            </div>
          </div>

          <div class="section-line"></div>

          <div class="toggle-row">
            <div class="toggle-copy">
              <strong>Include airport transfer</strong>
              <span>Applied once per package.</span>
            </div>
            <label class="switch" aria-label="Include airport transfer">
              <input v-model="includeAirportTransfer" type="checkbox">
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </section>

      <SummaryPanel
        v-model:markup-percent="markupPercent"
        v-model:contingency-percent="contingencyPercent"
        :chargeable-guests="chargeableGuests"
        :night-count="nightCount"
        :totals="totals"
        :package-output="packageOutput"
        :format-currency="formatCurrency"
        @create="createPackageSummary"
        @copy="copyPackageSummary"
        @print="printPackage"
        @reset="resetForm"
      />
    </main>

    <div class="drawer" :class="{ visible: toastVisible }" role="status" aria-live="polite">{{ toastMessage }}</div>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref("accommodation");
const tabs = [
  { id: "accommodation", label: "Accommodation", icon: "lucide:hotel" },
  { id: "visa", label: "VISA", icon: "lucide:badge-check" },
  { id: "activity", label: "Activity", icon: "lucide:map" },
  { id: "transport", label: "Transportation", icon: "lucide:car" }
];

const {
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
  totals,
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
} = usePackagePricing();
</script>
