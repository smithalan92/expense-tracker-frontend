<script setup lang="ts">
import useTestingStore from "@/stores/testingStore";
const state = useTestingStore();
</script>
<template>
  <div class="overflow-scroll px-4">
    <div class="flex items-center">
      <h1 class="font-bold text-xl">Testing Checklist</h1>
      <button class="btn btn-primary ml-auto" @click="state.reset">Reset</button>
    </div>
    <template v-for="item in state.getCriteria" :key="item.category">
      <div class="mt-4">
        <h2 class="font-bold text-lg">{{ item.category }}</h2>
        <ul class="mb-4 mt-2">
          <li v-for="criteria in item.criteria" :key="criteria.item">
            <div class="flex items-center py-2">
              <label class="label cursor-pointer">
                <input type="checkbox" class="checkbox" v-model="criteria.done" />
                <span class="label-text ml-4">{{ criteria.item }}</span>
              </label>
            </div>
          </li>
        </ul>
        <hr />
      </div>
    </template>
  </div>
</template>
