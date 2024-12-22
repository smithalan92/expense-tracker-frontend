import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";
import vueDevTools from "vite-plugin-vue-devtools";
import svgLoader from "vite-svg-loader";

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
    globPatterns: ["**/*.{js,css,html}", "**/*.{svg,png,jpg,gif}"],
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    svgLoader(),
    checker({
      vueTsc: { tsconfigPath: "tsconfig.app.json" },
      enableBuild: false,
    }),
    VitePWA(pwaOptions),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    open: true,
  },
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("@fortawesome")) {
            return "faicons";
          } else if (id.includes("node_modules")) {
            return "thirdparty";
          }

          return undefined;
        },
      },
    },
  },
});
