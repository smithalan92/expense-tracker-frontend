<script setup lang="ts">
import useTripData from "@/store/tripDataStore";
import { ArrowLeft, MessageCircleWarning, RefreshCwIcon } from "@lucide/vue";
import { useRouter } from "vue-router";
import Button from "../ui/button/Button.vue";
import { Spinner } from "../ui/spinner/index.ts";
import useGetCurrentTripId from "./hooks/useGetCurrentTripId";

const { isLoadingTripData, hasFailedToLoadTripData } = defineProps<{
  isLoadingTripData: boolean;
  hasFailedToLoadTripData: boolean;
}>();

const currentTripId = useGetCurrentTripId();
const { loadTripData } = useTripData();
const router = useRouter();
</script>
<template>
  <Spinner v-if="isLoadingTripData" :use-overlay="true" />

  <div v-if="hasFailedToLoadTripData" class="px-4 flex flex-col justify-center h-full">
    <div class="flex flex-col items-center mt-12">
      <MessageCircleWarning class="size-10" />
      <span class="mt-4">Something went wrong loading this trip.</span>
    </div>
    <div class="flex mt-4 justify-center gap-4">
      <Button class="px-1 hover:opacity-70" @click="router.go(-1)">
        <ArrowLeft />
        Back
      </Button>
      <Button class="ml-2 px-1 hover:opacity-70" @click="loadTripData(currentTripId)">
        <RefreshCwIcon />
        Retry
      </Button>
    </div>
  </div>
</template>
