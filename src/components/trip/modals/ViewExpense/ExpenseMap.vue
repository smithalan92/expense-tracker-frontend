<script setup lang="ts">
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
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

  L.marker([latlng.value.lat, latlng.value.lng]).addTo(map);

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
