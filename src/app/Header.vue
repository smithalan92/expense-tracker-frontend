<script setup lang="ts">
import Logo from "@/assets/logo.svg";
import { useOnline } from "@vueuse/core";
import { RouterLink } from "vue-router";
import UserDropdown from "./UserDropdown.vue";

const isOnline = useOnline();
</script>

<template>
  <div class="navbar bg-base-100 pb-4 min-h-20" :class="{ 'bg-warning': !isOnline }">
    <div class="navbar-start">
      <RouterLink to="/" class="p-2">
        <Logo class="w-32" />
      </RouterLink>
    </div>
    <div v-if="!isOnline" class="navbar-center px-2">
      <fa-icon class="text-red-500" :icon="['fas', 'triangle-exclamation']" />
      <span class="ml-1">No internet connection</span>
    </div>
    <div class="navbar-end">
      <UserDropdown />
    </div>
  </div>
</template>
