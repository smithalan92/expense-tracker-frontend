<script setup lang="ts">
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
// Leaflet resolves its default icon URLs at runtime, which breaks once Vite
// hashes assets in production builds. Import them so they're bundled.
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const initialMap = ref<L.Map | null>(null);
const mapEl = ref<HTMLDivElement | null>(null);

const props = defineProps<{ latlng: string }>();

const latlng = computed(() => {
  const [lat, lng] = props.latlng.split(",");

  return { lat: parseFloat(lat), lng: parseFloat(lng) };
});

onMounted(() => {
  const map = L.map(mapEl.value!, { attributionControl: false }).setView(
    [latlng.value.lat, latlng.value.lng],
    13,
  );
  L.tileLayer(
    `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${import.meta.env.VITE_CARTO_API_KEY}`,
    {
      maxZoom: 18,
    },
  ).addTo(map);

  const icon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  L.marker([latlng.value.lat, latlng.value.lng], { icon }).addTo(map);

  initialMap.value = map;

  // The drawer this map lives in slides in over ~500ms, so Leaflet's initial
  // size read happens while the container is still animating. Recompute once
  // the transition settles so tiles aren't left misaligned/blank.
  window.setTimeout(() => initialMap.value?.invalidateSize(), 550);
});

onBeforeUnmount(() => {
  initialMap.value?.remove();
});
</script>
<template>
  <div class="w-full">
    <div ref="mapEl" class="w-full" style="height: 200px"></div>
  </div>
</template>
