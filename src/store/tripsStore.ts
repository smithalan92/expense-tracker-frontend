import { FileUploadError, uploadFile } from "@/api/file";
import { createTrip, deleteTrip, getTrips, updateTrip, type CreateTripPayload, type Trip } from "@/api/trip";
import { isNetworkError } from "@/utils/network";
import { acceptHMRUpdate, defineStore } from "pinia";
import useTripDataStore from "./tripDataStore";

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
      } catch (err) {
        // Keep the reason when the API gave us one, so it can be shown to the user
        if (err instanceof FileUploadError) throw err;
        throw new Error("Failed to save file");
      }

      const trip = await createTrip(payload);
      this.trips.push(trip);
    },

    async deleteTrip(tripId: number) {
      await deleteTrip(tripId);
      this.trips = this.trips.filter((t) => t.id !== tripId);
    },

    async updateTrip({
      tripId,
      payload,
      file,
    }: {
      tripId: number;
      payload: CreateTripPayload;
      file?: Nullable<File>;
    }) {
      try {
        if (file) {
          const fileUrl = await uploadFile(file);
          payload.file = fileUrl;
        }
      } catch (err) {
        // Keep the reason when the API gave us one, so it can be shown to the user
        if (err instanceof FileUploadError) throw err;
        throw new Error("Failed to save file");
      }

      const { trip } = await updateTrip(tripId, payload);

      const currentTrips: Trip[] = JSON.parse(JSON.stringify(this.trips));
      const tripIdx = currentTrips.findIndex((t: Trip) => t.id === trip.id);

      if (tripIdx > -1) {
        currentTrips[tripIdx] = trip;
      }

      this.$patch({
        trips: currentTrips,
      });

      const tripDataStore = useTripDataStore();

      if (tripDataStore.trip.id === trip.id) {
        // Force a state reload, this will also update localstorage
        tripDataStore.loadTripData(trip.id);
      }
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
