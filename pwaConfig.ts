import type { VitePWAOptions } from "vite-plugin-pwa";

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  base: "/",
  includeAssets: ["favicon.svg"],
  manifest: {
    name: "expensit",
    short_name: "expensit",
    theme_color: "#1d283a",
    icons: [
      {
        src: "icon-192x192.png", // <== don't add slash, for testing
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png", // <== don't remove slash, for testing
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "icon-512x512.png", // <== don't add slash, for testing
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  },
  devOptions: {
    enabled: false,
  },
  strategies: "generateSW",
  registerType: "prompt",
  injectRegister: "script",
  workbox: {
    globPatterns: ["**/*.{js,css,html,svg,png,svg,ico}"],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
  },
};

export default pwaOptions;
