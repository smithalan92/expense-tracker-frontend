import AddExpenseModal from "@/components/AddExpenseModal/AddExpenseModal";
import ExpenseTable from "@/components/ExpenseTable/ExpenseTable";
import Spinner from "@/components/Spinner";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  loadTripData,
  selectIsLoadingTripData,
  selectHasFailedToTripData,
  syncUnsavedExpenses,
  selectShouldShowAddExpenseModal,
  setShouldShowAddExpenseModal,
  selectCanShowSyncButton,
  selectIsAddingExpense,
  selectIsSyncingUnSavedExpenses,
  selectIsLoadingExpenses,
} from "@/store/slices/tripData";
import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TripData() {
  const { tripId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoadingData = useAppSelector(selectIsLoadingTripData);
  const hasFailedToLoadData = useAppSelector(selectHasFailedToTripData);
  const shouldShowAddExpenseModal = useAppSelector(
    selectShouldShowAddExpenseModal
  );
  const shouldShowSyncButton = useAppSelector(selectCanShowSyncButton);
  const isSavingExpense = useAppSelector(selectIsAddingExpense);
  const isSyncingUnsavedExpenses = useAppSelector(
    selectIsSyncingUnSavedExpenses
  );
  const isLoadingExpenses = useAppSelector(selectIsLoadingExpenses);

  useEffect(() => {
    dispatch(loadTripData(parseInt(tripId!, 10)));
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
    if (
      !isLoadingData &&
      !isSavingExpense &&
      !isSyncingUnsavedExpenses &&
      !isLoadingExpenses
    )
      return null;

    return (
      <div className="absolute w-screen h-screen bg-black/30 z-10 flex items-center justify-center top-0 left-0">
        <Spinner />
      </div>
    );
  }, [isLoadingData, isSavingExpense, isSyncingUnsavedExpenses]);

  const maybeRenderFailureState = useCallback(() => {
    if (!hasFailedToLoadData) return null;

    return (
      <div className="text-center">
        Something went wrong loading expenses. Please refresh the page and try
        again.
      </div>
    );
  }, [hasFailedToLoadData]);

  const maybeRenderExpenseList = useCallback(() => {
    if (isLoadingData || hasFailedToLoadData) return null;

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
  }, [isLoadingData, hasFailedToLoadData, shouldShowSyncButton]);

  return (
    <div className="w-full h-full">
      {maybeRenderLoader()}
      {maybeRenderFailureState()}
      {maybeRenderExpenseList()}
      {shouldShowAddExpenseModal && <AddExpenseModal />}
    </div>
  );
}