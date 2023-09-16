import { CreateTripPayload, GetTripEditDataResponse, Trip } from "@/api.types";
import { TripModalData } from "@/components/Modals/TripModalHOC/TripModalHOC.types";

export interface TripsState {
  trips: Trip[];
  isLoadingTrips: boolean;
  hasLoadedTrips: boolean;
  hasFailedToLoadTrips: boolean;
  shouldShowAddTripModal: boolean;
  isAddingTrip: boolean;
  hasAddingTripFailed: boolean;
  isDeletingTrip: boolean;
  hasDeletingTripFailed: boolean;
  isUpdatingTrip: boolean;
  hasUpdatingTripFailed: boolean;
}

export interface CreateTripThunkPayload
  extends Omit<CreateTripPayload, "file"> {
  file?: File;
}

export interface UpdateTripThunkPayload {
  tripId: number;
  newData: TripModalData;
  oldData: GetTripEditDataResponse;
}
