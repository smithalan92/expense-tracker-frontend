import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeNetworkError } from "../fixtures/network";
import { FAKE_TRIP, TESTING_TRIP } from "../fixtures/trip";

vi.mock("@/api/trip", () => ({
  getTrips: vi.fn(),
  createTrip: vi.fn(),
  deleteTrip: vi.fn(),
}));

vi.mock("@/api/file", () => ({
  uploadFile: vi.fn(),
}));

import { uploadFile } from "@/api/file";
import { createTrip, deleteTrip, getTrips } from "@/api/trip";
import useTripsStore from "@/store/tripsStore";

describe("tripsStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetAllMocks();
  });

  describe("getters", () => {
    describe("getTrips", () => {
      it("returns trips sorted by startDate descending", () => {
        const store = useTripsStore();
        // TESTING_TRIP starts today, FAKE_TRIP also starts today but same date —
        // use known date strings to control ordering
        const older = { ...TESTING_TRIP, id: 1, startDate: "01 Jan 2024" };
        const newer = { ...FAKE_TRIP, id: 2, startDate: "01 Jun 2024" };
        store.$patch({ trips: [older, newer] });

        const sorted = store.getTrips;
        expect(sorted[0]!.id).toBe(newer.id);
        expect(sorted[1]!.id).toBe(older.id);
      });
    });

    describe("getTripById", () => {
      it("returns the matching trip", () => {
        const store = useTripsStore();
        store.$patch({ trips: [TESTING_TRIP, FAKE_TRIP] });

        expect(store.getTripById(TESTING_TRIP.id)).toEqual(TESTING_TRIP);
        expect(store.getTripById(FAKE_TRIP.id)).toEqual(FAKE_TRIP);
      });

      it("returns undefined when the trip is not found", () => {
        const store = useTripsStore();
        store.$patch({ trips: [TESTING_TRIP] });

        expect(store.getTripById(999)).toBeUndefined();
      });
    });
  });

  describe("actions", () => {
    describe("loadTrips", () => {
      describe("success", () => {
        it("sets trips from the API response", async () => {
          vi.mocked(getTrips).mockResolvedValue([TESTING_TRIP, FAKE_TRIP]);

          const store = useTripsStore();
          await store.loadTrips();

          expect(store.trips).toEqual([TESTING_TRIP, FAKE_TRIP]);
        });

        it("sets isLoading to false after load", async () => {
          vi.mocked(getTrips).mockResolvedValue([]);

          const store = useTripsStore();
          await store.loadTrips();

          expect(store.isLoading).toBe(false);
        });

        it("clears hasFailedToLoad on a successful retry", async () => {
          vi.mocked(getTrips).mockResolvedValue([]);

          const store = useTripsStore();
          store.$patch({ hasFailedToLoad: true });
          await store.loadTrips();

          expect(store.hasFailedToLoad).toBe(false);
        });
      });

      describe("error handling", () => {
        it("silently swallows network errors", async () => {
          vi.mocked(getTrips).mockRejectedValue(makeNetworkError());

          const store = useTripsStore();
          await expect(store.loadTrips()).resolves.toBeUndefined();
          expect(store.hasFailedToLoad).toBe(false);
        });

        it("sets hasFailedToLoad and re-throws for non-network errors", async () => {
          vi.mocked(getTrips).mockRejectedValue(new Error("Server error"));

          const store = useTripsStore();
          await expect(store.loadTrips()).rejects.toThrow("Server error");
          expect(store.hasFailedToLoad).toBe(true);
        });

        it("sets isLoading to false even when an error occurs", async () => {
          vi.mocked(getTrips).mockRejectedValue(new Error("Server error"));

          const store = useTripsStore();
          await store.loadTrips().catch(() => {});

          expect(store.isLoading).toBe(false);
        });
      });
    });

    describe("createTrip", () => {
      const PAYLOAD = {
        name: "New Trip",
        startDate: "2024-06-01",
        endDate: "2024-06-10",
        countries: [],
        userIds: [1],
      };

      it("appends the new trip to the list", async () => {
        vi.mocked(createTrip).mockResolvedValue(TESTING_TRIP);

        const store = useTripsStore();
        await store.createTrip(PAYLOAD);

        expect(store.trips).toHaveLength(1);
        expect(store.trips[0]).toEqual(TESTING_TRIP);
      });

      it("uploads file and includes URL in payload before creating", async () => {
        vi.mocked(uploadFile).mockResolvedValue("https://cdn.example.com/image.jpg");
        vi.mocked(createTrip).mockResolvedValue(TESTING_TRIP);

        const store = useTripsStore();
        const file = new File(["img"], "cover.jpg", { type: "image/jpeg" });

        await store.createTrip({ ...PAYLOAD }, file);

        expect(uploadFile).toHaveBeenCalledWith(file);
        expect(createTrip).toHaveBeenCalledWith(
          expect.objectContaining({ file: "https://cdn.example.com/image.jpg" }),
        );
      });

      it("throws when file upload fails", async () => {
        vi.mocked(uploadFile).mockRejectedValue(new Error("Upload failed"));

        const store = useTripsStore();
        const file = new File(["img"], "cover.jpg", { type: "image/jpeg" });

        await expect(store.createTrip({ ...PAYLOAD }, file)).rejects.toThrow("Failed to save file");
        expect(createTrip).not.toHaveBeenCalled();
      });
    });

    describe("deleteTrip", () => {
      it("calls the API and removes the trip from state", async () => {
        vi.mocked(deleteTrip).mockResolvedValue({} as any);

        const store = useTripsStore();
        store.$patch({ trips: [TESTING_TRIP, FAKE_TRIP] });

        expect(store.trips.length).toEqual(2);

        await store.deleteTrip(TESTING_TRIP.id);

        expect(deleteTrip).toHaveBeenCalledWith(TESTING_TRIP.id);
        expect(store.trips).toHaveLength(1);
        expect(store.trips[0]!.id).toBe(FAKE_TRIP.id);
      });
    });
  });
});
