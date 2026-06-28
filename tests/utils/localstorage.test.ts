import {
  BASE_LOCALSTORAGE_KEY,
  getFromLocalStorage,
  getTripFromLocalStorage,
  writeToLocalStorage,
  writeTripDataToLocalStorage,
} from "@/utils/localstorage";
import { beforeEach, describe, expect, it } from "vitest";
import { MOCK_TRIP_DATA_STATE } from "../fixtures/state";
import { TESTING_TRIP } from "../fixtures/trip";

const TRIP_ID = TESTING_TRIP.id;
const TRIP_STORAGE_KEY = `${BASE_LOCALSTORAGE_KEY}__tripData__${TRIP_ID}`;

describe("localstorage utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("writeToLocalStorage", () => {
    it("writes a value under the namespaced key", () => {
      writeToLocalStorage("myKey", "myValue");
      expect(localStorage.getItem(`${BASE_LOCALSTORAGE_KEY}__myKey`)).toBe("myValue");
    });

    it("overwrites an existing value", () => {
      writeToLocalStorage("myKey", "first");
      writeToLocalStorage("myKey", "second");
      expect(localStorage.getItem(`${BASE_LOCALSTORAGE_KEY}__myKey`)).toBe("second");
    });
  });

  describe("getFromLocalStorage", () => {
    it("returns a parsed value when the key exists", () => {
      const data = { foo: "bar" };
      localStorage.setItem(`${BASE_LOCALSTORAGE_KEY}__myKey`, JSON.stringify(data));

      expect(getFromLocalStorage("myKey")).toEqual(data);
    });

    it("returns null when the key does not exist", () => {
      expect(getFromLocalStorage("nonexistent")).toBeNull();
    });
  });

  describe("writeTripDataToLocalStorage", () => {
    it("writes trip data under the trip-specific key", () => {
      writeTripDataToLocalStorage({
        ...MOCK_TRIP_DATA_STATE,
        isLoadingTripData: false,
        hasFailedToLoadTripData: false,
      });

      const stored = JSON.parse(localStorage.getItem(TRIP_STORAGE_KEY)!);
      expect(stored.trip.id).toBe(TRIP_ID);
      expect(stored.expenses).toHaveLength(1);
    });

    it("stores trip, expenses, unsavedExpenses, countries, currencyIds, categories and userIds", () => {
      writeTripDataToLocalStorage({
        ...MOCK_TRIP_DATA_STATE,
        isLoadingTripData: false,
        hasFailedToLoadTripData: false,
      });

      const stored = JSON.parse(localStorage.getItem(TRIP_STORAGE_KEY)!);
      expect(stored).toMatchObject({
        trip: TESTING_TRIP,
        expenses: MOCK_TRIP_DATA_STATE.expenses,
        unsavedExpenses: MOCK_TRIP_DATA_STATE.unsavedExpenses,
        countries: MOCK_TRIP_DATA_STATE.countries,
        currencyIds: MOCK_TRIP_DATA_STATE.currencyIds,
        categories: MOCK_TRIP_DATA_STATE.categories,
        userIds: MOCK_TRIP_DATA_STATE.userIds,
      });
    });

    it("does not write when trip.id is 0", () => {
      writeTripDataToLocalStorage({
        ...MOCK_TRIP_DATA_STATE,
        trip: { ...TESTING_TRIP, id: 0 },
        isLoadingTripData: false,
        hasFailedToLoadTripData: false,
      });

      expect(localStorage.getItem(TRIP_STORAGE_KEY)).toBeNull();
    });
  });

  describe("getTripFromLocalStorage", () => {
    it("returns the stored trip data for a given trip ID", () => {
      writeTripDataToLocalStorage({
        ...MOCK_TRIP_DATA_STATE,
        isLoadingTripData: false,
        hasFailedToLoadTripData: false,
      });

      const result = getTripFromLocalStorage(TRIP_ID);
      expect(result).not.toBeNull();
      expect(result!.trip.id).toBe(TRIP_ID);
      expect(result!.expenses).toHaveLength(1);
    });

    it("returns null when no data is stored for the trip ID", () => {
      expect(getTripFromLocalStorage(999)).toBeNull();
    });

    it("returns null when data stored for a different trip ID", () => {
      writeTripDataToLocalStorage({
        ...MOCK_TRIP_DATA_STATE,
        isLoadingTripData: false,
        hasFailedToLoadTripData: false,
      });

      expect(getTripFromLocalStorage(999)).toBeNull();
    });
  });
});
