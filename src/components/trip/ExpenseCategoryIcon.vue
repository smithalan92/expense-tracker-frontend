<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from "vue";

interface IconConfig {
  component: Component;
  class: string;
}

const icon = (name: string) =>
  defineAsyncComponent(() =>
    import("@lucide/vue").then((m) => (m as unknown as Record<string, Component>)[name]!),
  );

const iconMap: Record<number, IconConfig> = {
  3: { component: icon("CarTaxiFront"), class: "bg-amber-700" },
  4: { component: icon("Utensils"), class: "bg-teal-700" },
  5: { component: icon("Cigarette"), class: "bg-slate-500" },
  6: { component: icon("Binoculars"), class: "bg-sky-700" },
  7: { component: icon("Shirt"), class: "bg-rose-700" },
  8: { component: icon("Gem"), class: "bg-violet-700" },
  9: { component: icon("Beer"), class: "bg-yellow-700" },
  10: { component: icon("FileQuestionMark"), class: "bg-zinc-500" },
  11: { component: icon("Cookie"), class: "bg-orange-800" },
  12: { component: icon("Coffee"), class: "bg-stone-600" },
  13: { component: icon("BanknoteArrowDown"), class: "bg-green-700" },
  15: { component: icon("HandCoins"), class: "bg-lime-700" },
  16: { component: icon("Gift"), class: "bg-pink-700" },
  17: { component: icon("PlaneTakeoff"), class: "bg-blue-700" },
  18: { component: icon("Bed"), class: "bg-indigo-700" },
};

const fallback: IconConfig = { component: icon("FileQuestionMark"), class: "bg-zinc-500" };

const { categoryId } = defineProps<{ categoryId: number }>();

const iconProps = computed<IconConfig>(() => iconMap[categoryId] ?? fallback);
</script>

<template>
  <div class="flex items-center rounded-sm justify-center w-8 h-8" :class="iconProps.class">
    <Component :is="iconProps.component" class="size-[20px]" />
  </div>
</template>
