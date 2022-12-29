import AddExpenseModal from "@/components/Modals/AddExpenseModal/AddExpenseModal";
import ExpenseTable from "@/components/ExpenseTable/ExpenseTable";
import EditExpenseModal from "@/components/Modals/EditExpenseModal/EditExpenseModal";
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
  selectShouldShowEditExpenseModal,
  setShouldShowEditExpenseModal,
} from "@/store/slices/tripData";
import format from "date-fns/format";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as RefreshIcon } from "@/assets/refresh.svg";
import { ReactComponent as BackIcon } from "@/assets/back.svg";

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
  const shouldShowEditExpenseModal = useAppSelector(
    selectShouldShowEditExpenseModal
  );
  const shouldShowSyncButton = useAppSelector(selectCanShowSyncButton);
  const isSavingExpense = useAppSelector(selectIsAddingExpense);
  const isSyncingUnsavedExpenses = useAppSelector(
    selectIsSyncingUnSavedExpenses
  );
  const isLoadingExpenses = useAppSelector(selectIsLoadingExpenses);
  const trip = useAppSelector(selectTrip);

  const [expenseToEdit, _setExpenseToEdit] = useState<null | number>(null);

  const onClickExpense = (expenseId: number) => {
    setExpenseToEdit(expenseId);
    dispatch(setShouldShowEditExpenseModal(true));
  };

  const setExpenseToEdit = (expenseId: number) => {
    _setExpenseToEdit(expenseId);
    dispatch(setShouldShowEditExpenseModal(true));
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
    dispatch(loadTripData(trip.id));
  };

  const onCloseEditExpenseModal = () => {
    dispatch(setShouldShowEditExpenseModal(false));
  };

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
      <div className="absolute w-screen h-screen bg-base-100/30 z-10 flex items-center justify-center top-0 left-0">
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
        <div className="h-full overflow-hidden pt-4 flex flex-col">
          <div className="text-center font-bold text-2xl mb-2">{trip.name}</div>
          <div className="text-center text-md mb-6">
            {tripStartDate} to {tripEndDate}
          </div>
          <div className="overflow-x-auto flex-1">
            <ExpenseTable onClickExpense={onClickExpense} />
          </div>
          <div className="flex justify-center py-6">
            <button
              className="btn btn-accent font-bold text-md mr-2"
              onClick={onClickGoBack}
            >
              <BackIcon className="w-4" />
            </button>
            <button
              className="btn btn-secondary font-bold text-md mr-2"
              onClick={onClickRefresh}
            >
              <RefreshIcon className="w-6 h-6 fill-black" />
            </button>
            <button
              className="btn btn-secondary font-bold text-md mr-2"
              onClick={onClickViewStats}
            >
              Stats
            </button>
            {shouldShowSyncButton && (
              <button
                className="btn btn-primary font-bold text-md mr-2"
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
      {shouldShowEditExpenseModal && (
        <EditExpenseModal
          expenseId={expenseToEdit!}
          onClose={onCloseEditExpenseModal}
        />
      )}
    </div>
  );
}
