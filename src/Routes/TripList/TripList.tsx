import Spinner from "@/components/Spinner";
import Trip from "@/components/Trip/Trip";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  loadTrips,
  selectHasLoadedTrips,
  selectIsLoadingTrips,
  selectTrips,
} from "@/store/slices/trips";
import { useEffect } from "react";

export default function TripList() {
  const dispatch = useAppDispatch();
  const trips = useAppSelector(selectTrips);
  const isLoadingTrips = useAppSelector(selectIsLoadingTrips);
  const hasLoadedTrips = useAppSelector(selectHasLoadedTrips);

  useEffect(() => {
    if (!hasLoadedTrips) {
      dispatch(loadTrips());
    }
  }, [selectHasLoadedTrips]);

  return (
    <div className="w-full h-full">
      {isLoadingTrips && (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {trips &&
        trips.length &&
        trips.map((trip) => {
          return <Trip key={trip.id} trip={trip} />;
        })}
    </div>
  );
}
