<script setup lang="ts">
import useUserPreferencesStore from "@/stores/userPreferencesStore";
import isMobileDevice from "@/utils/isMobile";
import VueDatePicker from "@vuepic/vue-datepicker";
import { toRefs } from "vue";

const date = defineModel<string>();

const { useAlternativeUI } = toRefs(useUserPreferencesStore());
</script>
<template>
  <div>
    <VueDatePicker
      v-if="!isMobileDevice"
      class="w-full"
      v-model="date"
      :enable-time-picker="false"
      :teleport="true"
      model-type="yyyy-MM-dd"
      format="do MMM yyyy"
      auto-apply
    />
    <input
      v-if="isMobileDevice"
      class="input input-bordered py-1 px-4 rounded-md w-full outline-none focus:outline-none"
      :class="{ 'bg-white': !useAlternativeUI }"
      type="date"
      v-model="date"
    />
  </div>
</template>
