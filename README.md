# LuxBali Package Creation

Nuxt package-pricing calculator for LuxBali travel packages.

## Stack

- Nuxt 4
- Vue 3
- Nuxt Icon
- Lucide icon collection

## Run Locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://127.0.0.1:3000/
```

## Build

```powershell
npm.cmd run build
```

Preview a production build:

```powershell
node .output/server/index.mjs
```

## Project Structure

- `app/components/PackageCalculator.vue` - main calculator screen
- `app/components/AppTopbar.vue` - logo, title, and package setup inputs
- `app/components/HotelCard.vue` - accommodation card and room-rate inputs
- `app/components/SummaryPanel.vue` - totals, markup, quote output, copy, print, reset
- `app/composables/usePackagePricing.ts` - pricing state, totals, autosave, reset, export actions
- `app/data/pricing.ts` - hotel, visa, activity, vehicle, and room-type data
- `app/assets/css/main.css` - global UI styles
- `public/logo-luxbali.png` - Nuxt-served logo asset

## Notes

The calculator defaults to a blank quote: zero guests, zero nights, no selected services, and zero fees.
