import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

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
    enabled: false,
  },
  strategies: "generateSW",
  registerType: "prompt",
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
    checker({
      typescript: true,
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
