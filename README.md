# LuxBali Package Creation

Nuxt centralized travel package builder for LuxBali travel packages.

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

- `app/components/ItineraryBuilder.vue` - main centralized package builder screen
- `app/components/ProductModulesPanel.vue` - package-level Accommodation, Activity, Transportation, and VISA records
- `app/components/ItineraryPresentationPanel.vue` - day-by-day itinerary content with generated product references
- `app/components/CentralPricingSummary.vue` - package cost, selling price, markup, profit, JSON output, print, reset
- `app/composables/useItineraryPackageBuilder.ts` - centralized product records, itinerary references, pricing, frontend JSON output, autosave
- `app/data/pricing.ts` - hotel, visa, activity, vehicle, and room-type data
- `app/assets/css/main.css` - global UI styles
- `public/logo-luxbali.png` - Nuxt-served logo asset

## Notes

The active app follows the updated PRD: package-level products own pricing, itinerary days only own title/description and display generated product references.
