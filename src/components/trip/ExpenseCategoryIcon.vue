<script setup lang="ts">
import { cn } from "@/lib/utils";
import { computed, defineAsyncComponent, useAttrs, type Component } from "vue";

defineOptions({ inheritAttrs: false });

interface IconConfig {
  component: Component;
  class: string;
}

const { categoryId, iconClass } = defineProps<{ categoryId: number; iconClass?: string }>();

const icon = (name: string) =>
  defineAsyncComponent(() =>
    import("@lucide/vue").then((m) => (m as unknown as Record<string, Component>)[name]!),
  );

const iconMap: Record<number, IconConfig> = {
  3: { component: icon("CarTaxiFront"), class: "bg-amber-700/70" },
  4: { component: icon("Utensils"), class: "bg-teal-700/70" },
  5: { component: icon("Cigarette"), class: "bg-slate-500/70" },
  6: { component: icon("Binoculars"), class: "bg-sky-700/70" },
  7: { component: icon("Shirt"), class: "bg-rose-700/70" },
  8: { component: icon("Gem"), class: "bg-violet-700/70" },
  9: { component: icon("Beer"), class: "bg-yellow-700/70" },
  10: { component: icon("FileQuestionMark"), class: "bg-zinc-500/70" },
  11: { component: icon("Cookie"), class: "bg-orange-800/70" },
  12: { component: icon("Coffee"), class: "bg-stone-600/70" },
  13: { component: icon("BanknoteArrowDown"), class: "bg-green-700/70" },
  15: { component: icon("HandCoins"), class: "bg-lime-700/70" },
  16: { component: icon("Gift"), class: "bg-pink-700/70" },
  17: { component: icon("PlaneTakeoff"), class: "bg-blue-700/70" },
  18: { component: icon("Bed"), class: "bg-indigo-700/70" },
};

const fallback: IconConfig = { component: icon("FileQuestionMark"), class: "bg-zinc-500/70" };

const iconProps = computed<IconConfig>(() => iconMap[categoryId] ?? fallback);

const attrs = useAttrs();
</script>

<template>
  <div :class="cn('flex items-center rounded-sm justify-center w-8 h-8', iconProps.class, attrs.class)">
    <Component :is="iconProps.component" :class="cn('size-[20px', iconClass)" />
  </div>
</template>
