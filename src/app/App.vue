<script setup lang="ts">
import useUserStore from "@/user/userStore";
import { RouterView } from "vue-router";
import Header from "./Header.vue";

const userStore = useUserStore();
</script>

<template>
  <div class="w-full flex flex-col h-full overflow-hidden items-center max-w-[800px] bg-base-100">
    <Header v-if="userStore.isLoggedIn" />

    <div class="px-4 w-full max-w-3xl min-w-[390px] flex flex-col h-full overflow-hidden">
      <RouterView />
    </div>
  </div>
</template>
