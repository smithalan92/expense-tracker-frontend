<script setup lang="ts">
import useUserStore from "@/user/userStore";
const userStore = useUserStore();
</script>

<template>
  <div className="pr-4 flex-1 overflow-scroll">
    <div className="w-full flex justify-end px-4 pb-4 sticky top-0 z-[1] bg-base-100">
      <h3>Trip List</h3>
      <p>Logged in is {{ userStore.user?.firstName }}</p>
    </div>
  </div>
</template>
