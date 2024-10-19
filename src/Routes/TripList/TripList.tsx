import { ReactComponent as PlusIcon } from "@/assets/plus.svg";
import AddTripModal from "@/components/Modals/AddTripModal/AddTripModal";
import Trip from "@/components/sections/Trip/Trip";
import { withRequireLogin } from "@/components/utility/withRequireLogin";
import Spinner from "@/components/widgets/Spinner";
import { GET_TRIPS_QUERY } from "@/queries/trips";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectShouldShowAddTripModal,
  setShouldShowAddTripModal,
} from "@/store/slices/trips";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

function TripList() {
  const dispatch = useAppDispatch();
  const shouldShowAddTripModal = useAppSelector(selectShouldShowAddTripModal);
  const {
    isPending: isLoadingTrips,
    error: hasFailedToLoadTrips,
    data,
  } = useQuery(GET_TRIPS_QUERY);

  const trips = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  const openAddTripModal = () => {
    dispatch(setShouldShowAddTripModal(true));
  };

  const maybeRenderLoader = useCallback(() => {
    if (!isLoadingTrips) return null;

    return (
      <div className="w-full h-full flex flex-1 justify-center items-center">
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
    <div className="pr-4 flex-1 overflow-scroll">
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
      </>
    </div>
  );
}

export default withRequireLogin(TripList);
