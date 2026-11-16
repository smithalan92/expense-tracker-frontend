import useNearestCity, {
  distanceInKm,
  findNearestCity,
  MAX_NEAREST_CITY_DISTANCE_KM,
} from "@/components/trip/modals/AddOrEditExpense/hooks/useNearestCity";
import type { LocationPermissionState } from "@/hooks/useLocationAccess";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ABU_DHABIO,
  CORK,
  DUBAI,
  DUBLIN,
  IRELAND_FOR_TRIP,
  UAE_FOR_TRIP,
} from "../fixtures/countries_cities";

const mockGetPermissionState = vi.fn<() => Promise<LocationPermissionState>>();
const mockRequestLocation = vi.fn();

vi.mock("@/hooks/useLocationAccess.ts", () => ({
  default: () => ({
    getPermissionState: mockGetPermissionState,
    requestLocation: mockRequestLocation,
  }),
}));

const positionOf = (latitude: number, longitude: number) => ({ coords: { latitude, longitude } });

describe("distanceInKm", () => {
  it("is 0 for identical points", () => {
    expect(distanceInKm(CORK, CORK)).toBe(0);
  });

  it("is symmetric", () => {
    expect(distanceInKm(CORK, DUBLIN)).toBeCloseTo(distanceInKm(DUBLIN, CORK), 6);
  });

  it("returns a realistic distance between Cork and Dublin (~220km)", () => {
    expect(distanceInKm(CORK, DUBLIN)).toBeGreaterThan(210);
    expect(distanceInKm(CORK, DUBLIN)).toBeLessThan(230);
  });

  it("handles points on opposite sides of the antimeridian", () => {
    const a = { latitude: 0, longitude: 179.5 };
    const b = { latitude: 0, longitude: -179.5 };

    // 1 degree of longitude at the equator is ~111km
    expect(distanceInKm(a, b)).toBeCloseTo(111.2, 0);
  });
});

describe("findNearestCity", () => {
  const cities = [CORK, DUBLIN, DUBAI, ABU_DHABIO];

  it("picks the closest city to the position", () => {
    // Just outside Dublin
    expect(findNearestCity(cities, { latitude: 53.4, longitude: -6.3 })).toBe(DUBLIN);
    // Just outside Abu Dhabi
    expect(findNearestCity(cities, { latitude: 24.5, longitude: 54.4 })).toBe(ABU_DHABIO);
  });

  it("returns null when no city is within the max distance", () => {
    // London is ~450km+ from both Cork and Dublin
    expect(findNearestCity(cities, { latitude: 51.5074, longitude: -0.1278 })).toBeNull();
  });

  it("respects a custom max distance", () => {
    // ~220km from Cork, so out of range at 100km but in range at 300km
    const position = { latitude: CORK.latitude, longitude: CORK.longitude + 3 };
    const distance = distanceInKm(position, CORK);

    expect(distance).toBeGreaterThan(MAX_NEAREST_CITY_DISTANCE_KM);
    expect(findNearestCity([CORK], position)).toBeNull();
    expect(findNearestCity([CORK], position, distance + 1)).toBe(CORK);
  });

  it("returns null for an empty list of cities", () => {
    expect(findNearestCity([], CORK)).toBeNull();
  });

  it("ignores cities with invalid coordinates", () => {
    const broken = { id: 99, name: "Broken", latitude: NaN, longitude: 0 };

    expect(findNearestCity([broken, CORK], CORK)).toBe(CORK);
    expect(findNearestCity([broken], CORK)).toBeNull();
  });
});

describe("useNearestCity", () => {
  const countries = [IRELAND_FOR_TRIP, UAE_FOR_TRIP];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetPermissionState.mockResolvedValue("granted");
    mockRequestLocation.mockResolvedValue(positionOf(DUBAI.latitude, DUBAI.longitude));
  });

  it("returns the nearest city across all of the trip's countries", async () => {
    const { getNearestCityId } = useNearestCity();

    expect(await getNearestCityId(countries)).toBe(DUBAI.id);
  });

  it("returns null and never asks for the location when permission is denied", async () => {
    mockGetPermissionState.mockResolvedValue("denied");
    const { getNearestCityId } = useNearestCity();

    expect(await getNearestCityId(countries)).toBeNull();
    expect(mockRequestLocation).not.toHaveBeenCalled();
  });

  it("returns null and never asks for the location when geolocation is unsupported", async () => {
    mockGetPermissionState.mockResolvedValue("unsupported");
    const { getNearestCityId } = useNearestCity();

    expect(await getNearestCityId(countries)).toBeNull();
    expect(mockRequestLocation).not.toHaveBeenCalled();
  });

  it("still requests the location when permission has not been decided yet", async () => {
    mockGetPermissionState.mockResolvedValue("prompt");
    const { getNearestCityId } = useNearestCity();

    expect(await getNearestCityId(countries)).toBe(DUBAI.id);
    expect(mockRequestLocation).toHaveBeenCalledOnce();
  });

  it("returns null when getting the location fails", async () => {
    mockRequestLocation.mockRejectedValue(new Error("Position unavailable"));
    const { getNearestCityId } = useNearestCity();

    expect(await getNearestCityId(countries)).toBeNull();
  });

  it("returns null when the user is too far from every city", async () => {
    mockRequestLocation.mockResolvedValue(positionOf(40.7128, -74.006)); // New York
    const { getNearestCityId } = useNearestCity();

    expect(await getNearestCityId(countries)).toBeNull();
  });

  it("returns null when the trip has no cities", async () => {
    const { getNearestCityId } = useNearestCity();

    expect(await getNearestCityId([{ ...IRELAND_FOR_TRIP, cities: [] }])).toBeNull();
  });
});
