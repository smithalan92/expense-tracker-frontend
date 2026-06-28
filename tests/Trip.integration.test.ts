import App from "@/app/App.vue";
import { createAppRouter } from "@/app/router";
import { createTestingPinia } from "@pinia/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

// --- API mocks only ---
vi.mock("@/api/trip", () => ({
  getTrips: vi.fn(),
  createTrip: vi.fn(),
  updateTrip: vi.fn(),
  deleteTrip: vi.fn(),
  getTripData: vi.fn(),
}));

vi.mock("@/api/file", () => ({ uploadFile: vi.fn() }));

vi.mock("@vueuse/core", () => ({
  useOnline: () => ({ value: true }),
}));

// Stub heavy child components not under test
vi.mock("@/trips/Trip.vue", () => ({
  default: {
    props: ["trip"],
    template: `<div data-testid="trip-card">{{ trip.name }}</div>`,
  },
}));
vi.mock("@/tripData/ExpenseList.vue", () => ({
  default: { template: '<div data-testid="expense-list" />' },
}));
vi.mock("@/tripData/AddOrEditExpenseModal.vue", () => ({ default: { template: "<div />" } }));
vi.mock("@/modal/StatsModal.vue", () => ({ default: { template: "<div />" } }));
vi.mock("@/modal/ConfirmModal.vue", () => ({
  default: {
    emits: ["confirm", "close"],
    template: `<div><button @click="$emit('confirm')">Confirm</button></div>`,
  },
}));
vi.mock("@/trips/AddCountryModal.vue", () => ({
  default: {
    emits: ["save", "close"],
    template: `<div data-testid="add-country-modal"><button @click="$emit('save', { countryId: 4, name: 'Japan', cityIds: [3] })">Save Country</button></div>`,
  },
}));
vi.mock("@/pickers/DatePicker.vue", () => ({
  default: {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: `<input :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" />`,
  },
}));
vi.mock("@/pickers/ImagePicker.vue", () => ({ default: { template: "<div />" } }));
vi.mock("@/utils/Tooltip.vue", () => ({
  default: {
    props: ["message", "disabled", "forceOpenOnMobile", "placement"],
    template: "<span><slot /></span>",
  },
}));
vi.mock("@fortawesome/vue-fontawesome", () => ({
  FontAwesomeIcon: { template: "<span />" },
}));

import { createTrip, deleteTrip, getTripData, getTrips, updateTrip } from "@/api/trip";
import { mockExpense, mockTrip, mockTripDataState } from "./fixtures";

const TRIP_ID = mockTrip.id;

const appInitialState = {
  app: {
    authToken: "test-token",
    user: { id: 1, firstName: "Alan", lastName: "Smith" },
    users: [{ id: 1, firstName: "Alan", lastName: "Smith" }],
  },
};

async function renderTripsView() {
  const router = createAppRouter();

  render(App, {
    global: {
      plugins: [router, createTestingPinia({ stubActions: false, initialState: appInitialState })],
      stubs: { "fa-icon": true },
    },
  });

  await router.push("/trips");
  return { router };
}

