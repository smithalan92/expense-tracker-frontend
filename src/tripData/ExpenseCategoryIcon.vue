<script setup lang="ts">
import { computed } from "vue";

const { categoryId } = defineProps<{
  categoryId: number;
}>();

const iconName = computed(() => {
  switch (categoryId) {
    case 3:
      return "taxi";
    case 4:
      return "utensils";
    case 5:
      return "smoking";
    case 6:
      return "route";
    case 7:
      return "shirt";
    case 8:
      return "gem";
    case 9:
      return "martini-glass";
    case 10:
      return "question";
    case 11:
      return "cookie-bite";
    case 12:
      return "mug-hot";
    case 13:
      return "money-bills";
    case 15:
      return "hand-holding-dollar";
    case 16:
      return "gifts";
    case 17:
      return "plane";
    case 18:
      return "bed";
    default:
      return "question";
  }
});
</script>

<template>
  <fa-icon :icon="['fas', iconName]" class="text-gray-800" />
</template>
