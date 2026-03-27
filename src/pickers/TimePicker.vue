<script setup lang="ts">
import isMobileDevice from "@/utils/isMobile";
import { VueDatePicker } from "@vuepic/vue-datepicker";

const time = defineModel<string>();
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
      dark
    />
    <input
      v-if="isMobileDevice"
      class="et-input"
      type="time"
      v-model="time"
    />
  </div>
</template>
