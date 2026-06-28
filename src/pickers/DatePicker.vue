<script setup lang="ts">
const { dataTestId } = defineProps<{
  dataTestId?: string;
}>();

const date = defineModel<string>();
</script>
<template>
  <div>
    <input name="date-picker" :data-testid="dataTestId" class="et-input" type="date" v-model="date" />
  </div>
</template>
