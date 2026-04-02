import type { CountryWithCurrency } from "@/api/app";
import type { TripCountry, TripCountryCity } from "@/api/trip";
import { AED, EURO } from "./currencies";

export const CORK: TripCountryCity = {
  id: 1,
  name: "Cork",
};

export const DUBLIN: TripCountryCity = {
  id: 2,
  name: "Dublin",
};

export const DUBAI: TripCountryCity = {
  id: 1,
  name: "Dubai",
};

export const ABU_DHABIO: TripCountryCity = {
  id: 2,
  name: "Abu Dhabi",
};

export const IRELAND_WITH_CURRENCY: CountryWithCurrency = {
  id: 1,
  name: "Ireland",
  currency: EURO,
};

export const UAE_WITH_CURRENCY: CountryWithCurrency = {
  id: 226,
  name: "United Arab Emirates",
  currency: AED,
};

export const IRELAND_FOR_TRIP: TripCountry = {
  ...IRELAND_WITH_CURRENCY,
  currencyId: EURO.id,
  cities: [CORK, DUBLIN],
};

export const UAE_FOR_TRIP: TripCountry = {
  ...UAE_WITH_CURRENCY,
  currencyId: AED.id,
  cities: [DUBAI, ABU_DHABIO],
};
