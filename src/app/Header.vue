<script setup lang="ts">
import Logo from "@/assets/logo.svg";
import { useOnline } from "@vueuse/core";
import { RouterLink } from "vue-router";
import UserDropdown from "./UserDropdown.vue";

const isOnline = useOnline();
</script>

<template>
  <div class="navbar bg-base-100 py-6 min-h-20">
    <div class="navbar-start">
      <RouterLink to="/" class="p-2">
        <Logo class="w-32" />
      </RouterLink>
    </div>
    <div class="navbar-end">
      <UserDropdown />
    </div>
  </div>
  <div v-if="!isOnline" class="absolute top-0 bg-warning w-full text-center select-none max-w-[800px]">
    <fa-icon class="text-red-500" :icon="['fas', 'triangle-exclamation']" />
    <span class="ml-1 text-red-500 text-sm font-bold">No internet connection</span>
  </div>
</template>
