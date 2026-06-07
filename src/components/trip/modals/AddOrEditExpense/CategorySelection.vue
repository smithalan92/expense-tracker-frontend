<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import useTripDataStore from "@/store/tripDataStore";
import { storeToRefs } from "pinia";
import ExpenseCategoryChip from "../../ExpenseCategoryChip.vue";

const { selectedCategory } = defineProps<{ selectedCategory: number | null }>();
const emit = defineEmits<{
  (e: "selected", id: number): void;
}>();

const { categories } = storeToRefs(useTripDataStore());
</script>
<template>
  <div class="flex flex-wrap gap-2 h-[120px] overflow-y-scroll p-2">
    <div v-for="category in categories" :key="category.id" :data-category-id="category.id">
      <Button variant="ghost" class="m-0 p-0" @click="emit('selected', category.id)">
        <ExpenseCategoryChip
          :category-id="category.id"
          class="w-full h-auto nowrap p-1.5 box-border"
          icon-class="size-4 mr-2"
          variant="chip"
          :selected="selectedCategory === category.id"
        >
          <span class="text-xs w-full">{{ category.name }}</span>
        </ExpenseCategoryChip>
      </Button>
    </div>
  </div>
</template>
