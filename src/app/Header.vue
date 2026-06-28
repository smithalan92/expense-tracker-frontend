<script setup lang="ts">
import Logo from "@/assets/logo.svg";
import { useOnline } from "@vueuse/core";
import { RouterLink } from "vue-router";
import UserDropdown from "./UserDropdown.vue";

const isOnline = useOnline();
</script>

<template>
  <div class="et-navbar">
    <div class="flex-1">
      <RouterLink to="/" class="p-2">
        <Logo class="w-32" />
      </RouterLink>
    </div>
    <div class="flex items-center">
      <UserDropdown />
    </div>
  </div>
  <div
    v-if="!isOnline"
    class="absolute top-0 et-alert-warning w-full text-center select-none max-w-[800px] py-2 my-2 rounded-lg"
  >
    <fa-icon class="text-amber-100" :icon="['fas', 'triangle-exclamation']" />
    <span class="ml-1 text-amber-100 text-sm font-bold">No internet connection</span>
  </div>
</template>
