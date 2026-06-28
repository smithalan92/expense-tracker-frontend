<script setup lang="ts">
import Modal from "@/modal/Modal.vue";

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>
<template>
  <Modal @close="emit('close')" title="Settings" :include-close-button="true">
    <template v-slot:body>
      <div class="p-4">
        <p class="text-gray-400">No settings available yet.</p>
      </div>
    </template>
  </Modal>
</template>
