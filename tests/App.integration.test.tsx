import App from "@/App.vue";
import { createAppRouter } from "@/router";
import { createTestingPinia } from "@pinia/testing";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/vue";
import { addDays, format, subDays } from "date-fns";
import { beforeEach, describe, expect, it, vi } from "vitest";

import loadAppData from "@/api/app";
import { loadCitiesForCountry } from "@/api/country";
import { createTrip, deleteTrip, getTripData, getTrips, updateTrip, type Trip } from "@/api/trip";
import { login } from "@/api/user";

import { addExpensesToTrip, deleteExpense, updateExpense } from "@/api/expense";
import useAppStore from "@/store/appStore";
import { formatDateRange } from "@/utils/ui";
import type { StateTree } from "pinia";
import { ref } from "vue";
import { GET_APP_DATA_FIXTURE, GET_TRIP_DATA_FIXTURE } from "./fixtures/api";
import { RESTAURANTS } from "./fixtures/categories";
import { IRELAND_FOR_TRIP, UAE_FOR_TRIP } from "./fixtures/countries_cities";
import { AED, EURO } from "./fixtures/currencies";
import { AED_MOCK_EXPENSE_ONE, EURO_MOCK_EXPENSE_ONE } from "./fixtures/expenses";
import { TESTING_TRIP } from "./fixtures/trip";
import { MOCK_TOKEN, USER_ONE, USER_TWO } from "./fixtures/users";

// --- API mocks only ---
vi.mock("@/api/user", () => ({ login: vi.fn() }));
vi.mock("@/api/app", () => ({ default: vi.fn() }));
vi.mock("@/api/axios", () => ({ createInstance: vi.fn(), default: vi.fn() }));
vi.mock("@/api/trip", () => ({
  getTrips: vi.fn(),
  createTrip: vi.fn(),
  updateTrip: vi.fn(),
  deleteTrip: vi.fn(),
  getTripData: vi.fn(),
}));
vi.mock("@/api/country", () => ({
  loadCitiesForCountry: vi.fn(),
}));
vi.mock("@/api/expense", () => ({
  addExpensesToTrip: vi.fn(),
  updateExpense: vi.fn(),
  deleteExpense: vi.fn(),
}));
vi.mock("@/api/file", () => ({ uploadFile: vi.fn() }));
vi.mock("@vueuse/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@vueuse/core")>();
  return {
    ...actual,
    useOnline: () => ref(true),
    onClickOutside: () => {},
  };
});

async function renderApp({
  initialState,
  skipAppDataLoad,
}: { initialState?: StateTree; skipAppDataLoad?: boolean } = {}) {
  const router = createAppRouter();

  const store = createTestingPinia({ stubActions: false, initialState });

  render(App, {
    global: {
      plugins: [router, store],
      stubs: { "fa-icon": true, Logo: { template: "<div />" } },
    },
  });

  await router.isReady();

  if (!skipAppDataLoad) {
    const appStore = useAppStore();
    // loadAppData is only called when the user logs in, or if they are logged in on app load
    // so we need to call it manually here
    await appStore.loadAppData();
  }

  return { router };
}

