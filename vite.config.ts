import { fileURLToPath, URL } from "node:url";
import checker from "vite-plugin-checker";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";
import svgLoader from "vite-svg-loader";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    svgLoader(),
    checker({
      eslint: {
        lintCommand: "eslint .",
        useFlatConfig: true,
      },
      vueTsc: { tsconfigPath: "tsconfig.app.json" },
      enableBuild: false,
    }),
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
