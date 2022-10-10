import { TripProps } from "./Trip.types";

export default function Trip({ trip }: TripProps) {
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{trip.name}</h2>
        <p>
          {trip.startDate} to {trip.endDate}
        </p>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary">View expenses</button>
        </div>
      </div>
    </div>
  );
}
