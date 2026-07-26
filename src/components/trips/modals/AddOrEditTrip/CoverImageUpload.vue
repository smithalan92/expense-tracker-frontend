<script setup lang="ts">
import FieldLabel from "@/components/ui/field/FieldLabel.vue";
import Input from "@/components/ui/input/Input.vue";
import { Upload, XCircle } from "@lucide/vue";
import { computed } from "vue";
import type { TripData } from "./hooks/useTripData";

const { selectedImage, originalImage } = defineProps<{
  selectedImage: TripData["selectedImage"];
  originalImage: TripData["originalImage"];
}>();

const emit = defineEmits<{
  (e: "update", file: Nullable<File>): void;
}>();

const imageUrl = computed(() => {
  if (selectedImage) {
    return URL.createObjectURL(selectedImage);
  }

  return originalImage;
});

const onFileChanged = ($event: Event) => {
  const target = $event.target as HTMLInputElement;
  const [file] = target.files!;
  if (file) {
    emit("update", target.files![0]!);
  }
};

const onRemoveFile = () => {
  emit("update", null);
};
</script>
<template>
  <FieldLabel htmlFor="imagepicker" class="relative cursor-pointer">
    <img v-if="imageUrl" :src="imageUrl" class="h-32 w-full object-cover" />
    <div
      v-if="!imageUrl"
      class="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg bg-card hover:bg-card/60"
    >
      <div class="flex flex-col items-center gap-3">
        <Upload class="size-8" />
        <span class="text-primary font-medium">Choose an image</span>
      </div>
    </div>

    <Input
      id="imagepicker"
      type="file"
      accept="image/*"
      class="text-xs"
      :hidden="true"
      @change="onFileChanged($event)"
    />

    <button v-if="selectedImage" class="absolute bottom-2 right-2 p-1" @click="onRemoveFile">
      <XCircle class="size-10" />
    </button>
  </FieldLabel>
</template>
