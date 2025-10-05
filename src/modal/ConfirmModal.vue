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
        class="'animate-slide-in-bottom et-modal overflow-hidden box-content w-[350px] p-0 absolute bottom-0 md:relative"
      >
        <div class="relative">
          <div
            class="flex justify-between items-center py-4 px-6 text-white"
            :class="{
              'bg-primary': !type,
              'bg-orange-500': type === 'warning',
              'bg-red-500': type === 'danger',
            }"
          >
            <h2 class="font-bold text-2xl">{{ title }}</h2>
          </div>

          <div class="flex flex-col overflow-scroll p-6">
            <slot name="body" />
          </div>

          <div class="flex pt-6 px-6 pb-4 flex-end">
            <div class="flex flex-1 justify-center">
              <button class="btn font-bold tn-outline text-md mr-4" @click="emit('cancel')">Cancel</button>
              <button
                class="btn font-bold text-md text-white"
                :class="{
                  'btn-primary': !type,
                  'btn-error': type === 'danger',
                  'btn-warning': type === 'warning',
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
