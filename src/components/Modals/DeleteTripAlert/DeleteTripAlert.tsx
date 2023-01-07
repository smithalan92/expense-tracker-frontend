import { useAppSelector } from "@/store";
import { DeleteTripAlertProps } from "./DeleteTripAlert.types";

export function DeleteTripAlert({ tripId, onConfirm }: DeleteTripAlertProps) {
  const trip = useAppSelector((state) =>
    state.trips.trips.find((t) => t.id === tripId)
  )!;

  const onClickDelete = () => {
    onConfirm(true);
  };

  const onClickCancel = () => {
    onConfirm(false);
  };

  return (
    <div className="et-modal-backdrop">
      <div className="animate-fade-in et-modal overflow-hidden box-content z-40">
        <div className="mb-2">
          <p>Are you sure you want to delete the following trip</p>
          <p className="font-semibold text-center mt-2">{trip.name}</p>
        </div>
        <div className="flex justify-end items-center pt-6">
          <button
            className="btn btn-secondary font-bold text-md mr-4"
            onClick={onClickCancel}
          >
            No
          </button>
          <button
            className="btn btn-error font-bold text-md"
            onClick={onClickDelete}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
