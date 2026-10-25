<script setup lang="ts">
import type { ExpenseUser } from "@/api/expense.ts";
import useTripDataStore from "@/store/tripDataStore.ts";
import { ListFilter, XCircle } from "@lucide/vue";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import Button from "../ui/button/Button.vue";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer/index.ts";
import { Field, FieldLabel } from "../ui/field/index.ts";
import Input from "../ui/input/Input.vue";

const store = useTripDataStore();

const { filters, expenses, unsavedExpenses, areAnyFiltersActive } = storeToRefs(store);
const { clearFilters } = store;

const isDrawerOpen = ref(false);

const availableCategories = computed(() => {
  return Array.from(
    new Map([...expenses.value, ...unsavedExpenses.value].map((e) => [e.category.id, e.category])).values(),
  );
});

const availableUsers = computed(() => {
  const list = expenses.value.reduce((acc, current) => {
    current.users.forEach((u) => {
      if (!acc.has(u.id)) {
        acc.set(u.id, u);
      }
    });

    return acc;
  }, new Map<number, ExpenseUser>());

  return Array.from(list.values());
});

const getCategoryState = (id: number) => {
  if (filters.value.filterByCategoryId === id) return "included";
  if (filters.value.excludedCategoryIds.includes(id)) return "excluded";
  return "off";
};

// off -> included -> excluded -> off
const cycleCategory = (id: number) => {
  const state = getCategoryState(id);

  if (state === "off") {
    filters.value.filterByCategoryId = id;
  } else if (state === "included") {
    filters.value.filterByCategoryId = null;
    filters.value.excludedCategoryIds.push(id);
  } else {
    filters.value.excludedCategoryIds = filters.value.excludedCategoryIds.filter((c) => c !== id);
  }
};

const onClickClearFilters = () => {
  clearFilters();
  isDrawerOpen.value = false;
};
</script>
<template>
  <Button data-testid="open-filters-button" :variant="areAnyFiltersActive ? 'default' : 'outline'" @click="isDrawerOpen = true">
    <ListFilter class="size-4" />
  </Button>

  <Drawer :open="isDrawerOpen" @update:open="isDrawerOpen = $event">
    <DrawerContent class="mx-auto w-full max-w-sm">
      <DrawerHeader class="w-full flex-row items-center space-between flex-1">
        <DrawerTitle class="flex-1">Filters</DrawerTitle>
        <Button variant="ghost" @click="isDrawerOpen = false">
          <XCircle class="size-6" />
        </Button>
      </DrawerHeader>
      <div class="px-4">
        <Field class="pt-4">
          <FieldLabel>Description</FieldLabel>
          <Input
            v-model="filters.search"
            placeholder="Filter by expense description..."
            :hasClearButton="true"
          />
        </Field>
        <Field class="pt-4 overflow-hidden">
          <FieldLabel>Category</FieldLabel>
          <div class="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto">
            <Button
              v-for="category in availableCategories"
              :key="category.id"
              :data-testid="`category-chip-${category.id}`"
              :variant="getCategoryState(category.id) === 'excluded' ? 'destructive' : getCategoryState(category.id) === 'included' ? 'default' : 'outline'"
              :class="getCategoryState(category.id) === 'excluded' ? 'line-through' : ''"
              @click="cycleCategory(category.id)"
            >
              {{ category.name }}
            </Button>
          </div>
          <span class="text-xs text-muted-foreground">Tap once to include, twice to exclude.</span>
        </Field>
        <Field class="pt-4">
          <FieldLabel>User</FieldLabel>
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="user in availableUsers"
              :key="user.id"
              :variant="user.id === filters.filterByUserId ? 'default' : 'outline'"
              @click="filters.filterByUserId = filters.filterByUserId === user.id ? null : user.id"
            >
              {{ user.firstName }}
            </Button>
          </div>
        </Field>
      </div>
      <DrawerFooter>
        <Button variant="secondary" class="w-full mb-2" @click="onClickClearFilters">Clear All</Button>
        <DrawerClose as-child>
          <Button variant="outline" class="w-full">Close</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
