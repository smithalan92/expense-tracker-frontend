<script setup lang="ts">
const time = defineModel<string>();
const { dataTestId } = defineProps<{
  dataTestId?: string;
}>();
</script>
<template>
  <div class="w-full">
    <input :data-testid="dataTestId" class="et-input" type="time" v-model="time" />
  </div>
</template>
