<script setup lang="ts">
import isMobileDevice from "@/utils/isMobile";
import VueDatePicker from "@vuepic/vue-datepicker";

const date = defineModel<string>();
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
      type="date"
      v-model="date"
    />
  </div>
</template>
