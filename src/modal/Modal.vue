<script setup lang="ts">
import Spinner from "@/app/Spinner.vue";
import { computed } from "vue";

const { position, includeCloseButton, title, height, alignFooter, width } = defineProps<{
  position?: "center" | "bottom";
  includeCloseButton?: boolean;
  title?: string;
  height?: number | "auto";
  alignFooter?: "flex-end" | "center" | "space-between";
  isLoading?: boolean;
  width?: number;
}>();

const slots = defineSlots<{
  title?(): any;
  alert?(): any;
  body(): any;
  footer(): any;
}>();

const bodyHeight = computed(() => {
  if (height === "auto") return "auto";
  if (!height) return "500px";
  return `${height}px`;
});

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <Teleport to="body">
    <div class="et-modal-backdrop overflow-hidden">
      <div
        :class="{
          'animate-slide-in-bottom et-modal overflow-hidden box-content w-full max-w-[420px] p-0': true,
          'absolute bottom-0 md:relative et-modal--position-bottom': position !== 'center',
        }"
        :style="{
          width: width ? `${width}px` : '',
          maxHeight: '90vh',
        }"
      >
        <div class="et-modal__header">
          <h2 v-if="!slots.title" class="et-modal__title">{{ title }}</h2>
          <div v-if="slots.title" class="flex-1">
            <slot name="title" />
          </div>
          <button class="et-modal__close" @click="emit('close')">
            <fa-icon :icon="['fas', 'xmark']" />
          </button>
        </div>

        <slot name="alert" />

        <div class="et-modal__body" :style="{ height: bodyHeight }">
          <slot name="body" />
        </div>

        <div class="et-modal__footer" :style="{ justifyContent: alignFooter ?? 'flex-end' }">
          <slot name="footer" />
        </div>

        <div
          v-if="isLoading"
          class="overflow-hidden absolute top-0 left-0 w-full h-full flex items-center justify-center flex-1"
          style="background-color: rgb(0 0 0 / 0.2); backdrop-filter: blur(2px)"
        >
          <Spinner />
        </div>
      </div>
    </div>
  </Teleport>
</template>
