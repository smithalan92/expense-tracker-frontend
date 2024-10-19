import { GET_TRIP_QUERY } from "@/queries/trips";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function useTripData(tripId: number) {
  const { data, error, isLoading } = useQuery(GET_TRIP_QUERY(tripId));

  const tripData = useMemo(() => {
    if (!data) return null;

    return {
      trip: data.trip,
      expenses: data.expenses.map((exp) => {
        return {
          ...exp,
          isSaved: true,
        };
      }),
      countries: data.countries,
      cities: data.cities,
      currencies: data.currencies,
      categories: data.categories,
      users: Object.entries(data.users).map(
        ([key, { firstName, lastName }]) => {
          return {
            id: parseInt(key, 10),
            firstName,
            lastName,
          };
        }
      ),
    };
  }, [data]);

  return {
    tripData,
    isLoadingTripData: isLoading,
    tripDataError: error,
  };
}
