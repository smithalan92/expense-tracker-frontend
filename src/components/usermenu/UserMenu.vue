<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import DialogFooter from "@/components/ui/dialog/DialogFooter.vue";
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue";
import DialogTitle from "@/components/ui/dialog/DialogTitle.vue";
import useAppStore from "@/store/appStore";
import { getAvatarStyles } from "@/utils/ui";
import { format } from "date-fns";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const appStore = useAppStore();

const { user, lastCurrencySyncDateTime } = storeToRefs(appStore);

const isModalOpen = ref(false);

const currencySyncDate = computed(() =>
  format(new Date(lastCurrencySyncDateTime.value), "do MMM yyyy HH:mm"),
);

const userInitals = computed(() => {
  if (!user) return "";
  return `${user.value?.firstName.slice(0, 1)}${user.value?.lastName.slice(0, 1)}`.toUpperCase();
});

const onClickLogout = () => {
  appStore.logout();
};
</script>
<template>
  <div v-if="user" @click="isModalOpen = true" class="p-2">
    <div
      class="h-6 w-6 rounded-full flex items-center justify-center text-[0.7rem] font-bold ring-1"
      :class="getAvatarStyles(user).bg"
    >
      {{ userInitals }}
    </div>
  </div>

  <Dialog v-model:open="isModalOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Hi {{ user?.firstName }}</DialogTitle>
      </DialogHeader>
      <div class="flex flex-col">
        <div class="p-2">
          Last currency sync:
          <strong>{{ currencySyncDate }}</strong>
        </div>
      </div>

      <DialogFooter>
        <Button variant="destructive" @click="onClickLogout">Logout</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