describe("App.integration", () => {
  beforeEach(() => {
    vi.resetAllMocks(); // reset implementations too, not just call history
    cleanup();
    localStorage.clear();
  });

  describe("Login", () => {
    it("should allow the user to login and redirect to the trip view", async () => {
      vi.mocked(login).mockResolvedValue({ user: USER_ONE, token: MOCK_TOKEN });
      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTrips).mockResolvedValue([]);

      const { router } = await renderApp({ skipAppDataLoad: true });

      await router.push("/");

      await fireEvent.update(screen.getByPlaceholderText("you@example.com"), "alan@example.com");
      await fireEvent.update(screen.getByPlaceholderText("password"), "password");
      await fireEvent.click(screen.getByRole("button", { name: "Log In" }));

      await waitFor(() => {
        expect(router.currentRoute.value.path).toBe("/trips");
      });

      expect(loadAppData).toHaveBeenCalledOnce();
    });

    it("shows error message on failed login", async () => {
      vi.mocked(login).mockRejectedValue(new Error("Invalid credentials"));

      const { router } = await renderApp();

      await router.push("/");

      await fireEvent.update(screen.getByPlaceholderText("you@example.com"), "bad@example.com");
      await fireEvent.update(screen.getByPlaceholderText("password"), "wrong2");
      await fireEvent.click(screen.getByRole("button", { name: "Log In" }));

      await waitFor(() => {
        expect(screen.getByText("Invalid username or password...")).toBeInTheDocument();
      });
    });
  });

  describe("Trips View", () => {
    const loggedInState: StateTree = {
      app: { authToken: MOCK_TOKEN.token, user: USER_ONE },
    };

    it("shows an empty state if no trips have been added", async () => {
      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTrips).mockResolvedValue([]);

      const { router } = await renderApp({ initialState: loggedInState });
      await router.push("/trips");

      await waitFor(() => {
        expect(screen.getByText("Your trips")).toBeInTheDocument();
      });

      expect(screen.queryByText("Happening now")).not.toBeInTheDocument();
      expect(screen.queryByText("Up next")).not.toBeInTheDocument();
      expect(screen.queryByText("Past trips")).not.toBeInTheDocument();
    });

    it("shows a list of current, upcoming and past trips", async () => {
      const currentTrip: Trip = {
        ...TESTING_TRIP,
        id: 10,
        name: "Current Trip",
        startDate: format(subDays(new Date(), 1), "dd MMM yyyy"),
        endDate: format(addDays(new Date(), 1), "dd MMM yyyy"),
      };
      const upcomingTrip: Trip = {
        ...TESTING_TRIP,
        id: 11,
        name: "Upcoming Trip",
        startDate: format(addDays(new Date(), 5), "dd MMM yyyy"),
        endDate: format(addDays(new Date(), 12), "dd MMM yyyy"),
      };
      const pastTrip: Trip = {
        ...TESTING_TRIP,
        id: 12,
        name: "Past Trip",
        startDate: format(subDays(new Date(), 10), "dd MMM yyyy"),
        endDate: format(subDays(new Date(), 3), "dd MMM yyyy"),
      };

      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTrips).mockResolvedValue([currentTrip, upcomingTrip, pastTrip]);

      const { router } = await renderApp({ initialState: loggedInState });
      await router.push("/trips");

      await waitFor(() => {
        expect(screen.getByText("Happening now")).toBeInTheDocument();
      });

      expect(screen.getByText("Up next")).toBeInTheDocument();
      expect(screen.getByText("Past trips")).toBeInTheDocument();

      expect(screen.getByText("Current Trip")).toBeInTheDocument();
      expect(screen.getByText("Upcoming Trip")).toBeInTheDocument();
      expect(screen.getByText("Past Trip")).toBeInTheDocument();
    });

    it("allows adding a new trip", async () => {
      const IRELAND_CITIES = [
        { id: 1, name: "Cork", countryId: 1 },
        { id: 2, name: "Dublin", countryId: 1 },
      ];
      const UAE_CITIES = [
        { id: 3, name: "Dubai", countryId: 226 },
        { id: 4, name: "Abu Dhabi", countryId: 226 },
      ];
      const newTrip: Trip = {
        ...TESTING_TRIP,
        id: 99,
        name: "My New Trip",
        startDate: "01 Aug 2026",
        endDate: "10 Aug 2026",
      };

      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTrips).mockResolvedValue([]);
      vi.mocked(createTrip).mockResolvedValue(newTrip);
      vi.mocked(loadCitiesForCountry).mockImplementation(async (countryId) => {
        if (countryId === 1) return IRELAND_CITIES;
        if (countryId === 226) return UAE_CITIES;
        return [];
      });

      const { router } = await renderApp({ initialState: loggedInState });
      await router.push("/trips");

      await waitFor(() => expect(screen.getByText("Your trips")).toBeInTheDocument());

      // Open the Add Trip drawer
      await fireEvent.click(screen.getByRole("button", { name: /add trip/i }));

      // Wait for the drawer form to open (DrawerTitle renders as <h2>)
      await waitFor(() => expect(screen.getByRole("heading", { name: "Add Trip" })).toBeInTheDocument());

      // Fill in trip name via testid
      await fireEvent.update(screen.getByTestId("trip-name-input"), "My New Trip");

      // Set start and end dates
      await fireEvent.update(screen.getByTestId("trip-start-date-input"), "2026-08-01");
      await fireEvent.update(screen.getByTestId("trip-end-date-input"), "2026-08-10");

      // Add Ireland with Cork + Dublin
      await fireEvent.click(screen.getByRole("button", { name: /add destination/i }));
      await waitFor(() => expect(screen.getByText("Choose a country")).toBeInTheDocument());
      await fireEvent.click(screen.getByRole("button", { name: "Ireland" }));
      await waitFor(() => expect(screen.getByText("Cork")).toBeInTheDocument());
      await fireEvent.click(screen.getByRole("button", { name: "Cork" }));
      await fireEvent.click(screen.getByRole("button", { name: "Dublin" }));
      await fireEvent.click(screen.getByRole("button", { name: /save 2 cities/i }));

      // Add UAE with Dubai + Abu Dhabi
      await waitFor(() =>
        expect(screen.getByRole("button", { name: /add destination/i })).toBeInTheDocument(),
      );
      await fireEvent.click(screen.getByRole("button", { name: /add destination/i }));
      await waitFor(() => expect(screen.getByText("Choose a country")).toBeInTheDocument());
      await fireEvent.click(screen.getByRole("button", { name: "United Arab Emirates" }));
      await waitFor(() => expect(screen.getByText("Dubai")).toBeInTheDocument());
      await fireEvent.click(screen.getByRole("button", { name: "Dubai" }));
      await fireEvent.click(screen.getByRole("button", { name: "Abu Dhabi" }));
      await fireEvent.click(screen.getByRole("button", { name: /save 2 cities/i }));

      // Add second user (USER_ONE is already included as current user)
      await waitFor(() =>
        expect(screen.getByRole("button", { name: /add destination/i })).toBeInTheDocument(),
      );
      await fireEvent.click(screen.getByRole("button", { name: "Two" }));

      // Submit
      await waitFor(() => expect(screen.getByRole("button", { name: "Add" })).not.toBeDisabled());
      await fireEvent.click(screen.getByRole("button", { name: "Add" }));

      await waitFor(() => {
        expect(createTrip).toHaveBeenCalledOnce();
        expect(createTrip).toHaveBeenCalledWith({
          name: "My New Trip",
          startDate: "2026-08-01",
          endDate: "2026-08-10",
          countries: [
            { countryId: 1, cityIds: [1, 2] },
            { countryId: 226, cityIds: [3, 4] },
          ],
          userIds: [USER_ONE.id, USER_TWO.id],
        });
      });

      await waitFor(() => {
        expect(screen.getByText("My New Trip")).toBeInTheDocument();
      });
    });

    it("allows deleting a trip", async () => {
      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTrips).mockResolvedValue([TESTING_TRIP]);
      vi.mocked(deleteTrip).mockResolvedValue(undefined as any);

      const { router } = await renderApp({ initialState: loggedInState });
      await router.push("/trips");

      await waitFor(() => expect(screen.getByText("Testing Trip")).toBeInTheDocument());

      // Long-press the trip card to open the info modal
      vi.useFakeTimers();
      const tripCard = screen.getByText("Testing Trip").closest("button")!;
      await fireEvent.pointerDown(tripCard);
      vi.advanceTimersByTime(510);
      vi.useRealTimers();

      // Click Delete in the info modal
      await waitFor(() => expect(screen.getByText("Testing Trip")).toBeInTheDocument());
      await fireEvent.click(screen.getByRole("button", { name: /^Delete$/ }));

      // Confirm in the dialog that appears
      await waitFor(() => expect(screen.getByText("Confirm Delete")).toBeInTheDocument());
      const allDeleteButtons = screen.getAllByRole("button", { name: /^Delete$/ });
      await fireEvent.click(allDeleteButtons[allDeleteButtons.length - 1]);

      await waitFor(() => {
        expect(deleteTrip).toHaveBeenCalledWith(TESTING_TRIP.id);
      });

      await waitFor(() => {
        expect(screen.queryByText("Testing Trip")).not.toBeInTheDocument();
      });
    });
  });

  describe("Trip View", () => {
    const loggedInState: StateTree = {
      app: { authToken: MOCK_TOKEN.token, user: USER_ONE },
    };

    // Country fixtures with globally-unique city IDs so currency auto-sync works correctly
    const CORK_CITY = { id: 10, name: "Cork" };
    const DUBAI_CITY = { id: 20, name: "Dubai" };
    const IRELAND = { ...IRELAND_FOR_TRIP, cities: [CORK_CITY, { id: 11, name: "Dublin" }] };
    const UAE = { ...UAE_FOR_TRIP, cities: [DUBAI_CITY, { id: 21, name: "Abu Dhabi" }] };

    // Factory — always returns a fresh object so store mutations (e.g. splice in deleteExpense)
    // never corrupt data shared between tests.
    const makeExpenseTripData = (overrides: { expenses?: (typeof EURO_MOCK_EXPENSE_ONE)[] } = {}) => ({
      ...GET_TRIP_DATA_FIXTURE,
      countries: [{ ...IRELAND }, { ...UAE }],
      expenses: overrides.expenses ?? [{ ...EURO_MOCK_EXPENSE_ONE, city: { ...CORK_CITY } }],
    });

    // Convenience alias used in expense assertions; matches EURO_MOCK_EXPENSE_ONE.id
    const EXPENSE_ONE_ID = EURO_MOCK_EXPENSE_ONE.id;

    const navigateToTrip = async () => {
      // The router's auth guard redirects to /trips on initial load, briefly rendering TripsView
      // which calls getTrips(). Guard it so the store doesn't receive undefined.
      vi.mocked(getTrips).mockResolvedValue([]);
      const { router } = await renderApp({ initialState: loggedInState });
      await router.push(`/trips/${TESTING_TRIP.id}`);
      return { router };
    };

    it("shows an empty state if no expenses have been added", async () => {
      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTripData).mockResolvedValue({ ...GET_TRIP_DATA_FIXTURE, expenses: [] });

      await navigateToTrip();

      await waitFor(() => {
        expect(screen.getByText("No expenses just yet")).toBeInTheDocument();
      });
    });

    it("shows various trip data", async () => {
      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTripData).mockResolvedValue(GET_TRIP_DATA_FIXTURE);

      await navigateToTrip();

      await waitFor(() => expect(screen.getByText(TESTING_TRIP.name)).toBeInTheDocument());

      // Date range derived from the trip's start/end (keeps test in sync with the fixture)
      expect(
        screen.getByText(formatDateRange(TESTING_TRIP.startDate, TESTING_TRIP.endDate)),
      ).toBeInTheDocument();

      // Country flags for Ireland and UAE
      expect(screen.getByTestId("country-flag-IE")).toBeInTheDocument();
      expect(screen.getByTestId("country-flag-AE")).toBeInTheDocument();

      // Total spent: €10.00 (EURO expense) + €4.00 (AED expense) = €14.00
      expect(screen.getByTestId("total-expense-amount")).toHaveTextContent("€14.00");
    });

    it("shows a list of expenses", async () => {
      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTripData).mockResolvedValue(GET_TRIP_DATA_FIXTURE);

      await navigateToTrip();

      // Both expenses are visible
      await waitFor(() => {
        expect(screen.getByTestId("expense-1")).toBeInTheDocument();
        expect(screen.getByTestId("expense-2")).toBeInTheDocument();
      });

      // Both share the same date so they appear under one date header
      expect(screen.getByText(/Mar 28/)).toBeInTheDocument();

      // Spot-check EURO_MOCK_EXPENSE_ONE fields: description, time, city, amount
      const expense1 = screen.getByTestId(`expense-${EURO_MOCK_EXPENSE_ONE.id}`);
      expect(within(expense1).getByText("Testing expense EURO")).toBeInTheDocument();
      expect(within(expense1).getByText("23:42")).toBeInTheDocument();
      expect(within(expense1).getByText("Cork")).toBeInTheDocument();
      expect(within(expense1).getByText("€10.00")).toBeInTheDocument();
    });

    it("allows filtering expenses", async () => {
      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTripData).mockResolvedValue(GET_TRIP_DATA_FIXTURE);

      await navigateToTrip();

      await waitFor(() => {
        expect(screen.getByTestId("expense-1")).toBeInTheDocument();
        expect(screen.getByTestId("expense-2")).toBeInTheDocument();
      });

      // --- Category filter ---
      await fireEvent.click(screen.getByTestId("open-filters-button"));
      await waitFor(() => expect(screen.getByRole("heading", { name: "Filters" })).toBeInTheDocument());

      // Selecting "Restaurants" should hide the AED (Snacks/Drinks) expense
      await fireEvent.click(screen.getByRole("button", { name: "Restaurants" }));
      await waitFor(() => {
        expect(screen.getByTestId("expense-1")).toBeInTheDocument();
        expect(screen.queryByTestId("expense-2")).not.toBeInTheDocument();
      });

      // Clear all filters — both expenses should reappear
      await fireEvent.click(screen.getByRole("button", { name: /clear all/i }));
      await waitFor(() => {
        expect(screen.getByTestId("expense-1")).toBeInTheDocument();
        expect(screen.getByTestId("expense-2")).toBeInTheDocument();
      });

      // --- Description search filter ---
      await fireEvent.click(screen.getByTestId("open-filters-button"));
      await waitFor(() => expect(screen.getByRole("heading", { name: "Filters" })).toBeInTheDocument());

      await fireEvent.update(
        screen.getByPlaceholderText("Filter by expense description..."),
        "Testing expense AED",
      );

      await waitFor(() => {
        expect(screen.queryByTestId("expense-1")).not.toBeInTheDocument();
        expect(screen.getByTestId("expense-2")).toBeInTheDocument();
      });
    });

    it("allows adding a new expense", async () => {
      const addedExpense = {
        ...AED_MOCK_EXPENSE_ONE,
        id: 99,
        description: "Lunch at restaurant",
        city: DUBAI_CITY,
        currency: AED,
        euroAmount: "13.62",
        amount: "50.00",
        category: RESTAURANTS,
        users: [USER_ONE, USER_TWO],
        localDateTime: "2026-09-01T14:30:00",
      };

      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTripData).mockResolvedValue(makeExpenseTripData({ expenses: [] }));
      vi.mocked(addExpensesToTrip).mockResolvedValue({ data: { expenses: [addedExpense] } } as any);

      await navigateToTrip();
      await waitFor(() => expect(screen.getByText("No expenses just yet")).toBeInTheDocument());

      // Open the add expense form
      await fireEvent.click(screen.getByTestId("add-expense-button"));
      await waitFor(() => expect(screen.getByRole("heading", { name: "Add Expense" })).toBeInTheDocument());

      // Change date/time
      await fireEvent.update(screen.getByTestId("expense-date-input"), "2026-09-01T14:30");

      // Select Dubai (UAE) — city id=20, which belongs to UAE so currency should auto-switch to AED
      await fireEvent.change(screen.getByTestId("expense-city-select"), { target: { value: "20" } });
      await waitFor(() => {
        const currencySelect = screen.getByTestId("expense-currency-select") as HTMLSelectElement;
        expect(currencySelect.value).toBe(String(AED.id));
      });

      // Enter amount and description
      await fireEvent.update(screen.getByTestId("expense-amount-input"), "50.00");
      await fireEvent.update(screen.getByTestId("expense-description-input"), "Lunch at restaurant");

      // Select category
      await fireEvent.click(screen.getByRole("button", { name: /restaurants/i }));

      // Select both users (neither is pre-selected for a new expense)
      await fireEvent.click(screen.getByRole("button", { name: "One" }));
      await fireEvent.click(screen.getByRole("button", { name: "Two" }));

      // Submit
      await waitFor(() => expect(screen.getByTestId("submit-expense-button")).not.toBeDisabled());
      await fireEvent.click(screen.getByTestId("submit-expense-button"));

      await waitFor(() => {
        expect(addExpensesToTrip).toHaveBeenCalledWith(TESTING_TRIP.id, [
          expect.objectContaining({
            localDateTime: "2026-09-01T14:30:00",
            cityId: 20,
            currencyId: AED.id,
            amount: 50,
            categoryId: RESTAURANTS.id,
            description: "Lunch at restaurant",
            userIds: expect.arrayContaining([USER_ONE.id, USER_TWO.id]),
          }),
        ]);
      });

      // New expense appears in the list
      await waitFor(() => expect(screen.getByTestId("expense-99")).toBeInTheDocument());
      expect(within(screen.getByTestId("expense-99")).getByText("Lunch at restaurant")).toBeInTheDocument();

      // Reopening the form (even before the closing drawer animation finishes) must not show stale data
      await fireEvent.click(screen.getByTestId("add-expense-button"));
      await waitFor(() => expect(screen.getByRole("heading", { name: "Add Expense" })).toBeInTheDocument());

      expect((screen.getByTestId("expense-description-input") as HTMLInputElement).value).toBe("");
      expect((screen.getByTestId("expense-amount-input") as HTMLInputElement).value).toBe("");
      expect((screen.getByTestId("expense-city-select") as HTMLSelectElement).value).toBe("null");
    });

    it("allows editing an existing expense", async () => {
      const updatedExpense = {
        ...EURO_MOCK_EXPENSE_ONE,
        city: CORK_CITY,
        description: "Updated description",
        amount: "25.00",
        euroAmount: "25.00",
      };

      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTripData).mockResolvedValue(makeExpenseTripData());
      vi.mocked(updateExpense).mockResolvedValue({ expense: updatedExpense });

      await navigateToTrip();
      await waitFor(() => expect(screen.getByTestId(`expense-${EXPENSE_ONE_ID}`)).toBeInTheDocument());

      // Open ViewExpense by clicking the expense row
      await fireEvent.click(screen.getByTestId(`expense-${EXPENSE_ONE_ID}`));
      await waitFor(() => expect(screen.getByRole("heading", { name: /€/ })).toBeInTheDocument());

      // Open the edit form
      await fireEvent.click(screen.getByRole("button", { name: /^Edit$/ }));
      await waitFor(() => expect(screen.getByRole("heading", { name: "Edit Expense" })).toBeInTheDocument());

      // Verify pre-filled data
      expect((screen.getByTestId("expense-description-input") as HTMLInputElement).value).toBe(
        EURO_MOCK_EXPENSE_ONE.description,
      );
      expect((screen.getByTestId("expense-amount-input") as HTMLInputElement).value).toBe(
        EURO_MOCK_EXPENSE_ONE.amount,
      );
      expect((screen.getByTestId("expense-city-select") as HTMLSelectElement).value).toBe(
        String(CORK_CITY.id),
      );
      expect((screen.getByTestId("expense-currency-select") as HTMLSelectElement).value).toBe(
        String(EURO.id),
      );

      // Edit description and amount
      await fireEvent.update(screen.getByTestId("expense-description-input"), "Updated description");
      await fireEvent.update(screen.getByTestId("expense-amount-input"), "25.00");

      // Save
      await waitFor(() => expect(screen.getByTestId("submit-expense-button")).not.toBeDisabled());
      await fireEvent.click(screen.getByTestId("submit-expense-button"));

      await waitFor(() => {
        expect(updateExpense).toHaveBeenCalledWith(
          EXPENSE_ONE_ID,
          expect.objectContaining({
            description: "Updated description",
            amount: 25,
            cityId: CORK_CITY.id,
            currencyId: EURO.id,
            categoryId: EURO_MOCK_EXPENSE_ONE.category.id,
            userIds: [USER_ONE.id],
          }),
        );
      });

      // Updated values reflected in the expense list
      expect(
        within(screen.getByTestId(`expense-${EXPENSE_ONE_ID}`)).getByText("Updated description"),
      ).toBeInTheDocument();
      expect(within(screen.getByTestId(`expense-${EXPENSE_ONE_ID}`)).getByText("€25.00")).toBeInTheDocument();
    });

    it("does not prefill the add expense form with a previously edited expense", async () => {
      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTripData).mockResolvedValue(makeExpenseTripData());

      await navigateToTrip();
      await waitFor(() => expect(screen.getByTestId(`expense-${EXPENSE_ONE_ID}`)).toBeInTheDocument());

      // Open ViewExpense, then Edit
      await fireEvent.click(screen.getByTestId(`expense-${EXPENSE_ONE_ID}`));
      await waitFor(() => expect(screen.getByRole("heading", { name: /€/ })).toBeInTheDocument());
      await fireEvent.click(screen.getByRole("button", { name: /^Edit$/ }));
      await waitFor(() => expect(screen.getByRole("heading", { name: "Edit Expense" })).toBeInTheDocument());
      expect((screen.getByTestId("expense-description-input") as HTMLInputElement).value).toBe(
        EURO_MOCK_EXPENSE_ONE.description,
      );

      // Close without saving
      await fireEvent.click(screen.getByTestId("close-expense-form-button"));
      await waitFor(() =>
        expect(screen.queryByRole("heading", { name: "Edit Expense" })).not.toBeInTheDocument(),
      );

      // Open the add expense form and confirm it's blank, not the edited expense's data
      await fireEvent.click(screen.getByTestId("add-expense-button"));
      await waitFor(() => expect(screen.getByRole("heading", { name: "Add Expense" })).toBeInTheDocument());

      expect((screen.getByTestId("expense-description-input") as HTMLInputElement).value).toBe("");
      expect((screen.getByTestId("expense-amount-input") as HTMLInputElement).value).toBe("");
      expect((screen.getByTestId("expense-city-select") as HTMLSelectElement).value).toBe("null");
    });

    it("allows deleting an expense", async () => {
      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTripData).mockResolvedValue(makeExpenseTripData());
      vi.mocked(deleteExpense).mockResolvedValue(undefined as any);

      await navigateToTrip();
      await waitFor(() => expect(screen.getByTestId(`expense-${EXPENSE_ONE_ID}`)).toBeInTheDocument());

      // Open ViewExpense
      await fireEvent.click(screen.getByTestId(`expense-${EXPENSE_ONE_ID}`));
      await waitFor(() => expect(screen.getByRole("heading", { name: /€/ })).toBeInTheDocument());

      // Click Delete to open confirm dialog
      await fireEvent.click(screen.getByRole("button", { name: /^Delete$/ }));
      await waitFor(() => expect(screen.getByText("Confirm Delete")).toBeInTheDocument());

      // Confirm deletion
      const deleteButtons = screen.getAllByRole("button", { name: /^Delete$/ });
      await fireEvent.click(deleteButtons[deleteButtons.length - 1]);

      await waitFor(() => expect(deleteExpense).toHaveBeenCalledWith(EXPENSE_ONE_ID));
      await waitFor(() => expect(screen.queryByTestId(`expense-${EXPENSE_ONE_ID}`)).not.toBeInTheDocument());
    });

    it("allows copying an expense", async () => {
      const copiedExpense = {
        ...EURO_MOCK_EXPENSE_ONE,
        city: CORK_CITY,
        id: 88,
        description: "[CP] Testing expense EURO",
      };

      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTripData).mockResolvedValue(makeExpenseTripData());
      vi.mocked(addExpensesToTrip).mockResolvedValue({ data: { expenses: [copiedExpense] } } as any);

      await navigateToTrip();
      await waitFor(() => expect(screen.getByTestId(`expense-${EXPENSE_ONE_ID}`)).toBeInTheDocument());

      // Open ViewExpense and click Copy
      await fireEvent.click(screen.getByTestId(`expense-${EXPENSE_ONE_ID}`));
      await waitFor(() => expect(screen.getByRole("heading", { name: /€/ })).toBeInTheDocument());
      await fireEvent.click(screen.getByRole("button", { name: /^Copy$/ }));

      // Form opens with [CP] prefix in description
      await waitFor(() => expect(screen.getByRole("heading", { name: "Copy Expense" })).toBeInTheDocument());
      expect((screen.getByTestId("expense-description-input") as HTMLInputElement).value).toBe(
        "[CP] Testing expense EURO",
      );

      // Submit the copy
      await waitFor(() => expect(screen.getByTestId("submit-expense-button")).not.toBeDisabled());
      await fireEvent.click(screen.getByTestId("submit-expense-button"));

      await waitFor(() => {
        expect(addExpensesToTrip).toHaveBeenCalledWith(TESTING_TRIP.id, [
          expect.objectContaining({ description: "[CP] Testing expense EURO" }),
        ]);
      });

      // Copied expense appears alongside the original
      await waitFor(() => expect(screen.getByTestId("expense-88")).toBeInTheDocument());
    });

    it("allows editing the trip", async () => {
      const updatedName = "Updated Trip Name";
      const tripData = makeExpenseTripData();

      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTripData).mockResolvedValue(tripData);
      vi.mocked(updateTrip).mockResolvedValue({
        trip: { ...TESTING_TRIP, name: updatedName },
        countries: tripData.countries,
        userIds: tripData.userIds,
        currencyIds: tripData.currencyIds,
      });

      await navigateToTrip();

      await waitFor(() => expect(screen.getByText(TESTING_TRIP.name)).toBeInTheDocument());

      // Open the edit drawer
      await fireEvent.click(screen.getByRole("button", { name: /edit trip/i }));
      await waitFor(() => expect(screen.getByRole("heading", { name: "Edit Trip" })).toBeInTheDocument());

      // Update the trip name
      await fireEvent.update(screen.getByTestId("trip-name-input"), updatedName);

      // Save button becomes enabled once a field changes
      await waitFor(() => expect(screen.getByRole("button", { name: "Save" })).not.toBeDisabled());
      await fireEvent.click(screen.getByRole("button", { name: "Save" }));

      await waitFor(() => {
        expect(updateTrip).toHaveBeenCalledWith(
          TESTING_TRIP.id,
          expect.objectContaining({
            name: updatedName,
            countries: [
              { countryId: IRELAND.id, cityIds: [CORK_CITY.id, 11] },
              { countryId: UAE.id, cityIds: [DUBAI_CITY.id, 21] },
            ],
            userIds: [USER_ONE.id, USER_TWO.id],
          }),
        );
      });

      // Updated name reflected in the trip header
      await waitFor(() => expect(screen.getByText(updatedName)).toBeInTheDocument());
    });
  });
});
