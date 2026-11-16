import type { CountryWithCurrency } from "@/api/app";
import type { TripCountry, TripCountryCity } from "@/api/trip";
import { AED, EURO } from "./currencies";

export const CORK: TripCountryCity = {
  id: 1,
  name: "Cork",
  latitude: 51.8985,
  longitude: -8.4756,
};

export const DUBLIN: TripCountryCity = {
  id: 2,
  name: "Dublin",
  latitude: 53.3498,
  longitude: -6.2603,
};

export const DUBAI: TripCountryCity = {
  id: 1,
  name: "Dubai",
  latitude: 25.2048,
  longitude: 55.2708,
};

export const ABU_DHABIO: TripCountryCity = {
  id: 2,
  name: "Abu Dhabi",
  latitude: 24.4539,
  longitude: 54.3773,
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
  code: "IE",
};

export const UAE_FOR_TRIP: TripCountry = {
  ...UAE_WITH_CURRENCY,
  currencyId: AED.id,
  cities: [DUBAI, ABU_DHABIO],
  code: "AE",
};
