import { Trip } from "@/api.types";

export interface TripState {
  trips: Trip[];
  isLoadingTrips: boolean;
  hasLoadedTrips: boolean;
  hasFailedToLoadTrips: boolean;
}
