<script setup lang="ts">
import Modal from "./Modal.vue";

const emit = defineEmits<{
  (e: "delete"): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <Modal title="Confirm Delete?" height="auto">
    <template v-slot:body>
      <slot />
    </template>
    <template v-slot:footer>
      <div class="flex flex-1 justify-center">
        <button class="btn btn-secondary font-bold text-md mr-4" @click="emit('cancel')">
          Cancel
        </button>
        <button class="btn btn-error font-bold text-md" @click="emit('delete')">Delete</button>
      </div>
    </template>
  </Modal>
</template>
