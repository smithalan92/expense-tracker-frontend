<script setup lang="ts">
import useAppStore from "@/stores/appStore";
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";

const { user, logout } = useAppStore();

const router = useRouter();

const dropdownRef = useTemplateRef("dropdown");

const isDropdownVisible = ref(false);

const onClickOutsideDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    isDropdownVisible.value = false;
  }
};

const onClickLogout = () => {
  logout();
  router.push("/login");
};

onMounted(() => {
  // Bind the event listener
  document.addEventListener("mousedown", onClickOutsideDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onClickOutsideDropdown);
});
</script>

<template>
  <div class="relative">
    <button
      class="focus:ring-4 text-md font-bold px-4 mx-2 rounded-full bg-expensr-blue text-white w-10 h-10 flex items-center justify-center"
      @click="isDropdownVisible = !isDropdownVisible"
    >
      {{ user!.firstName.substring(0, 1).toUpperCase() }}
    </button>
    <div
      v-show="isDropdownVisible"
      class="absolute top-[48px] right-0 z-10 w-44 rounded divide-y shadow bg-base-300 divide-base-200"
      ref="dropdown"
    >
      <div class="py-3 px-4 text-sm border-b border-solid border-base-100">
        <div>Hey {{ user!.firstName }}!</div>
      </div>
      <ul class="py-1 text-sm base-content">
        <li>
          <span @click="onClickLogout" class="cursor-pointer block py-2 px-4 hover:bg-base-200">
            Logout
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
