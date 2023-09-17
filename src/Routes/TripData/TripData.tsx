import { ReactComponent as BackIcon } from "@/assets/back.svg";
import { ReactComponent as RefreshIcon } from "@/assets/refresh.svg";
import AddExpenseModal from "@/components/Modals/AddExpenseModal/AddExpenseModal";
import { DeleteTripAlert } from "@/components/Modals/DeleteTripAlert/DeleteTripAlert";
import EditExpenseModal from "@/components/Modals/EditExpenseModal/EditExpenseModal";
import EditTripModal from "@/components/Modals/EditTripModal/EditTripModal";
import TripStatsModal from "@/components/Modals/TripStatsModal/TripStatsModal";
import ExpenseTable from "@/components/sections/ExpenseTable/ExpenseTable";
import Spinner from "@/components/widgets/Spinner";
import SpinnerOverlay from "@/components/widgets/SpinnerOverlay";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  deleteTrip,
  loadTripData,
  resetState,
  selectCanShowSyncButton,
  selectHasFailedToTripData,
  selectIsAddingExpense,
  selectIsLoadingExpenses,
  selectIsLoadingTripData,
  selectIsSyncingUnSavedExpenses,
  selectShouldShowAddExpenseModal,
  selectShouldShowEditExpenseModal,
  selectShouldShowTripStatsModal,
  selectTrip,
  setShouldShowAddExpenseModal,
  setShouldShowEditExpenseModal,
  setShouldShowTripStatsModal,
  syncUnsavedExpenses,
} from "@/store/slices/tripData";
import { showToast } from "@/utils/toast";
import format from "date-fns/format";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  const isDeletingTrip = useAppSelector(
    (state) => state.tripData.isDeletingTrip
  );
  const hasDeletingTripFailed = useAppSelector(
    (state) => state.tripData.hasDeletingTripFailed
  );
  const hasDeletedTrip = useAppSelector(
    (state) => state.tripData.hasDeletedTrip
  );

  const [expenseToEdit, setExpenseToEdit] = useState<null | number>(null);
  const [isEditTripModalOpen, setIsEditTripModalOpen] = useState(false);
  const [isDeleteTripModalOpen, setIsDeleteTripModalOpen] = useState(false);

  const onConfirmDeleteTrip = (shouldDelete: boolean) => {
    if (shouldDelete) {
      dispatch(deleteTrip(trip.id));
    }
    setIsDeleteTripModalOpen(false);
  };

  const onClickExpense = useCallback(
    (expenseId: number) => {
      setExpenseToEdit(expenseId);
      dispatch(setShouldShowEditExpenseModal(true));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(loadTripData(parseInt(tripId!, 10)));
  }, [dispatch, tripId]);

  const onClickGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const onClickAddExpense = useCallback(() => {
    dispatch(setShouldShowAddExpenseModal(true));
  }, [dispatch]);

  const onClickSync = useCallback(() => {
    dispatch(syncUnsavedExpenses());
  }, [dispatch]);

  const onClickViewStats = useCallback(() => {
    dispatch(setShouldShowTripStatsModal(true));
  }, [dispatch]);

  const onClickRefresh = useCallback(() => {
    dispatch(loadTripData(trip.id));
  }, [dispatch, trip]);

  const onCloseEditExpenseModal = () => {
    dispatch(setShouldShowEditExpenseModal(false));
  };

  useEffect(() => {
    if (hasDeletingTripFailed) {
      showToast("Something went wrong deleting the trip. Try again", {
        type: "error",
      });
    }
  }, [hasDeletingTripFailed]);

  useEffect(() => {
    if (hasDeletedTrip) {
      dispatch(resetState());
      navigate("/");
    }
  }, [dispatch, hasDeletedTrip, navigate]);

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
  }, [
    isLoadingData,
    isLoadingExpenses,
    isSavingExpense,
    isSyncingUnsavedExpenses,
  ]);

  const maybeRenderFailureState = useCallback(() => {
    if (!hasFailedToLoadData) return null;

    return (
      <div className="text-center">
        Something went wrong loading expenses. Please refresh the page and try
        again.
      </div>
    );
  }, [hasFailedToLoadData]);

  const maybeRenderContent = useCallback(() => {
    if (isLoadingData || hasFailedToLoadData) return null;

    return (
      <>
        <div className="h-full overflow-hidden pt-4 flex flex-col">
          <div className="text-center font-bold text-2xl mb-2">{trip.name}</div>
          <div className="text-center text-md mb-4">
            {tripStartDate} to {tripEndDate}
          </div>
          <div className="flex justify-end mb-4">
            <button
              className="btn btn-sm btn-secondary ml-2"
              onClick={() => setIsEditTripModalOpen(true)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-error ml-2"
              onClick={() => setIsDeleteTripModalOpen(true)}
            >
              Delete
            </button>
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
  }, [
    isLoadingData,
    hasFailedToLoadData,
    trip.name,
    tripStartDate,
    tripEndDate,
    onClickExpense,
    onClickGoBack,
    onClickRefresh,
    onClickViewStats,
    shouldShowSyncButton,
    onClickSync,
    onClickAddExpense,
  ]);

  return (
    <div className="w-full h-full">
      {maybeRenderLoader()}
      {maybeRenderFailureState()}
      {maybeRenderContent()}
      {shouldShowAddExpenseModal && <AddExpenseModal />}
      {shouldShowTripStatsModal && <TripStatsModal tripId={trip.id} />}
      {shouldShowEditExpenseModal && (
        <EditExpenseModal
          expenseId={expenseToEdit!}
          onClose={onCloseEditExpenseModal}
        />
      )}
      {isEditTripModalOpen && (
        <EditTripModal
          tripId={trip.id}
          onClose={() => setIsEditTripModalOpen(false)}
        />
      )}
      {isDeleteTripModalOpen && (
        <DeleteTripAlert tripId={trip.id} onConfirm={onConfirmDeleteTrip} />
      )}
      {isDeletingTrip && <SpinnerOverlay />}
    </div>
  );
}
