<script setup lang="ts">
import Spinner from "@/app/Spinner.vue";

const { position, includeCloseButton, title, height, alignFooter } = defineProps<{
  position?: "center" | "bottom";
  includeCloseButton?: boolean;
  title: string;
  height?: number;
  alignFooter?: "flex-end" | "center";
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <Teleport to="body">
    <div class="et-modal-backdrop overflow-hidden">
      <div
        :class="{
          'animate-slide-in-bottom et-modal overflow-hidden box-content w-[390px] md:w-full p-0': true,
          'absolute bottom-0 md:relative': position !== 'center',
        }"
      >
        <div class="relative">
          <div class="flex justify-between items-center bg-primary py-4 px-6 text-white">
            <h2 class="font-bold text-2xl">{{ title }}</h2>
            <div v-if="includeCloseButton" class="p-1 hover:cursor-pointer" @click="emit('close')">
              <fa-icon :icon="['fas', 'xmark']" class="fill-white" size="2x" />
            </div>
          </div>

          <div
            class="flex flex-col overflow-scroll px-6"
            :style="{ height: height ? `${height}px` : '500px' }"
          >
            <slot name="body" />
          </div>

          <div class="flex pt-6 px-6 pb-4" :style="{ justifyContent: alignFooter ?? '' }">
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
    </div>
  </Teleport>
</template>
