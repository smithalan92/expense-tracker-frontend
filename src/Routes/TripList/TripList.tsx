import Spinner from "@/components/Spinner";
import Trip from "@/components/Trip/Trip";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  loadTrips,
  selectHasLoadedTrips,
  selectIsLoadingTrips,
  selectTrips,
  selectHasFailedToLoadTrips,
} from "@/store/slices/trips";
import { useCallback, useEffect } from "react";

export default function TripList() {
  const dispatch = useAppDispatch();
  const trips = useAppSelector(selectTrips);
  const isLoadingTrips = useAppSelector(selectIsLoadingTrips);
  const hasLoadedTrips = useAppSelector(selectHasLoadedTrips);
  const hasFailedToLoadTrips = useAppSelector(selectHasFailedToLoadTrips);

  useEffect(() => {
    if (!hasLoadedTrips) {
      dispatch(loadTrips());
    }
  }, [hasLoadedTrips]);

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
      return <Trip key={trip.id} trip={trip} />;
    });
  }, [isLoadingTrips, hasFailedToLoadTrips, trips]);

  return (
    <div className="w-full h-full pt-8">
      <>
        {maybeRenderLoader()}
        {maybeRenderFailureState()}
        {maybeRenderTripList()}
      </>
    </div>
  );
}