async function renderTripDataView() {
  const router = createAppRouter();

  render(App, {
    global: {
      plugins: [router, createTestingPinia({ stubActions: false, initialState: appInitialState })],
      stubs: { "fa-icon": true },
    },
  });

  await router.push(`/trips/${TRIP_ID}`);
  return { router };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Trip — create", () => {
  it("shows the Add Your First Trip button when there are no trips", async () => {
    vi.mocked(getTrips).mockResolvedValue([]);

    await renderTripsView();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Add Your First Trip/i })).toBeInTheDocument();
    });
  });

  it("opens the create trip modal when Add Your First Trip is clicked", async () => {
    vi.mocked(getTrips).mockResolvedValue([]);

    await renderTripsView();

    await waitFor(() => screen.getByRole("button", { name: /Add Your First Trip/i }));
    fireEvent.click(screen.getByRole("button", { name: /Add Your First Trip/i }));

    await waitFor(() => {
      expect(screen.getByText("Add trip")).toBeInTheDocument();
    });
  });

  it("creates a trip after filling in the form and clicking Create Trip", async () => {
    vi.mocked(getTrips).mockResolvedValue([]);
    vi.mocked(createTrip).mockResolvedValue(mockTrip);

    await renderTripsView();

    await waitFor(() => screen.getByRole("button", { name: /Add Your First Trip/i }));
    fireEvent.click(screen.getByRole("button", { name: /Add Your First Trip/i }));

    await waitFor(() => screen.getByPlaceholderText("Trip to Fiji"));

    // Fill trip name
    fireEvent.update(screen.getByPlaceholderText("Trip to Fiji"), "Japan Trip");

    // Add a country via the stubbed AddCountryModal
    fireEvent.click(screen.getByRole("button", { name: /Add Country/i }));
    await waitFor(() => screen.getByTestId("add-country-modal"));
    fireEvent.click(screen.getByRole("button", { name: "Save Country" }));

    // Create Trip button should now be enabled (user is pre-selected, dates default to today)
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Create Trip/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Trip/i }));

    await waitFor(() => {
      expect(createTrip).toHaveBeenCalledOnce();
    });
  });
});

describe("Trip — edit", () => {
  it("shows the trip name in the edit modal", async () => {
    vi.mocked(getTripData).mockResolvedValue({
      trip: mockTrip,
      expenses: [mockExpense],
      countries: mockTripDataState.countries,
      currencyIds: [1],
      categories: [{ id: 2, name: "Food" }],
      userIds: [1],
    });

    await renderTripDataView();

    await waitFor(() => screen.getByText(mockTrip.name));

    // There are two buttons with name="edit-trip": index 0 is stats, index 1 is edit
    fireEvent.click(document.querySelectorAll('[name="edit-trip"]')[1]!);

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockTrip.name)).toBeInTheDocument();
    });
  });

  it("saves changes when Save Changes is clicked", async () => {
    vi.mocked(getTripData).mockResolvedValue({
      trip: mockTrip,
      expenses: [],
      countries: mockTripDataState.countries,
      currencyIds: [1],
      categories: [],
      userIds: [1],
    });
    vi.mocked(updateTrip).mockResolvedValue({
      trip: { ...mockTrip, name: "Japan Trip 2024" },
      countries: mockTripDataState.countries,
      userIds: [1],
      currencyIds: [1],
    });

    await renderTripDataView();

    await waitFor(() => screen.getByText(mockTrip.name));
    // There are two buttons with name="edit-trip": index 0 is stats, index 1 is edit
    fireEvent.click(document.querySelectorAll('[name="edit-trip"]')[1]!);

    await waitFor(() => screen.getByPlaceholderText("Trip to Fiji"));
    fireEvent.update(screen.getByPlaceholderText("Trip to Fiji"), "Japan Trip 2024");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Save Changes/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(updateTrip).toHaveBeenCalledOnce();
    });
  });
});

describe("Trip — delete", () => {
  it("deletes the trip and navigates away after confirming", async () => {
    vi.mocked(getTripData).mockResolvedValue({
      trip: mockTrip,
      expenses: [],
      countries: mockTripDataState.countries,
      currencyIds: [1],
      categories: [],
      userIds: [1],
    });
    vi.mocked(deleteTrip).mockResolvedValue(undefined as any);

    const { router } = await renderTripDataView();

    await waitFor(() => screen.getByText(mockTrip.name));

    fireEvent.click(document.querySelector('[name="delete-trip"]')!);

    await waitFor(() => screen.getByRole("button", { name: "Confirm" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(deleteTrip).toHaveBeenCalledWith(TRIP_ID);
      // Router pushes to "/" which redirects to "/trips"
      expect(router.currentRoute.value.path).toBe("/trips");
    });
  });
});
