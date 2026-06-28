<script setup lang="ts">
import useAppStore from "@/stores/appStore";
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";
import SettingsModal from "./SettingsModal.vue";

const { user, logout } = useAppStore();

const router = useRouter();

const dropdownRef = useTemplateRef("dropdown");

const isDropdownVisible = ref(false);

const isSettingsVisible = ref(false);

const onCloseSettings = () => {
  isSettingsVisible.value = false;
};

const onClickOutsideDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    isDropdownVisible.value = false;
  }
};

const onClickOpenSettings = () => {
  isSettingsVisible.value = true;
  isDropdownVisible.value = false;
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
      class="focus:ring-4 focus:ring-sky-500/30 text-md font-bold px-4 mx-2 rounded-full bg-sky-600 text-white w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-sky-500 transition-colors"
      @click="isDropdownVisible = !isDropdownVisible"
    >
      {{ user!.firstName.substring(0, 1).toUpperCase() }}
    </button>
    <div
      v-show="isDropdownVisible"
      class="et-dropdown absolute top-[48px] right-0 z-10 w-44"
      ref="dropdown"
    >
      <div class="py-3 px-4 text-sm border-b border-slate-700/50">
        <div class="text-slate-200">Hey {{ user!.firstName }}!</div>
      </div>
      <ul class="py-1 text-sm text-slate-300">
        <li>
          <span @click="onClickOpenSettings" class="cursor-pointer block py-2 px-4 hover:bg-slate-700/50 transition-colors">
            Settings
          </span>
        </li>
        <li>
          <span @click="onClickLogout" class="cursor-pointer block py-2 px-4 hover:bg-slate-700/50 transition-colors">
            Logout
          </span>
        </li>
      </ul>
    </div>
  </div>
  <SettingsModal v-if="isSettingsVisible" @close="onCloseSettings" />
</template>
