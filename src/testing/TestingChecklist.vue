<script setup lang="ts">
import useTestingStore from "@/stores/testingStore";
const state = useTestingStore();
</script>
<template>
  <div class="overflow-scroll px-4">
    <div class="flex items-center">
      <h1 class="font-bold text-xl text-slate-100">Testing Checklist</h1>
      <button class="et-btn-primary ml-auto" @click="state.reset">Reset</button>
    </div>
    <template v-for="item in state.getCriteria" :key="item.category">
      <div class="mt-4">
        <h2 class="font-bold text-lg text-slate-200">{{ item.category }}</h2>
        <ul class="mb-4 mt-2">
          <li v-for="criteria in item.criteria" :key="criteria.item">
            <div class="flex items-center py-2">
              <label class="flex items-center cursor-pointer">
                <input type="checkbox" class="et-checkbox" v-model="criteria.done" />
                <span class="ml-4 text-slate-300">{{ criteria.item }}</span>
              </label>
            </div>
          </li>
        </ul>
        <hr class="border-slate-700/50" />
      </div>
    </template>
  </div>
</template>
