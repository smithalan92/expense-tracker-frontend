<script setup lang="ts">
import Logo from "@/assets/logo.svg";
import { RouterLink } from "vue-router";
import UserDropdown from "./UserDropdown.vue";
</script>

<template>
  <div class="navbar bg-base-100 pb-4 min-h-20">
    <div class="navbar-start">
      <RouterLink to="/" class="p-2">
        <Logo class="w-32" />
      </RouterLink>
    </div>
    <div class="navbar-end">
      <UserDropdown />
    </div>
  </div>
</template>
