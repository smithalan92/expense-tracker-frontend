import { Trip } from "@/api.types";

export interface TripsState {
  trips: Trip[];
  isLoadingTrips: boolean;
  hasLoadedTrips: boolean;
  hasFailedToLoadTrips: boolean;
}
