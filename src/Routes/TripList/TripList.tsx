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
} from "@/store/slices/trips";
import { useCallback, useEffect } from "react";

export default function TripList() {
  const dispatch = useAppDispatch();
  const trips = useAppSelector(selectTrips);
  const isLoadingTrips = useAppSelector(selectIsLoadingTrips);
  const hasLoadedTrips = useAppSelector(selectHasLoadedTrips);
  const hasFailedToLoadTrips = useAppSelector(selectHasFailedToLoadTrips);
  const shouldShowAddTripModal = useAppSelector(selectShouldShowAddTripModal);

  useEffect(() => {
    if (!hasLoadedTrips) {
      dispatch(loadTrips());
    }
  }, [hasLoadedTrips]);

  const openAddTripModal = () => {
    dispatch(setShouldShowAddTripModal(true));
  };

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

    return (
      <>
        <div className="w-full flex justify-end px-4 mb-2">
          <button className="btn btn-link" onClick={openAddTripModal}>
            Add Trip
          </button>
        </div>
        {trips.map((trip) => {
          return <Trip key={trip.id} trip={trip} />;
        })}
      </>
    );
  }, [isLoadingTrips, hasFailedToLoadTrips, trips]);

  return (
    <div className="w-full h-full pt-8 pr-4 overflow-y-scroll">
      <>
        {maybeRenderLoader()}
        {maybeRenderFailureState()}
        {maybeRenderTripList()}
        {shouldShowAddTripModal && <AddTripModal />}
      </>
    </div>
  );
}
