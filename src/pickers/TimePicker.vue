<script setup lang="ts">
const time = defineModel<string>();
</script>
<template>
  <div class="w-full">
    <input class="et-input" type="time" v-model="time" />
  </div>
</template>
