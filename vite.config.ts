import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  base: "/",
  includeAssets: ["favicon.svg"],
  manifest: {
    name: "expensr",
    short_name: "expensr",
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
    enabled: true,
  },
  strategies: "generateSW",
  registerType: "autoUpdate",
  injectRegister: "script",
  workbox: {
    globPatterns: ["**/*.{js,css,html}", "**/*.{svg,png,jpg,gif}"],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA(pwaOptions),
    svgr({
      svgrOptions: {
        expandProps: "start",
        dimensions: false,
      },
    }),
  ],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
