<script setup lang="ts">
import Logo from "@/assets/logo.svg";
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="navbar bg-base-100 pb-4 min-h-20">
    <div class="navbar-start">
      <RouterLink to="/" class="p-2">
        <Logo class="w-32" />
      </RouterLink>
    </div>
    <div class="navbar-end">X</div>
  </div>
</template>
