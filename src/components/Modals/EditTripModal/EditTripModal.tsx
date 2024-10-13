import { GetTripEditDataResponse, getTripForEditing } from "@/api";
import SpinnerOverlay from "@/components/widgets/SpinnerOverlay";
import { useAppDispatch, useAppSelector } from "@/store";
import { resetUpdateTripStatus, updateTrip } from "@/store/slices/tripData";
import { showToast } from "@/utils/toast";
import {
  areUserIdsDifferent,
  isAnyCountryDataDifferent,
  isDateDifferent,
  isTripNameDifferent,
} from "@/utils/trip";
import { useCallback, useEffect, useMemo, useState } from "react";
import TripModalHOC, { type TripModalData } from "../TripModalHOC/TripModalHOC";

export interface EditTripModalProps {
  tripId: number;
  onClose: () => void;
}

export default function EditTripModal({ tripId, onClose }: EditTripModalProps) {
  const dispatch = useAppDispatch();
  const [isLoadingTrip, setIsLoadingTrip] = useState(true);
  const [hasTriedToUpdateTrip, setHasTriedToUpdateTrip] = useState(false);
  const isUpdatingTrip = useAppSelector(
    (state) => state.tripData.isUpdatingTrip
  );
  const hasUpdatingTripFailed = useAppSelector(
    (state) => state.tripData.hasUpdatingTripFailed
  );

  const [trip, setTrip] = useState<GetTripEditDataResponse | null>(null);

  // const isUpdatingTrip = useAppSelector(selectIsAddingTrip);
  // const hasFailedToAddTrip = useAppSelector(selectHasAddingTripFailed);
  const [data, setData] = useState<TripModalData | null>(null);

  const onChangeData = useCallback((newData: TripModalData) => {
    setData(newData);
  }, []);

  const close = useCallback(() => {
    dispatch(resetUpdateTripStatus());
    onClose();
  }, [dispatch, onClose]);

  useEffect(() => {
    getTripForEditing(tripId).then((tripData) => {
      setTrip(tripData);
      setIsLoadingTrip(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canUpdateTrip = useMemo(() => {
    if (data === null || trip === null) return false;

    const isNameDifferent =
      isTripNameDifferent(data.name, trip.name) && data.name.trim() !== "";
    const isStartDateDifferent = isDateDifferent(
      data.startDate,
      trip.startDate
    );
    const isEndDateDifferent = isDateDifferent(data.endDate, trip.endDate);
    const isUserIdsDifferent = areUserIdsDifferent(data.userIds, trip.userIds);
    const areCountriesDifferent = isAnyCountryDataDifferent(
      data.countries,
      trip.countries
    );

    return (
      isNameDifferent ||
      isStartDateDifferent ||
      isEndDateDifferent ||
      isUserIdsDifferent ||
      areCountriesDifferent ||
      data.file
    );
  }, [data, trip]);

  const onClickUpdateTrip = useCallback(() => {
    dispatch(updateTrip({ tripId, newData: data!, oldData: trip! }));
    setHasTriedToUpdateTrip(true);
  }, [data, dispatch, trip, tripId]);

  useEffect(() => {
    if (hasUpdatingTripFailed) {
      showToast("Something went wrong adding the trip. Try again", {
        type: "error",
      });
    }
  }, [hasUpdatingTripFailed]);

  useEffect(() => {
    if (hasTriedToUpdateTrip && !isUpdatingTrip && !hasUpdatingTripFailed) {
      close();
    }
  }, [hasTriedToUpdateTrip, isUpdatingTrip, hasUpdatingTripFailed, close]);

  return (
    <>
      {trip && (
        <TripModalHOC
          title={`Edit ${trip.name}`}
          onChangeData={onChangeData}
          initalData={trip}
          footer={
            <>
              <button
                className="btn btn-secondary font-bold text-md mr-4"
                onClick={close}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary font-bold text-md"
                disabled={!canUpdateTrip}
                onClick={onClickUpdateTrip}
              >
                Update
              </button>
            </>
          }
        />
      )}
      {(isUpdatingTrip || isLoadingTrip) && <SpinnerOverlay />}
    </>
  );
}
