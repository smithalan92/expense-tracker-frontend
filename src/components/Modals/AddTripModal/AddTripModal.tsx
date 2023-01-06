import { useAppDispatch } from "@/store";
import { setShouldShowAddTripModal } from "@/store/slices/trips";
import TripModalHOC from "../TripModalHOC/TripModalHOC";

export default function AddTripModal() {
  const dispatch = useAppDispatch();

  const onClickCancel = () => {
    dispatch(setShouldShowAddTripModal(false));
  };

  const onClickAddTrip = () => {
    /* */
  };

  return (
    <TripModalHOC
      title="Add Trip"
      onChangeData={() => {
        /* */
      }}
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
            disabled={false}
            onClick={onClickAddTrip}
          >
            Save
          </button>
        </div>
      }
    />
  );
}
