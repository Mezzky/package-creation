<template>
  <aside class="summary-panel" aria-label="Package pricing summary">
    <div class="summary-title">
      <div>
        <h2>Pricing Review</h2>
        <p class="small-note">{{ totalDays }} days, {{ totalNights }} nights</p>
      </div>
    </div>

    <div class="summary-body">
      <div class="pricing-review-list">
        <div v-for="item in pricingReviewRows" :key="item.key" class="pricing-review-item">
          <span>{{ item.label }}</span>
          <strong>{{ formatCurrency(item.total) }}</strong>
          <small>{{ formatCurrency(item.baseTotal) }} + {{ markupPercent }}% markup</small>
        </div>
      </div>

      <div class="adjustments">
        <div class="field">
          <label for="markupPercent">Markup %</label>
          <input id="markupPercent" :value="markupPercent" type="number" min="0" step="1" inputmode="numeric" @input="$emit('update:markupPercent', Number(($event.target as HTMLInputElement).value) || 0)">
        </div>
        <div class="field">
          <span class="field-label">Applied to</span>
          <div class="readonly-value">All price types</div>
        </div>
      </div>

      <div class="actions">
        <button class="button-primary" type="button" @click="$emit('generate')"><Icon name="lucide:file-check-2" size="18" /><span>Generate</span></button>
        <button class="button-secondary" type="button" @click="$emit('copy-json')"><Icon name="lucide:braces" size="18" /><span>JSON</span></button>
        <button class="button-secondary" type="button" @click="$emit('print')"><Icon name="lucide:printer" size="18" /><span>Print</span></button>
        <button class="button-secondary" type="button" @click="$emit('reset')"><Icon name="lucide:rotate-ccw" size="18" /><span>Reset</span></button>
      </div>

      <div class="save-status">Autosaved</div>
      <div v-if="packageOutput" class="package-output visible" aria-live="polite">{{ packageOutput }}</div>
    </div>
  </aside>
</template>

<script setup lang="ts">
type PricingGroup = {
  cost: number;
  selling: number;
};

type PricingTotals = {
  accommodation: PricingGroup;
  activity: PricingGroup;
  transport: PricingGroup;
  visa: PricingGroup;
  totalCost: number;
  productSellingSubtotal: number;
  markup: number;
  sellingPrice: number;
  profit: number;
};

type PricingReviewRow = {
  key: string;
  label: string;
  accommodationTotal: number;
  otherProductsTotal: number;
  baseTotal: number;
  markup: number;
  total: number;
};

defineProps<{
  totalDays: number;
  totalNights: number;
  totals: PricingTotals;
  pricingReviewRows: PricingReviewRow[];
  markupPercent: number;
  packageOutput: string;
  formatCurrency: (value: number) => string;
}>();

defineEmits<{
  "update:markupPercent": [value: number];
  generate: [];
  "copy-json": [];
  print: [];
  reset: [];
}>();
</script>
