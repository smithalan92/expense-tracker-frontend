import { Link } from "react-router-dom";
import { TripProps } from "./Trip.types";

export default function Trip({ trip }: TripProps) {
  return (
    <div className="card card-side w-full bg-base-100 shadow-xl h-52 mb-4">
      <div
        className="w-44 bg-cover h-52"
        style={{
          backgroundImage: `url(${trip.image})`,
        }}
      ></div>
      <div className="card-body p-4">
        <h2 className="card-title">{trip.name}</h2>
        <p>
          {trip.startDate} to {trip.endDate}
        </p>
        <p>
          <span className="font-bold">Expenses: </span> €
          {trip.totalExpenseAmount}
        </p>
        <div className="card-actions justify-center mt-4 mb-4">
          <Link className="btn btn-primary" to={`/trips/${trip.id}`}>
            View expenses
          </Link>
        </div>
      </div>
    </div>
  );
}
