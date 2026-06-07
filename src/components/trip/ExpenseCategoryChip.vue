<script setup lang="ts">
import { cn } from "@/lib/utils";
import { computed, defineAsyncComponent, useAttrs, type Component } from "vue";

defineOptions({ inheritAttrs: false });

interface IconConfig {
  component: Component;
  iconColour: string;
  bgColour: string;
}

const { categoryId, iconClass, selected } = defineProps<{
  categoryId: number;
  iconClass?: string;
  variant: "chip" | "box";
  selected?: boolean;
}>();

const icon = (name: string) =>
  defineAsyncComponent(() =>
    import("@lucide/vue").then((m) => (m as unknown as Record<string, Component>)[name]!),
  );

const iconMap: Record<number, IconConfig> = {
  3: { component: icon("CarTaxiFront"), iconColour: "text-amber-400", bgColour: "bg-amber-700/70" },
  4: { component: icon("Utensils"), iconColour: "text-teal-400", bgColour: "bg-teal-700/70" },
  5: { component: icon("Cigarette"), iconColour: "text-slate-400", bgColour: "bg-slate-500/70" },
  6: { component: icon("Binoculars"), iconColour: "text-sky-400", bgColour: "bg-sky-700/70" },
  7: { component: icon("Shirt"), iconColour: "text-rose-400", bgColour: "bg-rose-700/70" },
  8: { component: icon("Gem"), iconColour: "text-violet-400", bgColour: "bg-violet-700/70" },
  9: { component: icon("Beer"), iconColour: "text-yellow-400", bgColour: "bg-yellow-700/70" },
  10: { component: icon("FileQuestionMark"), iconColour: "text-zinc-400", bgColour: "bg-zinc-500/70" },
  11: { component: icon("Cookie"), iconColour: "text-orange-400", bgColour: "bg-orange-800/70" },
  12: { component: icon("Coffee"), iconColour: "text-stone-400", bgColour: "bg-stone-600/70" },
  13: { component: icon("BanknoteArrowDown"), iconColour: "text-green-400", bgColour: "bg-green-700/70" },
  15: { component: icon("HandCoins"), iconColour: "text-lime-400", bgColour: "bg-lime-700/70" },
  16: { component: icon("Gift"), iconColour: "text-pink-400", bgColour: "bg-pink-700/70" },
  17: { component: icon("PlaneTakeoff"), iconColour: "text-blue-400", bgColour: "bg-blue-700/70" },
  18: { component: icon("Bed"), iconColour: "text-indigo-400", bgColour: "bg-indigo-700/70" },
};

const fallback: IconConfig = {
  component: icon("FileQuestionMark"),
  iconColour: "text-zinc-400",
  bgColour: "bg-zinc-500/70",
};

const iconProps = computed<IconConfig>(() => iconMap[categoryId] ?? fallback);

const attrs = useAttrs();
</script>

<template>
  <div
    :class="
      cn(
        'flex items-center rounded-sm justify-center w-8 h-8',
        selected ? 'border-2 border-green-300 scale-[1.1]' : '',
        variant === 'box' ? iconProps.bgColour : 'bg-surface-3',
        attrs.class,
      )
    "
  >
    <Component
      :is="iconProps.component"
      :class="cn('size-[20px]', variant === 'chip' ? iconProps.iconColour : '', iconClass)"
    />
    <slot />
  </div>
</template>
