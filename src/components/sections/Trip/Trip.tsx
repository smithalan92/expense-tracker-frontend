import type { Trip as TripType } from "@/api";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function Trip({ trip }: TripProps) {
  const navigate = useNavigate();

  const onClickTrip = useCallback(() => {
    navigate(`/trips/${trip.id}`);
  }, [navigate, trip.id]);

  return (
    <div
      className="card card-side w-full bg-base-100 shadow-md border border-solid border-base-200 h-52 mb-4 cursor-pointer"
      onClick={onClickTrip}
    >
      <div
        className="sm:w-48 w-32 bg-cover h-52 flex-shrink-0"
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
        {/* <div className="flex justify-end mt-4 mb-4">
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
        </div> */}
      </div>
    </div>
  );
}

export interface TripProps {
  trip: TripType;
}
