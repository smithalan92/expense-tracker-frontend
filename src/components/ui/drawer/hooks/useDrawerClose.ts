import useUIStateStore from "@/store/uiState";
import { storeToRefs } from "pinia";
import { ref, watch, type Ref } from "vue";

/*
  Use this hook with the @animation-end prop of a Drawer that may need to reset the active expense
*/
export default function useDrawerClose(isDrawerOpen: Ref<boolean>) {
  const uiState = useUIStateStore();
  const { isViewingExpense, isAddingOrEditingExpense, isCopyingExpense, isAddingOrEditingTrip } =
    storeToRefs(uiState);
  const { setActiveExpense, setActiveTripData } = uiState;

  const isContentOpen = ref(false);

  watch(isDrawerOpen, (newValue) => {
    if (newValue) isContentOpen.value = true;
  });

  const onAnimationEnd = (open: boolean) => {
    if (open) return;

    if (!isViewingExpense.value && !isAddingOrEditingExpense.value && !isCopyingExpense) {
      setActiveExpense(null);
    }

    if (!isAddingOrEditingTrip.value) {
      setActiveTripData(null);
    }

    isContentOpen.value = false;
  };

  return {
    onAnimationEnd,
    isContentOpen,
  };
}
