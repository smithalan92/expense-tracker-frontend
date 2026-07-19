import useTripData from "@/components/trips/modals/AddOrEditTrip/hooks/useTripData";
import useAppStore from "@/store/appStore";
import { addDays, format } from "date-fns";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { CORK, DUBLIN, IRELAND_FOR_TRIP, UAE_FOR_TRIP } from "../fixtures/countries_cities";
import { TESTING_TRIP } from "../fixtures/trip";
import { USER_ONE, USER_TWO } from "../fixtures/users";

const DATE_FORMAT = "yyyy-MM-dd";

describe("useTripData", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const appStore = useAppStore();
    appStore.$patch({ user: USER_ONE, users: [USER_ONE, USER_TWO] });
  });

  describe("initial tripData", () => {
    it("defaults to an empty trip with the current user selected when no trip is provided", () => {
      const { tripData } = useTripData({ trip: null, countries: null, userIds: null });

      expect(tripData.tripName).toBe("");
      expect(tripData.originalImage).toBeNull();
      expect(tripData.selectedImage).toBeNull();
      expect(tripData.startDate).toBe(format(new Date(), DATE_FORMAT));
      expect(tripData.endDate).toBe(format(addDays(new Date(), 1), DATE_FORMAT));
      expect(tripData.selectedCountries).toEqual([]);
      expect(tripData.selectedUsers).toEqual([{ id: USER_ONE.id, name: USER_ONE.firstName }]);
    });

    it("populates fields from an existing trip", () => {
      const { tripData } = useTripData({
        trip: TESTING_TRIP,
        countries: [IRELAND_FOR_TRIP],
        userIds: [USER_TWO.id],
      });

      expect(tripData.tripName).toBe(TESTING_TRIP.name);
      expect(tripData.originalImage).toBe(TESTING_TRIP.image);
      expect(tripData.startDate).toBe(format(new Date(TESTING_TRIP.startDate), DATE_FORMAT));
      expect(tripData.endDate).toBe(format(new Date(TESTING_TRIP.endDate), DATE_FORMAT));
      expect(tripData.selectedCountries).toEqual([
        { id: IRELAND_FOR_TRIP.id, name: IRELAND_FOR_TRIP.name, cities: IRELAND_FOR_TRIP.cities },
      ]);
      expect(tripData.selectedUsers).toEqual([{ id: USER_TWO.id, name: USER_TWO.firstName }]);
    });

    it("throws if a userId does not match a known user", () => {
      expect(() => useTripData({ trip: null, countries: null, userIds: [999] })).toThrow(
        "Unable to find matching user for id: 999",
      );
    });
  });

  describe("isDataValid - new trip", () => {
    it("is false when the trip name is empty", () => {
      const { tripData, isDataValid } = useTripData({
        trip: null,
        countries: [IRELAND_FOR_TRIP],
        userIds: null,
      });

      tripData.tripName = "   ";

      expect(isDataValid.value).toBe(false);
    });

    it("is false when the end date is not after the start date", () => {
      const { tripData, isDataValid } = useTripData({
        trip: null,
        countries: [IRELAND_FOR_TRIP],
        userIds: null,
      });

      tripData.tripName = "Trip";
      tripData.endDate = tripData.startDate;

      expect(isDataValid.value).toBe(false);
    });

    it("is false when no countries are selected", () => {
      const { tripData, isDataValid } = useTripData({ trip: null, countries: null, userIds: null });

      tripData.tripName = "Trip";

      expect(isDataValid.value).toBe(false);
    });

    it("is false when a selected country has no cities", () => {
      const { tripData, isDataValid } = useTripData({ trip: null, countries: null, userIds: null });

      tripData.tripName = "Trip";
      tripData.selectedCountries = [{ id: IRELAND_FOR_TRIP.id, name: IRELAND_FOR_TRIP.name, cities: [] }];

      expect(isDataValid.value).toBe(false);
    });

    it("is true for a fully valid new trip", () => {
      const { tripData, isDataValid } = useTripData({
        trip: null,
        countries: [IRELAND_FOR_TRIP],
        userIds: null,
      });

      tripData.tripName = "Trip";

      expect(isDataValid.value).toBe(true);
    });
  });

  describe("isDataValid - editing an existing trip", () => {
    it("is false when nothing has changed", () => {
      const { isDataValid } = useTripData({
        trip: TESTING_TRIP,
        countries: [IRELAND_FOR_TRIP],
        userIds: [USER_ONE.id],
      });

      expect(isDataValid.value).toBe(false);
    });

    it("is true when the trip name changes", () => {
      const { tripData, isDataValid } = useTripData({
        trip: TESTING_TRIP,
        countries: [IRELAND_FOR_TRIP],
        userIds: [USER_ONE.id],
      });

      tripData.tripName = "Updated Trip Name";

      expect(isDataValid.value).toBe(true);
    });

    it("is true when the dates change", () => {
      const { tripData, isDataValid } = useTripData({
        trip: TESTING_TRIP,
        countries: [IRELAND_FOR_TRIP],
        userIds: [USER_ONE.id],
      });

      tripData.endDate = format(addDays(new Date(tripData.endDate), 2), DATE_FORMAT);

      expect(isDataValid.value).toBe(true);
    });

    it("is true when the selected countries/cities change", () => {
      const { tripData, isDataValid } = useTripData({
        trip: TESTING_TRIP,
        countries: [IRELAND_FOR_TRIP],
        userIds: [USER_ONE.id],
      });

      tripData.selectedCountries = [
        { id: IRELAND_FOR_TRIP.id, name: IRELAND_FOR_TRIP.name, cities: [CORK] },
      ];

      expect(isDataValid.value).toBe(true);
    });

    it("is true when an added country has the same city count but different cities", () => {
      const { tripData, isDataValid } = useTripData({
        trip: TESTING_TRIP,
        countries: [IRELAND_FOR_TRIP],
        userIds: [USER_ONE.id],
      });

      tripData.selectedCountries = [UAE_FOR_TRIP];

      expect(isDataValid.value).toBe(true);
    });

    it("is true when the selected users change", () => {
      const { tripData, isDataValid } = useTripData({
        trip: TESTING_TRIP,
        countries: [IRELAND_FOR_TRIP],
        userIds: [USER_ONE.id],
      });

      tripData.selectedUsers = [{ id: USER_TWO.id, name: USER_TWO.firstName }];

      expect(isDataValid.value).toBe(true);
    });

    it("is true when a new image is selected, even with no other changes", () => {
      const { tripData, isDataValid } = useTripData({
        trip: TESTING_TRIP,
        countries: [IRELAND_FOR_TRIP],
        userIds: [USER_ONE.id],
      });

      tripData.selectedImage = new File(["contents"], "photo.jpg", { type: "image/jpeg" });

      expect(isDataValid.value).toBe(true);
    });

    it("is false when data changed but is no longer valid", () => {
      const { tripData, isDataValid } = useTripData({
        trip: TESTING_TRIP,
        countries: [IRELAND_FOR_TRIP],
        userIds: [USER_ONE.id],
      });

      tripData.tripName = "";

      expect(isDataValid.value).toBe(false);
    });
  });

  describe("haveTripCountriesChanged edge case - unmatched country ids", () => {
    it("is true when a selected country id no longer exists in the original countries", () => {
      const { tripData, isDataValid } = useTripData({
        trip: TESTING_TRIP,
        countries: [IRELAND_FOR_TRIP],
        userIds: [USER_ONE.id],
      });

      tripData.selectedCountries = [
        ...tripData.selectedCountries,
        { id: UAE_FOR_TRIP.id, name: UAE_FOR_TRIP.name, cities: [DUBLIN] },
      ];

      expect(isDataValid.value).toBe(true);
    });
  });
});
