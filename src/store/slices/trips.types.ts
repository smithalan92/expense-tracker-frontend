import { CreateTripPayload, Trip } from "@/api.types";

export interface TripsState {
  trips: Trip[];
  isLoadingTrips: boolean;
  hasLoadedTrips: boolean;
  hasFailedToLoadTrips: boolean;
  shouldShowAddTripModal: boolean;
  isAddingTrip: boolean;
  hasAddingTripFailed: boolean;
}

export interface CreateTripThunkPayload
  extends Omit<CreateTripPayload, "file"> {
  file?: File;
}
