import { Trip } from "@/api.types";

export interface TripProps {
  trip: Trip;
  onClickDelete: (tripId: number) => void;
  onClickEdit: (tripId: number) => void;
}
