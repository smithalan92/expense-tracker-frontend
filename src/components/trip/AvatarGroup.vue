<script setup lang="ts">
import type { ExpenseUser } from "@/api/expense";
import Avatar from "./Avatar.vue";

const { users } = defineProps<{
  users: ExpenseUser[];
}>();
</script>

<template>
  <!-- One or two users as small bubbles, more as a count -->
  <template v-if="users.length === 1">
    <Avatar :user="users[0]" />
  </template>

  <template v-else-if="users.length === 2">
    <div class="flex items-center justify-center">
      <Avatar v-for="u in users" :user="u" :key="u.id" class="-ml-2" />
    </div>
  </template>

  <template v-else>
    <div class="flex -space-x-2">
      <Avatar v-for="u in users.slice(0, 2)" :user="u" :key="u.id" class="-ml-2" />
      <div
        class="h-6 w-6 rounded-full bg-emerald-800 text-emerald-100 flex items-center justify-center text-[0.7rem] font-semibold ring-1 ring-slate-800"
      >
        +{{ users.length - 2 }}
      </div>
    </div>
  </template>
</template>
