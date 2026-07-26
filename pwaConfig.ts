import type { VitePWAOptions } from "vite-plugin-pwa";

const pwaOptions: Partial<VitePWAOptions> = {
  base: "/",
  includeAssets: ["favicon.ico", "apple-touch-icon-180x180.png", "logo-app-icon.svg"],
  manifest: {
    name: "expensit",
    short_name: "expensit",
    theme_color: "#1d283a",
    icons: [
      {
        src: "pwa-64x64.png",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
  devOptions: {
    enabled: false,
  },
  strategies: "generateSW",
  registerType: "prompt",
  // "auto" detects that PWAUpdate.vue imports virtual:pwa-register/vue and skips
  // injecting registerSW.js; the explicit "script" here injected it regardless,
  // registering the worker twice. Falls back to "script" if that import is removed.
  injectRegister: "auto",
  workbox: {
    globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
    cleanupOutdatedCaches: true,
    clientsClaim: true,
    // The `thirdparty` vendor chunk is ~2.6 MB, over workbox's 2 MiB default.
    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
  },
};

export default pwaOptions;
