export default defineNuxtConfig({
  compatibilityDate: "2026-06-12",
  devtools: { enabled: false },
  modules: ["@nuxt/icon"],
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: "LuxBali Package Creation Pricing",
      meta: [
        { name: "description", content: "LuxBali package pricing calculator for Bali accommodation, visa, activity, transport, markup, and per-guest quote totals." },
        { name: "theme-color", content: "#0a4e90" },
        { property: "og:title", content: "LuxBali Package Creation Pricing" },
        { property: "og:description", content: "Build and review Bali travel package prices with accommodation, visa, activities, transport, and per-guest totals." },
        { property: "og:type", content: "website" }
      ],
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "LuxBali Package Creation Pricing",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            description: "A Bali travel package pricing calculator for accommodation, visa, activities, transportation, markup, contingency, and per-guest totals.",
            publisher: {
              "@type": "Organization",
              name: "LuxBali"
            }
          })
        }
      ]
    }
  }
});
