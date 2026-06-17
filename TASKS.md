# LuxBali Package Pricing Tasks

## Completed in this pass

- Added SEO metadata, social metadata, theme color, and WebApplication JSON-LD.
- Removed the external Google Fonts dependency so the static page is more reliable on live hosting.
- Added mobile numeric input hints and stronger required/package-name handling.
- Added autosave/restore for quote data using local storage.
- Added Create, Copy, Print, and Reset actions for the quote workflow.
- Added print styles so generated package summaries can be saved as PDF cleanly.
- Converted the package calculator into a Nuxt app with Vue components, typed data, a pricing composable, Nuxt Icon, and Lucide icons.
- Added a README with local development and production build commands.
- Reworked the active Nuxt app into the updated centralized package builder architecture from `PRD.md`.
- Moved Accommodation, Activities, Transportation, and VISA into package-level product records.
- Changed itinerary days so they only contain title and description, with references generated from linked product records.
- Added multi-day accommodation records with Start Day / End Day and automatic nights calculation.
- Added route-based transportation with From Location / To Location.
- Added supplier cost, selling price, package total cost, markup, selling price, profit, and price per guest.
- Added day subtotals, category totals, markup, manual adjustment, selling price, price per guest, and frontend-ready JSON export.

## Next Improvements

- Add PDF export with LuxBali branding if the quote needs to be sent directly to clients.
- Add hotel/activity data editing or import if pricing will change often.
- Add date/season pricing rules for peak, shoulder, and low-season packages.
- Add validation warnings for impossible combinations, such as zero chargeable guests.
- Add optional share links for WhatsApp or email once the final sales workflow is confirmed.
- Decide whether to remove the legacy `package-creation-pricing.html` static file after the Nuxt version is approved.
- Configure deployment target for Nuxt, such as Node server, static generation, or hosting provider preset.
- Connect itinerary products to real backend modules once Accommodation, Activity, Transportation, and VISA APIs are available.

## Research Notes

- Google Search Central recommends JSON-LD as the easiest structured data format to implement and maintain.
- web.dev recommends using native HTML validation rules and clearly communicating input constraints.
- MDN documents `min`, `step`, and number input behavior; this page now keeps explicit constraints and mobile input hints on pricing fields.
