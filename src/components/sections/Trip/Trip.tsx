import { Link } from "react-router-dom";
import { TripProps } from "./Trip.types";

export default function Trip({ trip, onClickDelete, onClickEdit }: TripProps) {
  const onClickDeleteButton = () => {
    onClickDelete(trip.id);
  };

  const onClickEditButton = () => {
    onClickEdit(trip.id);
  };

  return (
    <div className="card card-side w-full bg-base-100 shadow-md border border-solid border-base-200 h-52 mb-4">
      <div
        className="w-44 bg-cover h-52"
        style={{
          backgroundImage: `url(${trip.image})`,
        }}
      ></div>
      <div className="card-body px-4 py-2">
        <h2 className="card-title">{trip.name}</h2>
        <p>
          {trip.startDate} to {trip.endDate}
        </p>
        <p>
          <span className="font-bold">Expenses: </span> €
          {trip.totalExpenseAmount}
        </p>
        <div className="flex justify-end mt-4 mb-4">
          <Link className="btn btn-sm btn-accent" to={`/trips/${trip.id}`}>
            Expenses
          </Link>
          <button
            className="btn btn-sm btn-secondary ml-2"
            onClick={onClickEditButton}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-error ml-2"
            onClick={onClickDeleteButton}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
