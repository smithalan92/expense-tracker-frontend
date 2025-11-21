<script setup lang="ts">
import Modal from "@/modal/Modal.vue";
import useUserPreferencesStore from "@/stores/userPreferencesStore";
import { storeToRefs } from "pinia";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const userPreferencesStore = useUserPreferencesStore();
const { useAlternativeUI } = storeToRefs(userPreferencesStore);
</script>
<template>
  <Modal @close="emit('close')" title="Settings" :include-close-button="true">
    <template v-slot:body>
      <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full border p-4">
        <legend className="fieldset-legend text-lg">User preferences</legend>
        <label className="label">
          <input type="checkbox" className="toggle" v-model="useAlternativeUI" />
          Use alternative UI
        </label>
      </fieldset>
    </template>
  </Modal>
</template>
