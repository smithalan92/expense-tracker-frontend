import { render, screen, waitFor } from "@testing-library/vue";
import { createTestingPinia } from "@pinia/testing";
import { createRouter, createWebHistory } from "vue-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TripDataView from "@/tripData/TripDataView.vue";
import { BASE_LOCALSTORAGE_KEY } from "@/utils/localstorage";
import { makeNetworkError, mockExpense, mockTrip, mockTripDataState } from "./fixtures";

// --- module mocks ---
vi.mock("@/api/trip", () => ({ getTripData: vi.fn() }));
vi.mock("@/api/expense", () => ({ addExpensesToTrip: vi.fn() }));

// Stub heavy child components so we can focus on TripDataView's own logic
vi.mock("@/tripData/ExpenseList.vue", () => ({ default: { template: '<div data-testid="expense-list" />' } }));
vi.mock("@/tripData/AddOrEditExpenseModal.vue", () => ({ default: { template: "<div />" } }));
vi.mock("@/trips/AddOrEditTripModal.vue", () => ({ default: { template: "<div />" } }));
vi.mock("@/modal/StatsModal.vue", () => ({ default: { template: "<div />" } }));
vi.mock("@/modal/ConfirmModal.vue", () => ({ default: { template: "<div />" } }));

// Stub font-awesome so we don't need the icon library
vi.mock("@fortawesome/vue-fontawesome", () => ({
  FontAwesomeIcon: { template: "<span />" },
}));

import { getTripData } from "@/api/trip";

const TRIP_ID = 1;
const STORAGE_KEY = `${BASE_LOCALSTORAGE_KEY}__tripData__${TRIP_ID}`;

function seedLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTripDataState));
}

function makeRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [{ path: "/trip/:tripId", component: TripDataView }],
  });
}

async function renderView() {
  const router = makeRouter();
  await router.push(`/trip/${TRIP_ID}`);

  return render(TripDataView, {
    global: {
      plugins: [
        router,
        createTestingPinia({ stubActions: false }),
      ],
      stubs: { "fa-icon": true },
    },
  });
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("TripDataView — offline UI", () => {
  it("shows trip name from cache when offline", async () => {
    seedLocalStorage();
    vi.mocked(getTripData).mockRejectedValue(makeNetworkError());

    await renderView();

    await waitFor(() => {
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
    });
  });

  it("shows error state when offline with no cached data", async () => {
    vi.mocked(getTripData).mockRejectedValue(makeNetworkError());

    await renderView();

    await waitFor(() => {
      expect(screen.getByText("Something went wrong loading this trip.")).toBeInTheDocument();
    });
  });

  it("shows trip data when online load succeeds", async () => {
    vi.mocked(getTripData).mockResolvedValue({
      trip: mockTrip,
      expenses: [mockExpense],
      countries: mockTripDataState.countries,
      currencyIds: [1],
      categories: [{ id: 2, name: "Food" }],
      userIds: [1],
    });

    await renderView();

    await waitFor(() => {
      expect(screen.getByText(mockTrip.name)).toBeInTheDocument();
    });
  });
});
