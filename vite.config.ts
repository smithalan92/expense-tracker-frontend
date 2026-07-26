import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";
import svgLoader from "vite-svg-loader";
import { defineConfig } from "vitest/config";
import pwaOptions from "./pwaConfig";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
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
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "thirdparty";
          }

          return undefined;
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    typecheck: { tsconfig: "./tsconfig.vitest.json" },
  },
});
