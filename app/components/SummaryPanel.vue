<template>
  <aside class="summary-panel" aria-label="Package summary">
    <div class="summary-title">
      <div>
        <h2>Package Ready</h2>
        <p class="small-note">{{ chargeableGuests }} chargeable guests, {{ nightCount }} {{ nightCount === 1 ? "night" : "nights" }}</p>
      </div>
      <div class="money-big">{{ formatCurrency(totals.grand) }}</div>
    </div>

    <div class="summary-body">
      <div class="breakdown">
        <div class="breakdown-row"><span>Accommodation</span><strong>{{ formatCurrency(totals.accommodation) }}</strong></div>
        <div class="breakdown-row"><span>VISA</span><strong>{{ formatCurrency(totals.visa) }}</strong></div>
        <div class="breakdown-row"><span>Activity</span><strong>{{ formatCurrency(totals.activity) }}</strong></div>
        <div class="breakdown-row"><span>Transportation</span><strong>{{ formatCurrency(totals.transport) }}</strong></div>
        <div class="breakdown-row"><span>Cost subtotal</span><strong>{{ formatCurrency(totals.subtotal) }}</strong></div>
      </div>

      <div class="adjustments">
        <div class="field">
          <label for="markupPercent">Markup %</label>
          <input id="markupPercent" :value="markupPercent" type="number" min="0" step="1" inputmode="numeric" @input="$emit('update:markupPercent', Number(($event.target as HTMLInputElement).value) || 0)">
        </div>
        <div class="field">
          <label for="contingencyPercent">Contingency %</label>
          <input id="contingencyPercent" :value="contingencyPercent" type="number" min="0" step="1" inputmode="numeric" @input="$emit('update:contingencyPercent', Number(($event.target as HTMLInputElement).value) || 0)">
        </div>
      </div>

      <div class="breakdown">
        <div class="breakdown-row"><span>Markup</span><strong>{{ formatCurrency(totals.markup) }}</strong></div>
        <div class="breakdown-row"><span>Contingency</span><strong>{{ formatCurrency(totals.contingency) }}</strong></div>
        <div class="breakdown-row accent"><span>Price / guest</span><strong>{{ formatCurrency(totals.perGuest) }}</strong></div>
      </div>

      <div class="actions">
        <button class="button-primary" type="button" @click="$emit('create')">
          <Icon name="lucide:file-check-2" size="18" />
          <span>Create</span>
        </button>
        <button class="button-secondary" type="button" @click="$emit('copy')">
          <Icon name="lucide:copy" size="18" />
          <span>Copy</span>
        </button>
        <button class="button-secondary" type="button" @click="$emit('print')">
          <Icon name="lucide:printer" size="18" />
          <span>Print</span>
        </button>
        <button class="button-secondary" type="button" @click="$emit('reset')">
          <Icon name="lucide:rotate-ccw" size="18" />
          <span>Reset</span>
        </button>
      </div>

      <div class="save-status">Autosaved</div>
      <div v-if="packageOutput" class="package-output visible" aria-live="polite">{{ packageOutput }}</div>
    </div>
  </aside>
</template>

<script setup lang="ts">
type Totals = {
  accommodation: number;
  visa: number;
  activity: number;
  transport: number;
  subtotal: number;
  markup: number;
  contingency: number;
  grand: number;
  perGuest: number;
};

defineProps<{
  chargeableGuests: number;
  nightCount: number;
  totals: Totals;
  markupPercent: number;
  contingencyPercent: number;
  packageOutput: string;
  formatCurrency: (value: number) => string;
}>();

defineEmits<{
  "update:markupPercent": [value: number];
  "update:contingencyPercent": [value: number];
  create: [];
  copy: [];
  print: [];
  reset: [];
}>();
</script>
