import SpinnerOverlay from "@/components/widgets/SpinnerOverlay";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addTrip,
  selectHasAddingTripFailed,
  selectIsAddingTrip,
  setShouldShowAddTripModal,
} from "@/store/slices/trips";
import { useEffect, useMemo, useState } from "react";
import TripModalHOC from "../TripModalHOC/TripModalHOC";
import { TripModalData } from "../TripModalHOC/TripModalHOC.types";
import { showToast } from "@/utils/toast";

export default function AddTripModal() {
  const dispatch = useAppDispatch();
  const isAddingExpense = useAppSelector(selectIsAddingTrip);
  const hasFailedToAddTrip = useAppSelector(selectHasAddingTripFailed);
  const [data, setData] = useState<TripModalData | null>(null);

  const onClickCancel = () => {
    dispatch(setShouldShowAddTripModal(false));
  };

  const onClickAddTrip = () => {
    dispatch(addTrip(data!));
  };

  const canSaveTrip = useMemo(() => {
    if (data === null) return false;
    const { name, startDate, endDate, countryIds } = data;

    return (
      !!name.trim().length &&
      !!startDate.trim().length &&
      !!endDate.trim().length &&
      countryIds.length > 0
    );
  }, [data]);

  useEffect(() => {
    if (hasFailedToAddTrip) {
      showToast("Something went wrong adding the trip. Try again", {
        type: "error",
      });
    }
  }, [hasFailedToAddTrip]);

  return (
    <>
      <TripModalHOC
        title="Add Trip"
        onChangeData={setData}
        footer={
          <div className="flex justify-end pt-8">
            <button
              className="btn btn-secondary font-bold text-md mr-4"
              onClick={onClickCancel}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary font-bold text-md"
              disabled={!canSaveTrip}
              onClick={onClickAddTrip}
            >
              Save
            </button>
          </div>
        }
      />
      {isAddingExpense && <SpinnerOverlay />}
    </>
  );
}
