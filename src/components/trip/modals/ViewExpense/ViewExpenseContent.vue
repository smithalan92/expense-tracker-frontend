S
<script setup lang="ts">
import type { TripExpense } from "@/api/expense.ts";
import Button from "@/components/ui/button/Button.vue";
import { DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import Separator from "@/components/ui/separator/Separator.vue";
import useUIStateStore from "@/store/uiState.ts";
import { Calendar, Copy, Edit, MapPin, Notebook, Trash, User } from "@lucide/vue";
import { format } from "date-fns";
import { computed } from "vue";
import ExpenseCategoryIcon from "../../ExpenseCategoryIcon.vue";

const { expense } = defineProps<{ expense: TripExpense }>();
const { setIsEditingExpense, setIsViewingExpense } = useUIStateStore();

const date = computed(() => format(new Date(expense.localDateTime), "HH:mm, do MMM yyyy"));
const users = computed(() => expense.users.map((u) => u.firstName).join(", "));
</script>
<template>
  <DrawerContent :disable-outside-pointer-events="true">
    <div class="mx-auto w-full max-w-sm">
      <DrawerHeader>
        <DrawerTitle class="text-2xl">€{{ expense.euroAmount }}</DrawerTitle>
      </DrawerHeader>
      <div class="flex flex-col text-muted-foreground text-sm px-4 mb-4">
        <div class="flex mt-2 items-center">
          <Notebook class="mr-1 size-[12px]" />
          <span v-if="expense.description.trim()">{{ expense.description }}</span>
          <span v-else class="italic">No description provided...</span>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div class="flex items-center">
            <MapPin class="mr-1 size-[12px]" />
            {{ expense.city.name }}, {{ expense.country.name }}
          </div>
          <div class="h-4">
            <Separator orientation="vertical" />
          </div>
          <div class="flex items-center gap-1">
            <ExpenseCategoryIcon
              :category-id="expense.category.id"
              class="inline-flex w-4 h-4"
              icon-class="size-[12px]"
            />
            {{ expense!.category.name }}
          </div>
        </div>
        <div class="flex mt-2 items-center">
          <Calendar class="mr-1 size-[12px]" />
          <span>{{ date }}</span>
        </div>
        <div class="flex mt-2 items-center">
          <User class="mr-1 size-[12px]" />
          <span>{{ users }}</span>
        </div>
      </div>
      <DrawerFooter class="flex-1">
        <div class="grid grid-cols-3 gap-2">
          <Button @click="setIsEditingExpense(true)">
            <Edit class="mr-1 size-[12px]" />
            Edit
          </Button>
          <Button variant="secondary" @click="setIsEditingExpense(true)">
            <Copy class="mr-1 size-[12px]" />
            Copy
          </Button>
          <Button variant="destructive" @click="setIsEditingExpense(true)">
            <Trash class="mr-1 size-[12px]" />
            Delete
          </Button>
        </div>
        <Button variant="outline" class="mt-6" @click="setIsViewingExpense(false)">Cancel</Button>
      </DrawerFooter>
    </div>
  </DrawerContent>
</template>
