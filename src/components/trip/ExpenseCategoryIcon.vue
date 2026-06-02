<script setup lang="ts">
import {
  BanknoteArrowDown,
  Bed,
  Beer,
  Binoculars,
  CarTaxiFront,
  Cigarette,
  Coffee,
  Cookie,
  FileQuestionMark,
  Gem,
  Gift,
  HandCoins,
  PlaneTakeoff,
  Shirt,
  Utensils,
  type LucideIcon,
} from "@lucide/vue";
import { computed } from "vue";

interface IconProps {
  component: LucideIcon;
  class: string;
}

const { categoryId } = defineProps<{
  categoryId: number;
}>();

const iconProps = computed<IconProps>(() => {
  switch (categoryId) {
    case 3:
      return { component: CarTaxiFront, class: "bg-amber-700" };
    case 4:
      return { component: Utensils, class: "bg-teal-700" };
    case 5:
      return { component: Cigarette, class: "bg-slate-500" };
    case 6:
      return { component: Binoculars, class: "bg-sky-700" };
    case 7:
      return { component: Shirt, class: "bg-rose-700" };
    case 8:
      return { component: Gem, class: "bg-violet-700" };
    case 9:
      return { component: Beer, class: "bg-yellow-700" };
    case 10:
      return { component: FileQuestionMark, class: "bg-zinc-500" };
    case 11:
      return { component: Cookie, class: "bg-orange-800" };
    case 12:
      return { component: Coffee, class: "bg-stone-600" };
    case 13:
      return { component: BanknoteArrowDown, class: "bg-green-700" };
    case 15:
      return { component: HandCoins, class: "bg-lime-700" };
    case 16:
      return { component: Gift, class: "bg-pink-700" };
    case 17:
      return { component: PlaneTakeoff, class: "bg-blue-700" };
    case 18:
      return { component: Bed, class: "bg-indigo-700" };
    default:
      return { component: FileQuestionMark, class: "bg-zinc-500" };
  }
});
</script>

<template>
  <div class="flex items-center rounded-sm justify-center w-8 h-8" :class="iconProps.class">
    <Component :is="iconProps.component" class="size-[20px]" />
  </div>
</template>
