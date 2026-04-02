import type { GetAppDataResponse } from "@/api/app";
import type { LoadCitiesForCountryResponse } from "@/api/country";
import type { GetTripDataResponse, GetTripsResponse } from "@/api/trip";
import { RESTAURANTS, SNACKS_DRINKS } from "./categories";
import {
  CORK,
  DUBLIN,
  IRELAND_FOR_TRIP,
  IRELAND_WITH_CURRENCY,
  UAE_FOR_TRIP,
  UAE_WITH_CURRENCY,
} from "./countries_cities";
import { AED, EURO } from "./currencies";
import { AED_MOCK_EXPENSE_ONE, EURO_MOCK_EXPENSE_ONE } from "./expenses";
import { FAKE_TRIP, TESTING_TRIP } from "./trip";
import { USER_ONE, USER_TWO } from "./users";

export const GET_APP_DATA_FIXTURE: GetAppDataResponse = {
  countries: [IRELAND_WITH_CURRENCY, UAE_WITH_CURRENCY],
  currencies: [EURO, AED],
  users: [USER_ONE, USER_TWO],
};

export const GET_TRIPS_FIXTURE: GetTripsResponse = {
  trips: [TESTING_TRIP, FAKE_TRIP],
};

export const GET_TRIP_DATA_FIXTURE: GetTripDataResponse = {
  trip: TESTING_TRIP,
  countries: [IRELAND_FOR_TRIP, UAE_FOR_TRIP],
  userIds: [USER_ONE.id, USER_TWO.id],
  currencyIds: [EURO.id, AED.id],
  categories: [RESTAURANTS, SNACKS_DRINKS],
  expenses: [EURO_MOCK_EXPENSE_ONE, AED_MOCK_EXPENSE_ONE],
};

export const LOAD_CITIES_FOR_COUNTRIES_FIXTURE: LoadCitiesForCountryResponse = {
  cities: [
    { ...CORK, countryId: IRELAND_FOR_TRIP.id },
    { ...DUBLIN, countryId: IRELAND_FOR_TRIP.id },
  ],
};
