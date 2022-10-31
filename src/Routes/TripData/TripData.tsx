import AddExpenseModal from "@/components/AddExpenseModal/AddExpenseModal";
import { DeleteExpenseAlert } from "@/components/DeleteExpenseAlert/DeleteExpenseAlert";
import ExpenseTable from "@/components/ExpenseTable/ExpenseTable";
import Spinner from "@/components/Spinner";
import TripStatsModal from "@/components/TripStatsModal/TripStatsModal";
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
  selectTrip,
  selectShouldShowTripStatsModal,
  setShouldShowTripStatsModal,
} from "@/store/slices/tripData";
import format from "date-fns/format";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as RefreshIcon } from "@/assets/refresh.svg";

export default function TripData() {
  const { tripId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoadingData = useAppSelector(selectIsLoadingTripData);
  const hasFailedToLoadData = useAppSelector(selectHasFailedToTripData);
  const shouldShowAddExpenseModal = useAppSelector(
    selectShouldShowAddExpenseModal
  );
  const shouldShowTripStatsModal = useAppSelector(
    selectShouldShowTripStatsModal
  );
  const shouldShowSyncButton = useAppSelector(selectCanShowSyncButton);
  const isSavingExpense = useAppSelector(selectIsAddingExpense);
  const isSyncingUnsavedExpenses = useAppSelector(
    selectIsSyncingUnSavedExpenses
  );
  const isLoadingExpenses = useAppSelector(selectIsLoadingExpenses);
  const trip = useAppSelector(selectTrip);

  const [expenseToDelete, setExpenseToDelete] = useState<null | number>(null);

  const onClickExpense = (expenseId: number) => {
    setExpenseToDelete(expenseId);
  };

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

  const onClickViewStats = () => {
    dispatch(setShouldShowTripStatsModal(true));
  };

  const onClickRefresh = () => {
    dispatch(loadTripData(trip.id))
  }

  const tripStartDate = useMemo(() => {
    if (!trip.startDate) return "";
    return format(new Date(trip.startDate), "dd MMM yyyy");
  }, [trip]);

  const tripEndDate = useMemo(() => {
    if (!trip.startDate) return "";
    return format(new Date(trip.endDate), "dd MMM yyyy");
  }, [trip]);

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
        <div className="h-160 pt-4">
          <div className="text-center ml-2 font-bold text-2xl mb-2 text-white">
            {trip.name}
          </div>
          <div className="text-center ml-2 text-md mb-6">
            {tripStartDate} to {tripEndDate}
          </div>
          <div className="overflow-x-auto">
          <ExpenseTable onClickExpense={onClickExpense} />
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="btn btn-secondary font-bold text-md mr-4"
              onClick={onClickGoBack}
            >
              Back
            </button>
            <button className="btn btn-accent font-bold text-md mr-4" onClick={onClickRefresh}>
              <RefreshIcon className="w-6 h-6 fill-black"/>
            </button>
            <button
              className="btn btn-accent font-bold text-md mr-4"
              onClick={onClickViewStats}
            >
              Stats
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
      {shouldShowTripStatsModal && (
        <TripStatsModal tripId={parseInt(tripId!, 10)} />
      )}
      {expenseToDelete! !== null && (
        <DeleteExpenseAlert
          expenseId={expenseToDelete!}
          onClose={() => setExpenseToDelete(null)}
        />
      )}
    </div>
  );
}
