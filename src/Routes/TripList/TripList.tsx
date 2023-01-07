import AddTripModal from "@/components/Modals/AddTripModal/AddTripModal";
import Spinner from "@/components/widgets/Spinner";
import Trip from "@/components/sections/Trip/Trip";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  loadTrips,
  selectHasLoadedTrips,
  selectIsLoadingTrips,
  selectTrips,
  selectHasFailedToLoadTrips,
  selectShouldShowAddTripModal,
  setShouldShowAddTripModal,
  selectIsDeletingTrip,
  selectHasDeletingTripFailed,
  deleteTrip,
} from "@/store/slices/trips";
import { useCallback, useEffect, useState } from "react";
import { ReactComponent as PlusIcon } from "@/assets/plus.svg";
import { DeleteTripAlert } from "@/components/Modals/DeleteTripAlert/DeleteTripAlert";
import SpinnerOverlay from "@/components/widgets/SpinnerOverlay";
import { showToast } from "@/utils/toast";

export default function TripList() {
  const dispatch = useAppDispatch();
  const trips = useAppSelector(selectTrips);
  const isLoadingTrips = useAppSelector(selectIsLoadingTrips);
  const hasLoadedTrips = useAppSelector(selectHasLoadedTrips);
  const hasFailedToLoadTrips = useAppSelector(selectHasFailedToLoadTrips);
  const shouldShowAddTripModal = useAppSelector(selectShouldShowAddTripModal);
  const isDeletingTrip = useAppSelector(selectIsDeletingTrip);
  const hasDeletingTripFailed = useAppSelector(selectHasDeletingTripFailed);
  const [pendingDeleteTripId, setPendingDeleteTripId] = useState<null | number>(
    null
  );

  useEffect(() => {
    if (!hasLoadedTrips) {
      dispatch(loadTrips());
    }
  }, [hasLoadedTrips]);

  const openAddTripModal = () => {
    dispatch(setShouldShowAddTripModal(true));
  };

  const onClickDeleteTrip = (tripId: number) => {
    setPendingDeleteTripId(tripId);
  };

  const onConfirmDeleteTrip = (shouldDelete: boolean) => {
    if (shouldDelete) {
      dispatch(deleteTrip(pendingDeleteTripId!));
    }
    setPendingDeleteTripId(null);
  };

  useEffect(() => {
    if (hasDeletingTripFailed) {
      showToast("Something went wrong deleting the trip. Try again", {
        type: "error",
      });
    }
  }, [hasDeletingTripFailed]);

  const maybeRenderLoader = useCallback(() => {
    if (!isLoadingTrips) return null;

    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }, [isLoadingTrips]);

  const maybeRenderFailureState = useCallback(() => {
    if (!hasFailedToLoadTrips) return null;

    <div className="w-full h-full flex justify-center items-center">
      Something went wrong loading trips. Please refresh the page and try again.
    </div>;
  }, [hasFailedToLoadTrips]);

  const maybeRenderTripList = useCallback(() => {
    if (isLoadingTrips || hasFailedToLoadTrips) return null;

    if (!trips.length) {
      return (
        <div className="w-full h-full flex justify-center items-center">
          No trips available
        </div>
      );
    }

    return trips.map((trip) => {
      return (
        <Trip key={trip.id} trip={trip} onClickDelete={onClickDeleteTrip} />
      );
    });
  }, [isLoadingTrips, hasFailedToLoadTrips, trips]);

  return (
    <div className="pr-4 overflow-scroll">
      <div className="w-full flex justify-end px-4 pb-4 sticky top-0 z-[1] bg-base-100">
        <button
          className="btn btn-sm gap-2 btn-primary text-white"
          onClick={openAddTripModal}
        >
          <PlusIcon className="w-4 h-4" /> Add Trip
        </button>
      </div>
      <>
        {maybeRenderLoader()}
        {maybeRenderFailureState()}
        {maybeRenderTripList()}
        {shouldShowAddTripModal && <AddTripModal />}
        {pendingDeleteTripId && (
          <DeleteTripAlert
            tripId={pendingDeleteTripId}
            onConfirm={onConfirmDeleteTrip}
          />
        )}
        {isDeletingTrip && <SpinnerOverlay />}
      </>
    </div>
  );
}
