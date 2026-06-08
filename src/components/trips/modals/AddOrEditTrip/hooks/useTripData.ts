import { type CreateTripCountry, type Trip } from "@/api/trip";
import { addDays } from "date-fns/addDays";
import { format } from "date-fns/format";
import { reactive } from "vue";

const DATE_FORMAT = "yyyy-MM-dd";

export default function useTripData(trip: Trip | null) {
  const tripData = reactive<TripData>({
    selectedImage: trip?.image ?? null,
    tripName: trip?.name ?? "",
    startDate: trip?.startDate
      ? format(new Date(trip.startDate), DATE_FORMAT)
      : format(new Date(), DATE_FORMAT),
    endDate: trip?.endDate
      ? format(new Date(trip.endDate), DATE_FORMAT)
      : format(addDays(new Date(), 1), DATE_FORMAT),
    selectedCountries: [],
    selectedUsers: [],
  });

  return { tripData };
}

export interface TripData {
  selectedImage: Nullable<File | string>;
  tripName: string;
  startDate: string;
  endDate: string;
  selectedCountries: TripModalCountry[];
  selectedUsers: PickerOption[];
}

export interface TripModalCountry extends CreateTripCountry {
  name: string;
}
