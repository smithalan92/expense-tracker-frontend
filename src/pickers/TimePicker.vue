<script setup lang="ts">
import useUserPreferencesStore from "@/stores/userPreferencesStore";
import isMobileDevice from "@/utils/isMobile";
import VueDatePicker from "@vuepic/vue-datepicker";
import { toRefs } from "vue";

const time = defineModel<string>();

const { useAlternativeUI } = toRefs(useUserPreferencesStore());
</script>
<template>
  <div class="w-full">
    <VueDatePicker
      v-if="!isMobileDevice"
      class="w-full"
      v-model="time"
      model-type="HH:mm"
      :teleport="true"
      time-picker
      auto-apply
    />
    <input
      v-if="isMobileDevice"
      class="input input-bordered py-1 px-4 rounded-md w-full outline-none focus:outline-none"
      :class="{ 'bg-white': !useAlternativeUI }"
      type="time"
      v-model="time"
    />
  </div>
</template>
