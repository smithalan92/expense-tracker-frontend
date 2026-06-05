import useUIStateStore from "@/store/uiState";
import { storeToRefs } from "pinia";

/*
  Use this hook with the @animation-end prop of a Drawer that may need to reset the active expense
*/
export default function useActiveExpenseCleanup() {
  const uiState = useUIStateStore();
  const { isViewingExpense, isEditingExpense } = storeToRefs(uiState);
  const { setActiveExpense } = uiState;

  const maybeCleanupActiveExpense = () => {
    if (!isViewingExpense && !isEditingExpense) {
      setActiveExpense(null);
    }
  };

  return {
    maybeCleanupActiveExpense,
  };
}
