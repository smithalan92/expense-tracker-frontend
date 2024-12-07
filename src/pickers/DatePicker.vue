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
    <input v-if="isMobileDevice" class="w-full p-2" type="date" v-model="date" />
  </div>
</template>
