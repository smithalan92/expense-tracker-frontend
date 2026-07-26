import useTripData from "@/store/tripDataStore";
import { storeToRefs } from "pinia";
import { computed } from "vue";

export default function useGetCurrentTripId() {
  const store = useTripData();

  const { expenses } = storeToRefs(store);

  const filteredExpenses = computed(() => {
    return expenses;
  });

  return {
    filteredExpenses,
  };
}
