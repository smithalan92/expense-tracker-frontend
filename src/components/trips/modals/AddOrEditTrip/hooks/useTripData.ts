import type { User } from "@/api/app";
import { type Trip, type TripCountry } from "@/api/trip";
import type { LoginUser } from "@/api/user";
import useAppStore from "@/store/appStore";
import { isAfter } from "date-fns";
import { addDays } from "date-fns/addDays";
import { format } from "date-fns/format";
import { storeToRefs } from "pinia";
import { computed, reactive } from "vue";

const DATE_FORMAT = "yyyy-MM-dd";

const parseTripCountries = (countries: Nullable<TripCountry[]>) => {
  if (!countries || !countries.length) return [];

  return countries.reduce<TripModalCountry[]>((acc, current) => {
    acc.push({
      id: current.id,
      name: current.name,
      cities: current.cities,
    });

    return acc;
  }, []);
};

const parseTripUsers = ({
  userIds,
  currentUser,
  users,
}: {
  userIds: Nullable<number[]>;
  currentUser: LoginUser;
  users: User[];
}): TripData["selectedUsers"] => {
  if (userIds && userIds.length > 0) {
    return userIds.map((id) => {
      const user = users.find((u) => u.id === id);

      if (!user) {
        throw new Error(`Unable to find matching user for id: ${id}`);
      }

      return { id: user.id, name: user.firstName };
    });
  }

  return [{ id: currentUser.id, name: currentUser.firstName }];
};

const haveTripCountriesChanged = (oldCountries: TripModalCountry[], currentCountries: TripModalCountry[]) => {
  if (oldCountries.length !== currentCountries.length) return true;

  for (const currentCountry of currentCountries) {
    const oldCountry = oldCountries.find((c) => c.id === currentCountry.id);

    if (!oldCountry) return true;

    if (oldCountry.cities.length !== currentCountry.cities.length) return true;

    const oldCountryCityIds = oldCountry.cities
      .map((c) => c.id)
      .sort()
      .join(",");
    const currentCountryCityIds = currentCountry.cities
      .map((c) => c.id)
      .sort()
      .join(",");

    if (oldCountryCityIds !== currentCountryCityIds) return true;
  }

  return false;
};

export default function useTripData({
  trip,
  countries,
  userIds,
}: {
  trip: Nullable<Trip>;
  countries: Nullable<TripCountry[]>;
  userIds: Nullable<number[]>;
}) {
  const appStore = useAppStore();
  const { users, user } = storeToRefs(appStore);

  const tripData = reactive<TripData>({
    selectedImage: null,
    originalImage: trip?.image ?? null,
    tripName: trip?.name ?? "",
    startDate: trip?.startDate
      ? format(new Date(trip.startDate), DATE_FORMAT)
      : format(new Date(), DATE_FORMAT),
    endDate: trip?.endDate
      ? format(new Date(trip.endDate), DATE_FORMAT)
      : format(addDays(new Date(), 1), DATE_FORMAT),
    selectedCountries: parseTripCountries(countries),
    selectedUsers: parseTripUsers({ userIds, currentUser: user.value!, users: users.value! }),
  });

  const isDataValid = computed(() => {
    const isTripNameValid = tripData.tripName.trim().length > 0;
    const areDatesValid =
      tripData.startDate &&
      tripData.endDate &&
      isAfter(new Date(tripData.endDate), new Date(tripData.startDate));

    const areCountriesValid =
      tripData.selectedCountries.length > 0 && !tripData.selectedCountries.find((c) => c.cities.length === 0);

    const areUsersValid = tripData.selectedUsers.length >= 0;

    const isDataValid = isTripNameValid && areDatesValid && areCountriesValid && areUsersValid;

    if (!trip || !isDataValid) return isDataValid;

    if (tripData.selectedImage) return true;

    const hasTripNameChanged = trip.name.trim() !== tripData.tripName.trim();
    const hasStartDateChanged = format(new Date(trip.startDate), DATE_FORMAT) !== tripData.startDate;
    const hasEndDateChanged = format(new Date(trip.endDate), DATE_FORMAT) !== tripData.endDate;
    const hasCountriesChanged = haveTripCountriesChanged(
      parseTripCountries(countries),
      tripData.selectedCountries,
    );

    const hasUsersChanged =
      (userIds ?? []).sort().join(",") !==
      tripData.selectedUsers
        .map((u) => u.id)
        .sort()
        .join(",");

    return (
      hasTripNameChanged || hasStartDateChanged || hasEndDateChanged || hasCountriesChanged || hasUsersChanged
    );
  });

  return { tripData, isDataValid };
}

export interface TripData {
  selectedImage: Nullable<File>;
  originalImage: Nullable<string>;
  tripName: string;
  startDate: string;
  endDate: string;
  selectedCountries: TripModalCountry[];
  selectedUsers: Array<{ id: number; name: string }>;
}

export interface TripModalCountry {
  id: number;
  name: string;
  cities: Array<{ id: number; name: string }>;
}
