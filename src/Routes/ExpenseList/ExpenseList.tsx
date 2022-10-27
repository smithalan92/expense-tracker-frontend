import AddExpenseModal from "@/components/AddExpenseModal/AddExpenseModal";
import ExpenseTable from "@/components/ExpenseTable/ExpenseTable";
import Spinner from "@/components/Spinner";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  loadExpensesForTrip,
  selectCanShowSyncButton,
  selectExpenses,
  selectHasFailedToLoadExpenses,
  selectIsLoadingExpenses,
  selectShouldShowAddExpenseModal,
  setShouldShowAddExpenseModal,
  syncUnsavedExpenses,
} from "@/store/slices/expenses";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ExpenseList() {
  const { tripId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const expenses = useAppSelector(selectExpenses);
  const isLoadingExpenses = useAppSelector(selectIsLoadingExpenses);
  const hasFailedToLoadExpenses = useAppSelector(selectHasFailedToLoadExpenses);
  const shouldShowAddExpenseModal = useAppSelector(
    selectShouldShowAddExpenseModal
  );
  const shouldShowSyncButton = useAppSelector(selectCanShowSyncButton);

  useEffect(() => {
    dispatch(loadExpensesForTrip(parseInt(tripId!, 10)));
  }, [tripId]);

  const onClickGoBack = () => {
    navigate(-1);
  };

  const onClickAddExpense = () => {
    dispatch(setShouldShowAddExpenseModal(true));
  };

  const onClickSync = () => {
    dispatch(syncUnsavedExpenses());
  };

  const maybeRenderLoader = useCallback(() => {
    if (!isLoadingExpenses) return null;

    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }, [isLoadingExpenses]);

  const maybeRenderFailureState = useCallback(() => {
    if (!hasFailedToLoadExpenses) return null;

    <div className="w-full h-full flex justify-center items-center">
      Something went wrong loading expenses. Please refresh the page and try
      again.
    </div>;
  }, [hasFailedToLoadExpenses]);

  const maybeRenderExpenseList = useCallback(() => {
    if (isLoadingExpenses || hasFailedToLoadExpenses) return null;

    if (!expenses || !expenses.length) {
      return (
        <div className="w-full h-full flex justify-center items-center">
          No expenses available
        </div>
      );
    }

    return (
      <>
        <div className="h-160">
          <ExpenseTable />
          <div className="flex justify-end mt-6">
            <button
              className="btn btn-secondary font-bold text-md mr-4"
              onClick={onClickGoBack}
            >
              Back
            </button>
            {shouldShowSyncButton && (
              <button
                className="btn btn-primary font-bold text-md mr-4"
                onClick={onClickSync}
              >
                Sync
              </button>
            )}
            <button
              className="btn btn-primary font-bold text-md"
              onClick={onClickAddExpense}
            >
              Add
            </button>
          </div>
        </div>
      </>
    );
  }, [isLoadingExpenses, hasFailedToLoadExpenses, shouldShowSyncButton]);

  return (
    <div className="w-full h-full">
      {maybeRenderLoader()}
      {maybeRenderFailureState()}
      {maybeRenderExpenseList()}
      {shouldShowAddExpenseModal && <AddExpenseModal />}
    </div>
  );
}
