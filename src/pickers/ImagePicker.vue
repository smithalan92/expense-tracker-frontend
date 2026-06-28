<script setup lang="ts">
import { ref, toRefs, watch } from "vue";

const props = defineProps<{
  initalImage: Nullable<string>;
}>();

const { initalImage } = toRefs(props);

const emit = defineEmits<{
  (e: "change-image", file: Nullable<File>): void;
}>();

const selectedImage = ref<null | string>(initalImage.value);

watch(
  initalImage,
  (newValue) => {
    if (newValue) selectedImage.value = newValue;
  },
  {
    immediate: true,
  },
);

const onFileChanged = ($event: Event) => {
  const target = $event.target as HTMLInputElement;
  const [file] = target.files!;
  if (file) {
    selectedImage.value = URL.createObjectURL(target.files![0]!);
    emit("change-image", target.files![0]!);
  }
};

const onRemoveFile = () => {
  selectedImage.value = null;
  emit("change-image", null);
};
</script>

<template>
  <div class="flex-1 relative">
    <label for="imagepicker" class="cursor-pointer">
      <img v-if="selectedImage" :src="selectedImage" class="h-48 w-full object-cover" />

      <div
        v-if="!selectedImage"
        class="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-slate-600/40 rounded-lg bg-slate-800/20 hover:border-sky-500/60 hover:bg-slate-700/30 transition-all group"
      >
        <div class="flex flex-col items-center gap-3">
          <div
            class="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center group-hover:bg-sky-600/30 transition-colors"
          >
            <fa-icon
              :icon="['fas', 'image']"
              size="2x"
              class="text-slate-400 group-hover:text-sky-400 transition-colors"
            />
          </div>
          <div class="flex flex-col items-center gap-1">
            <span class="text-slate-300 font-medium group-hover:text-sky-400 transition-colors"
              >Choose an image</span
            >
          </div>
        </div>
      </div>

      <input
        type="file"
        hidden
        id="imagepicker"
        accept=".jpeg,.jpg,.png,.gif"
        capture
        @change="onFileChanged($event)"
      />
    </label>

    <button v-if="selectedImage" class="absolute bottom-0 right-0 p-1" @click="onRemoveFile">
      <div
        class="flex items-center justify-center bg-gray-100 rounded-full w-12 h-12 p-1 hover:bg-gray-300 text-red-500"
      >
        <fa-icon :icon="['fas', 'xmark']" size="2x" />
      </div>
    </button>
  </div>
</template>
