import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

// logo-app-icon.svg is already a full-bleed 512x512 icon: an opaque #3a2a20
// background with the mark inset well inside it. The preset defaults
// (padding 0.3, background "white") therefore shrink it to 70% and mat the
// result onto white, which Android renders as white borders around the icon.
// padding 0 lets the artwork's own background reach the canvas edge; the
// explicit background is belt-and-braces in case the source ever gains alpha.
const background = "#3a2a20";

export default defineConfig({
  images: ["public/logo-app-icon.svg"],
  preset: {
    ...minimal2023Preset,
    transparent: {
      ...minimal2023Preset.transparent,
      padding: 0,
    },
    maskable: {
      sizes: [512],
      padding: 0,
      resizeOptions: { background },
    },
    apple: {
      sizes: [180],
      padding: 0,
      resizeOptions: { background },
    },
  },
});
