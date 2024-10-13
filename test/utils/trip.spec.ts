import type { TripModalCountry } from "../../src/components/Modals/TripModalHOC/TripModalHOC";
import {
  areUserIdsDifferent,
  isAnyCountryDataDifferent,
  isDateDifferent,
  isTripNameDifferent,
} from "../../src/utils/trip";

describe("utils.trip", () => {
  describe("isTripNameDifferent", () => {
    it("should return true if the trip names are different", () => {
      expect(isTripNameDifferent("foo", "bar")).toEqual(true);
    });

    it("should return false if the trip names are not different", () => {
      expect(isTripNameDifferent("foo", "foo")).toEqual(false);
    });
  });

  describe("isAnyCountryDataDifferent", () => {
    it("should return true if the new countries contains a country that didnt exist in the old ones", () => {
      const newCountries: TripModalCountry[] = [
        { name: "foo", countryId: 123 },
      ];
      const oldCountries: TripModalCountry[] = [
        { name: "foo", countryId: 123 },
        { name: "foo", countryId: 456 },
      ];

      expect(isAnyCountryDataDifferent(newCountries, oldCountries)).toEqual(
        true
      );
    });

    it("should return true if the new countries contains a country that didnt exist in the old ones", () => {
      const newCountries: TripModalCountry[] = [
        { name: "foo", countryId: 123 },
      ];
      const oldCountries: TripModalCountry[] = [
        { name: "foo", countryId: 456 },
      ];

      expect(isAnyCountryDataDifferent(newCountries, oldCountries)).toEqual(
        true
      );
    });

    it("should return true if a countries cities id have changed", () => {
      const newCountries: TripModalCountry[] = [
        { name: "foo", countryId: 123, cityIds: [1] },
      ];
      const oldCountries: TripModalCountry[] = [
        { name: "foo", countryId: 123, cityIds: [1, 2] },
      ];

      expect(isAnyCountryDataDifferent(newCountries, oldCountries)).toEqual(
        true
      );
    });

    it("should return false if a the countries or cities haven't changed", () => {
      const newCountries: TripModalCountry[] = [
        { name: "foo", countryId: 123, cityIds: [1, 2] },
      ];
      const oldCountries: TripModalCountry[] = [
        { name: "foo", countryId: 123, cityIds: [1, 2] },
      ];

      expect(isAnyCountryDataDifferent(newCountries, oldCountries)).toEqual(
        false
      );
    });
  });

  describe("isDateDifferent", () => {
    it("should return true if the dates are different", () => {
      expect(isDateDifferent("2023-01-04", "2023-01-05")).toEqual(true);
    });

    it("should return false if the dates are not different", () => {
      expect(isDateDifferent("2023-01-04", "2023-01-04")).toEqual(false);
    });
  });

  describe("areUserIdsDifferent", () => {
    it("should return true if a user has been added", () => {
      expect(areUserIdsDifferent([1, 2, 3], [1, 2])).toEqual(true);
    });

    it("should return true if a user has been removed", () => {
      expect(areUserIdsDifferent([1], [1, 2])).toEqual(true);
    });

    it("should return true if a user has been removed and a new one added", () => {
      expect(areUserIdsDifferent([1, 3], [1, 2])).toEqual(true);
    });

    it("should return false if the users are the same", () => {
      expect(areUserIdsDifferent([1, 2], [1, 2])).toEqual(false);
    });
  });
});
