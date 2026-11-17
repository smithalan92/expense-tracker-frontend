<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import DialogContent from "@/components/ui/dialog/DialogContent.vue";
import DialogFooter from "@/components/ui/dialog/DialogFooter.vue";
import DialogHeader from "@/components/ui/dialog/DialogHeader.vue";
import DialogTitle from "@/components/ui/dialog/DialogTitle.vue";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useAppStore from "@/store/appStore";
import { getAvatarStyles } from "@/utils/ui";
import { format } from "date-fns";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const appStore = useAppStore();

const {
  user,
  lastCurrencySyncDateTime,
  shouldUseAddExpenseWizard,
  shouldUseAutoCityDetection,
  shouldUseSSEUpdates,
} = storeToRefs(appStore);

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
      <div class="flex flex-col gap-6 px-2 py-8 border-t border-b border-solid border-white/20">
        <div class="flex items-center justify-between">
          <Label for="use-add-expense-wizard">Use add expense wizard</Label>
          <Switch
            id="use-add-expense-wizard"
            data-testid="use-add-expense-wizard-toggle"
            :model-value="shouldUseAddExpenseWizard"
            @update:model-value="appStore.setUseAddExpenseWizard"
          />
        </div>
        <div class="flex items-center justify-between">
          <Label for="use-auto-city-detection">Use auto city detection</Label>
          <Switch
            id="use-auto-city-detection"
            data-testid="use-auto-city-detection"
            :model-value="shouldUseAutoCityDetection"
            @update:model-value="appStore.setUseAutoCityDetection"
          />
        </div>
        <div class="flex items-center justify-between">
          <Label for="use-sse-updates">Use SSE updates</Label>
          <Switch
            id="use-sse-updates"
            data-testid="use-sse-updates"
            :model-value="shouldUseSSEUpdates"
            @update:model-value="appStore.setUseSSEUpdates"
          />
        </div>
      </div>
      <div class="flex flex-col px-2 py-4">
        <div class="text-sm">
          Last currency sync:
          <strong>{{ currencySyncDate }}</strong>
        </div>
      </div>

      <DialogFooter class="gap-4">
        <Button variant="secondary" @click="isModalOpen = false">Close</Button>
        <Button variant="destructive" @click="onClickLogout">Logout</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
