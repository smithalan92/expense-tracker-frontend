<script setup lang="ts">
import { watch } from "vue";

const date = defineModel<string>();

watch(date, (val) => {
  console.log(val);
});
</script>
<template>
  <div>
    <input class="et-input" type="date" v-model="date" />
  </div>
</template>
