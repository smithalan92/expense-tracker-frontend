<script setup lang="ts">
import getFlagComponent from "./getFlagComponent";

const { code } = defineProps<{
  code: string;
}>();

const FlagComponent = getFlagComponent(code);
</script>
<template>
  <Component :is="FlagComponent" />
</template>
