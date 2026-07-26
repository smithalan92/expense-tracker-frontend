<script setup lang="ts">
import type { ExpenseUser } from "@/api/expense";
import { getAvatarStyles } from "@/utils/ui";
import { computed } from "vue";

const { user } = defineProps<{
  user: ExpenseUser;
}>();

const userInitals = computed(() => {
  return `${user.firstName.slice(0, 1)}${user.lastName.slice(0, 1)}`.toUpperCase();
});
</script>
<template>
  <div
    class="h-6 w-6 rounded-full flex items-center justify-center text-[0.7rem] font-bold ring-1"
    :class="getAvatarStyles(user).bg"
  >
    {{ userInitals }}
  </div>
</template>
