import { TripModalCountry } from "@/components/Modals/TripModalHOC/TripModalHOC.types";
import { formatDateForTrip } from "./date";

export function isTripNameDifferent(newName: string, oldName: string) {
  return oldName.trim() !== newName.trim();
}

export function isDateDifferent(newDate: string, oldDate: string) {
  return (
    formatDateForTrip(new Date(newDate)) !==
    formatDateForTrip(new Date(oldDate))
  );
}

export function areUserIdsDifferent(
  newUserIds: number[],
  oldUserIds: number[]
) {
  return newUserIds.sort().join("-") !== oldUserIds.sort().join("-");
}

export function isAnyCountryDataDifferent(
  newCountries: TripModalCountry[],
  oldCountries: TripModalCountry[]
) {
  if (newCountries.length !== oldCountries.length) {
    return true;
  }

  for (const country of newCountries) {
    const countryId = country.countryId;

    const existingCountry = oldCountries.find((c) => c.countryId === countryId);

    if (!existingCountry) {
      return true;
    }

    const existingCountryCityIds = existingCountry.cityIds
      ? existingCountry.cityIds.sort().join(",")
      : "";
    const newCountryCityIds = country.cityIds
      ? country.cityIds.sort().join(",")
      : "";

    if (existingCountryCityIds !== newCountryCityIds) {
      return true;
    }
  }

  return false;
}
