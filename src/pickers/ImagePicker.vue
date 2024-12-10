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

console.log(initalImage.value);

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
    selectedImage.value = URL.createObjectURL(target.files![0]);
    emit("change-image", target.files![0]);
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
        class="w-full h-48 flex items-center justify-center border border-dotted border-black rounded"
      >
        Choose an image
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
