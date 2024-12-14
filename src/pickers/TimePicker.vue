<script setup lang="ts">
import isMobileDevice from "@/utils/isMobile";
import VueDatePicker from "@vuepic/vue-datepicker";

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
    />
    <input
      v-if="isMobileDevice"
      class="input input-bordered bg-white py-1 px-4 rounded-md w-full outline-none focus:outline-none"
      type="time"
      v-model="time"
    />
  </div>
</template>
