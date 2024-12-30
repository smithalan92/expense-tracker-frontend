import { uploadFile } from "@/api/file";
import { createTrip, getTrips, type CreateTripPayload, type Trip } from "@/api/trip";
import { isNetworkError } from "@/utils/network";
import { acceptHMRUpdate, defineStore } from "pinia";

const useTripsStore = defineStore("trips", {
  state: (): TripsState => ({ trips: [], isLoading: false, hasFailedToLoad: false }),
  getters: {
    getTrips: (state) => {
      return [...state.trips].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );
    },
    getTripById: (state) => {
      return (tripId: number) => state.trips.find(({ id }) => id === tripId);
    },
  },
  actions: {
    async loadTrips() {
      try {
        this.isLoading = true;
        this.hasFailedToLoad = false;
        const data = await getTrips();
        this.trips = data;
      } catch (err: any) {
        if (!isNetworkError(err)) {
          this.hasFailedToLoad = true;
          throw err;
        }
      } finally {
        this.isLoading = false;
      }
    },

    async createTrip(payload: CreateTripPayload, file?: Nullable<File>) {
      try {
        if (file) {
          const fileUrl = await uploadFile(file);
          payload.file = fileUrl;
        }
      } catch {
        throw new Error("Failed to save file");
      }

      const trip = await createTrip(payload);
      this.trips.push(trip);
    },
  },
  persist: true,
});

export default useTripsStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTripsStore, import.meta.hot));
}

interface TripsState {
  trips: Trip[];
  isLoading: boolean;
  hasFailedToLoad: boolean;
}
