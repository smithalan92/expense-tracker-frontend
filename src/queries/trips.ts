import { getTripData, getTrips } from "@/api";
import { queryOptions } from "@tanstack/react-query";

export const GET_TRIPS_QUERY = queryOptions({
  queryKey: ["trips"],
  queryFn: () => {
    return getTrips();
  },
});

export const GET_TRIP_QUERY = (id: number) =>
  queryOptions({
    queryKey: ["trip", id],
    queryFn: () => {
      return getTripData(id);
    },
  });
