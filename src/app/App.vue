<script setup lang="ts">
import useAppStore from "@/stores/appStore";
import { RouterView } from "vue-router";
import Header from "./Header.vue";

const appStore = useAppStore();
</script>

<template>
  <div
    class="w-full flex flex-col h-full overflow-hidden items-center max-w-[800px] bg-base-100 pb-4"
  >
    <Header v-if="appStore.isLoggedIn" />

    <div class="px-4 w-full max-w-3xl min-w-[390px] flex flex-col h-full overflow-hidden">
      <RouterView />
    </div>
  </div>
</template>
