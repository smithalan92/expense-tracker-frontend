import type { VitePWAOptions } from "vite-plugin-pwa";

const pwaOptions: Partial<VitePWAOptions> = {
  base: "/",
  manifest: {
    name: "expensit",
    short_name: "expensit",
    // Both track --bg in style.css: oklch(0.155 0.012 55). Hex because manifest
    // colour parsing for oklch isn't reliable across platforms.
    theme_color: "#100b08",
    background_color: "#100b08",
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
