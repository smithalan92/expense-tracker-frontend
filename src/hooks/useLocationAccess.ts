import { computed, ref } from "vue";

export default function useLocationAccess() {
  const state = ref<LocationPermissionState | undefined>(undefined);

  const hasLocationAccess = computed(() => state.value === "granted");

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
      return "prompt";
    }
  };

  const requestLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve(position);
      }, reject);
    });
  };

  const ensureLocationAccess = async () => {
    const state = await getPermissionState();

    if (state === "unsupported" || state === "denied") return;
    // if (state === "granted") return;

    try {
      await requestLocation();
    } catch {
      // Do nada
    }
  };

  return { hasLocationAccess, getPermissionState, requestLocation, ensureLocationAccess };
}

export type LocationPermissionState = "granted" | "denied" | "prompt" | "unsupported";
