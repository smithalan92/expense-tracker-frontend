<script setup lang="ts">
const { title, type } = defineProps<{
  title: string;
  type?: "danger" | "warning";
}>();

const slots = defineSlots<{
  body(): any;
}>();

const emit = defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <Teleport to="body">
    <div class="et-modal-backdrop overflow-hidden">
      <div
        class="animate-slide-in-bottom et-modal et-modal--position-bottom overflow-hidden box-content w-[410px] p-0 absolute bottom-0 md:relative"
      >
        <div class="relative">
          <div
            class="flex justify-between items-center py-4 px-6 text-white rounded-t-2xl"
            :class="{
              'bg-sky-600': !type,
              'bg-amber-600': type === 'warning',
              'bg-rose-600': type === 'danger',
            }"
          >
            <h2 class="font-bold text-2xl">{{ title }}</h2>
          </div>

          <div class="flex flex-col overflow-scroll p-6">
            <slot name="body" />
          </div>

          <div class="flex pt-6 px-6 pb-4 flex-end">
            <div class="flex flex-1 justify-center">
              <button class="et-btn-secondary mr-4" @click="emit('cancel')">Cancel</button>
              <button
                class="et-btn text-white"
                :class="{
                  'et-btn-primary': !type,
                  'et-btn-danger': type === 'danger',
                  'et-btn-warning': type === 'warning',
                }"
                @click="emit('confirm')"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
