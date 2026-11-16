import type { TripCountry, TripCountryCity } from "@/api/trip";
import useLocationAccess from "@/hooks/useLocationAccess.ts";

/**
 * If the user is further than this from every city in the trip, we don't guess.
 * (e.g. logging an expense from home after the trip)
 */
export const MAX_NEAREST_CITY_DISTANCE_KM = 100;

const EARTH_RADIUS_KM = 6371;

export interface Coordinates {
  latitude: number;
  longitude: number;
}

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Great-circle distance between two points using the haversine formula. */
export const distanceInKm = (a: Coordinates, b: Coordinates) => {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.latitude)) * Math.cos(toRadians(b.latitude)) * Math.sin(dLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

export const findNearestCity = (
  cities: TripCountryCity[],
  position: Coordinates,
  maxDistanceKm = MAX_NEAREST_CITY_DISTANCE_KM,
): Nullable<TripCountryCity> => {
  let nearest: Nullable<TripCountryCity> = null;
  let nearestDistance = Infinity;

  for (const city of cities) {
    // Guard against a missing/invalid coordinate so one bad city can't win with NaN
    if (!Number.isFinite(city.latitude) || !Number.isFinite(city.longitude)) continue;

    const distance = distanceInKm(position, city);

    if (distance < nearestDistance) {
      nearest = city;
      nearestDistance = distance;
    }
  }

  return nearestDistance <= maxDistanceKm ? nearest : null;
};

export default function useNearestCity() {
  const { getPermissionState, requestLocation } = useLocationAccess();

  /**
   * Resolves to the id of the trip city closest to the user's current location,
   * or null if location is unavailable/denied, fails, or no city is close enough.
   */
  const getNearestCityId = async (countries: TripCountry[]): Promise<Nullable<number>> => {
    const permission = await getPermissionState();

    if (permission === "denied" || permission === "unsupported") return null;

    try {
      const { coords } = await requestLocation();
      const cities = countries.flatMap((c) => c.cities);

      return findNearestCity(cities, coords)?.id ?? null;
    } catch {
      return null;
    }
  };

  return { getNearestCityId };
}
