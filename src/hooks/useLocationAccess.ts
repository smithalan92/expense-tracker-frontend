import { readonly, ref } from "vue";

const LOCATION_TIMEOUT_MS = 10_000;

export default function useLocationAccess() {
  const state = ref<LocationPermissionState | undefined>(undefined);

  const getPermissionState = async (): Promise<LocationPermissionState> => {
    if (!navigator.geolocation) {
      state.value = "unsupported";
      return "unsupported";
    }

    if (!navigator.permissions) {
      state.value = "prompt";
      return "prompt";
    }

    try {
      const status = await navigator.permissions.query({ name: "geolocation" });
      state.value = status.state;

      return status.state;
    } catch {
      state.value = "prompt";
      return "prompt";
    }
  };

  const requestLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          state.value = "granted";
          resolve(position);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) state.value = "denied";
          reject(error);
        },
        { timeout: LOCATION_TIMEOUT_MS },
      );
    });
  };

  /**
   * Returns the current position as a "lat,long" string, or null if location is
   * denied, unsupported, or can't be determined. Only skips the request when the
   * browser has definitively blocked it, since some browsers (e.g. Safari) report
   * "prompt" even after the user has allowed access.
   */
  const getLatLong = async (): Promise<string | null> => {
    const permission = await getPermissionState();
    if (permission === "denied" || permission === "unsupported") return null;

    try {
      const { coords } = await requestLocation();
      return `${coords.latitude},${coords.longitude}`;
    } catch {
      return null;
    }
  };

  const ensureLocationAccess = async () => {
    const state = await getPermissionState();

    if (state === "unsupported" || state === "denied") return;

    try {
      await requestLocation();
    } catch {
      // Do nada
    }
  };

  return {
    permissionState: readonly(state),
    getPermissionState,
    requestLocation,
    getLatLong,
    ensureLocationAccess,
  };
}

export type LocationPermissionState = "granted" | "denied" | "prompt" | "unsupported";
