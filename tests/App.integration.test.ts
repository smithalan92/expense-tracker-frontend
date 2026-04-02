import App from "@/app/App.vue";
import { createAppRouter } from "@/app/router";
import { createTestingPinia } from "@pinia/testing";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

import loadAppData from "@/api/app";
import { login } from "@/api/user";

import { loadCitiesForCountry } from "@/api/country";
import { addExpensesToTrip, deleteExpense, updateExpense, type TripExpense } from "@/api/expense";
import { createTrip, getTripData, getTrips, type Trip } from "@/api/trip";
import useAppStore from "@/stores/appStore";
import { format } from "date-fns";
import type { StateTree } from "pinia";
import { ref } from "vue";
import {
  GET_APP_DATA_FIXTURE,
  GET_TRIP_DATA_FIXTURE,
  GET_TRIPS_FIXTURE,
  LOAD_CITIES_FOR_COUNTRIES_FIXTURE,
} from "./fixtures/api";
import { SNACKS_DRINKS } from "./fixtures/categories";
import { CORK, DUBAI, DUBLIN, IRELAND_FOR_TRIP, UAE_FOR_TRIP } from "./fixtures/countries_cities";
import { AED } from "./fixtures/currencies";
import { AED_MOCK_EXPENSE_ONE, EURO_MOCK_EXPENSE_ONE } from "./fixtures/expenses";
import { FAKE_TRIP, TESTING_TRIP } from "./fixtures/trip";
import { MOCK_TOKEN, USER_ONE } from "./fixtures/users";

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
vi.mock("@vueuse/core", () => ({
  useOnline: () => ref(true),
  onClickOutside: () => {},
}));

// No need to render FA Icons
vi.mock("@fortawesome/vue-fontawesome", () => ({
  FontAwesomeIcon: { template: "<span />" },
}));

// Poppoer causes errors in tests
vi.mock("@/utils/Tooltip.vue", () => ({
  default: {
    props: ["message", "disabled", "forceOpenOnMobile", "placement"],
    template: "<span><slot /></span>",
  },
}));

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
    vi.clearAllMocks();
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

      await fireEvent.update(screen.getByPlaceholderText("Email"), "alan@example.com");
      await fireEvent.update(screen.getByPlaceholderText("Password"), "password");
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

      await fireEvent.update(screen.getByPlaceholderText("Email"), "bad@example.com");
      await fireEvent.update(screen.getByPlaceholderText("Password"), "wrong");
      await fireEvent.click(screen.getByRole("button", { name: "Log In" }));

      await waitFor(() => {
        expect(screen.getByText("Invalid username or password")).toBeInTheDocument();
      });
    });
  });

  describe("Trips View", () => {
    const getInitalState = () => ({
      app: {
        authToken: "test-token",
        user: USER_ONE,
      },
    });

    beforeEach(() => {
      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTrips).mockResolvedValue(GET_TRIPS_FIXTURE.trips);
    });

    it("shows the empty state when there are no trips", async () => {
      vi.mocked(getTrips).mockResolvedValue([]);

      const { router } = await renderApp({ initialState: getInitalState() });

      await router.push("/trips");

      await waitFor(() => {
        expect(screen.getByText("No trips yet"));
      });

      const addFirstTripButton = screen.getByRole("button", { name: /Add Your First Trip/i });

      await fireEvent.click(addFirstTripButton);

      await waitFor(() => screen.getByPlaceholderText("Trip to Fiji"));
    });

    it("should display a list of trips and the trip overview data", async () => {
      const { router } = await renderApp({ initialState: getInitalState() });

      await router.push("/trips");

      await waitFor(() => {
        expect(screen.getByText(TESTING_TRIP.name));
        expect(screen.getByText(FAKE_TRIP.name));
      });

      const trip = screen.getByTestId(`trip-${TESTING_TRIP.id}`);

      within(trip).getByText(`€${TESTING_TRIP.totalExpenseAmount}`);

      const startDate = `${format(new Date(TESTING_TRIP.startDate), "MMM dd")}`;
      const endDate = format(new Date(TESTING_TRIP.endDate), "MMM dd, yyyy");

      within(trip).getByText(`${startDate} - ${endDate}`);
    });

    it("should allow adding a new trip", async () => {
      const startDate = new Date("2026-04-01");
      const endDate = new Date("2026-05-01");

      const expectedNewTrip: Trip = {
        id: Math.ceil(Math.random() * 1024 + 2),
        name: "Ireland Trip",
        startDate: format(startDate, "dd MMM yyyy"),
        endDate: format(endDate, "dd MMM yyyy"),
        totalExpenseAmount: 0,
        image: "http://foo.com",
      };

      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTrips).mockResolvedValue(GET_TRIPS_FIXTURE.trips);
      vi.mocked(loadCitiesForCountry).mockResolvedValue(LOAD_CITIES_FOR_COUNTRIES_FIXTURE.cities);
      vi.mocked(createTrip).mockResolvedValue(expectedNewTrip);

      const { router } = await renderApp({ initialState: getInitalState() });

      await router.push("/trips");

      await waitFor(() => {
        expect(screen.getByText(TESTING_TRIP.name));
      });

      await waitFor(() => screen.getByRole("button", { name: /Add new trip/i }));
      await fireEvent.click(screen.getByRole("button", { name: /Add new trip/i }));

      await waitFor(() => screen.getByPlaceholderText("Trip to Fiji"));

      //Fill trip name
      await fireEvent.update(screen.getByPlaceholderText("Trip to Fiji"), "Ireland Trip");

      // Select start date
      const startDateInput = screen.getByTestId("start-date-picker");
      await fireEvent.update(startDateInput, format(startDate, "yyyy-MM-dd"));

      // Select end date
      const endDateinput = screen.getByTestId("end-date-picker");
      await fireEvent.update(endDateinput, format(endDate, "yyyy-MM-dd"));

      // Add a country via the stubbed AddCountryModal
      await fireEvent.click(screen.getByRole("button", { name: /Add Country/i }));

      await waitFor(() => screen.getByTestId("add-country-modal"));

      // Select Ireland from the country picker (vue-multiselect renders a combobox)
      const countryInput = screen.getByRole("combobox");
      await fireEvent.focus(countryInput);
      await fireEvent.update(countryInput, "Ireland");
      await waitFor(() => screen.getByText("Ireland"));
      await fireEvent.click(screen.getByText("Ireland"));

      // Wait for cities to load and select Cork
      await waitFor(() => screen.getByText("Cork"));
      await fireEvent.click(screen.getByText("Cork"));

      await fireEvent.click(screen.getByRole("button", { name: "Save" }));

      // Create Trip button should now be enabled (user is pre-selected, dates default to today)
      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Create Trip/i })).not.toBeDisabled();
      });

      await fireEvent.click(screen.getByRole("button", { name: /Create Trip/i }));

      await waitFor(() => {
        expect(createTrip).toHaveBeenCalledOnce();
      });

      expect(createTrip).toHaveBeenCalledWith({
        name: expectedNewTrip.name,
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
        countries: [
          {
            countryId: IRELAND_FOR_TRIP.id,
            cityIds: [CORK.id],
          },
        ],
        userIds: [USER_ONE.id],
      });

      // Now it should show in the trip list
      await waitFor(() => {
        expect(screen.getByText(expectedNewTrip.name));
      });

      const trip = screen.getByTestId(`trip-${expectedNewTrip.id}`);

      within(trip).getByText(`€0`);

      const startStr = format(startDate, "MMM dd");
      const endStr = format(endDate, "MMM dd, yyyy");

      within(trip).getByText(`${startStr} - ${endStr}`);
    });
  });

  describe("Trip Data view", () => {
    const getInitalState = () => ({
      app: {
        authToken: "test-token",
        user: USER_ONE,
      },
    });

    beforeEach(() => {
      vi.mocked(loadAppData).mockResolvedValue(GET_APP_DATA_FIXTURE);
      vi.mocked(getTrips).mockResolvedValue(GET_TRIPS_FIXTURE.trips);
      vi.mocked(getTripData).mockResolvedValue(GET_TRIP_DATA_FIXTURE);
    });

    it("should display a list of expenses + total spent for the trip", async () => {
      const { router } = await renderApp({ initialState: getInitalState() });

      await router.push(`/trips/${GET_TRIP_DATA_FIXTURE.trip.id}`);

      await waitFor(() => {
        expect(screen.getByText(GET_TRIP_DATA_FIXTURE.trip.name));
      });

      for (const expense of [EURO_MOCK_EXPENSE_ONE, AED_MOCK_EXPENSE_ONE]) {
        const el = screen.getByTestId(`expense-${expense.id}`, { suggest: false });

        within(el).getByText(expense.category.name);
        within(el).getByText(format(new Date(expense.localDateTime), "HH:mm"));
        within(el).getByText(expense.country.name);
        within(el).getByText(expense.description);
        within(el).getByText(expense.euroAmount);
      }

      // Verify the total amount spent is displayed
      const expectedTotal =
        parseFloat(EURO_MOCK_EXPENSE_ONE.euroAmount) + parseFloat(AED_MOCK_EXPENSE_ONE.euroAmount);
      screen.getByText(`€${expectedTotal.toFixed(2)}`);
    });

    it("should display expense data when clicking on it", async () => {
      const { router } = await renderApp({ initialState: getInitalState() });

      await router.push(`/trips/${GET_TRIP_DATA_FIXTURE.trip.id}`);

      await waitFor(() => {
        expect(screen.getByText(GET_TRIP_DATA_FIXTURE.trip.name));
      });

      // Click expense to open ViewExpenseModal
      await fireEvent.click(screen.getByTestId(`expense-${EURO_MOCK_EXPENSE_ONE.id}`));

      const viewModal = await screen.findByTestId(`view-expense-${EURO_MOCK_EXPENSE_ONE.id}`);

      within(viewModal).getByText(
        `€${EURO_MOCK_EXPENSE_ONE.euroAmount} / ${EURO_MOCK_EXPENSE_ONE.amount} ${EURO_MOCK_EXPENSE_ONE.currency.code}`,
      );

      within(viewModal).getByText(EURO_MOCK_EXPENSE_ONE.category.name);
      within(viewModal).getByText(
        `${EURO_MOCK_EXPENSE_ONE.city.name}, ${EURO_MOCK_EXPENSE_ONE.country.name}`,
      );

      const userNames = EURO_MOCK_EXPENSE_ONE.users.map((u) => `${u.firstName} ${u.lastName}`).join(",");
      within(viewModal).getByText(userNames);
      within(viewModal).getByText(EURO_MOCK_EXPENSE_ONE.description);

      within(viewModal).getByRole("button", { name: "Edit" });
      within(viewModal).getByRole("button", { name: "Copy" });
      within(viewModal).getByRole("button", { name: "Delete" });
    });

    it("should allow adding a new expense for the trip", async () => {
      const newMockExpense: TripExpense = {
        ...EURO_MOCK_EXPENSE_ONE,
        description: "New testing expense!!",
        amount: "5.00",
        euroAmount: "5.00",
        id: Math.ceil(Math.random() * 1000 + 1),
        city: DUBLIN,
        category: SNACKS_DRINKS,
      };

      vi.mocked(addExpensesToTrip).mockResolvedValue({
        data: { expenses: [newMockExpense] },
      } as any);

      const { router } = await renderApp({ initialState: getInitalState() });

      await router.push(`/trips/${GET_TRIP_DATA_FIXTURE.trip.id}`);

      await waitFor(() => {
        expect(screen.getByText(GET_TRIP_DATA_FIXTURE.trip.name));
      });

      await waitFor(() => screen.getByText(GET_TRIP_DATA_FIXTURE.trip.name));
      fireEvent.click(screen.getByRole("button", { name: /expense/i }));
      await waitFor(() => screen.getByRole("heading", { name: "Add Expense" }));

      // Select country (Japan)
      fireEvent.click(screen.getByRole("button", { name: "Ireland" }));
      // Select city (Tokyo)
      await waitFor(() => screen.getByRole("button", { name: "Dublin" }));
      fireEvent.click(screen.getByRole("button", { name: "Dublin" }));
      // Select category (Food)
      fireEvent.click(screen.getByRole("button", { name: "Snacks/Drinks" }));
      // Enter amount
      fireEvent.update(screen.getByPlaceholderText("0.00"), "5.00");
      // Add a note
      fireEvent.update(screen.getByPlaceholderText("Add a note..."), newMockExpense.description);

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Add Expense/i })).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole("button", { name: /Add Expense/i }));

      await waitFor(() => {
        expect(addExpensesToTrip).toHaveBeenCalledOnce();
      });

      const expenseEl = await waitFor(() => screen.getByTestId(`expense-${newMockExpense.id}`));

      within(expenseEl).findByText(newMockExpense.description);
      within(expenseEl).findByText(newMockExpense.euroAmount);
      within(expenseEl).findByText(newMockExpense.category.name);
      within(expenseEl).findByText(newMockExpense.country.name);
    });

    it("should allow editing an existing expense", async () => {
      const expecteUpdatedExpense: TripExpense = {
        ...EURO_MOCK_EXPENSE_ONE,
        country: { id: UAE_FOR_TRIP.id, name: UAE_FOR_TRIP.name },
        city: DUBAI,
        description: "edited expense",
        amount: "40.00",
        euroAmount: "10.00",
        currency: AED,
      };

      vi.mocked(updateExpense).mockResolvedValue({
        expense: expecteUpdatedExpense,
      });

      const { router } = await renderApp({ initialState: getInitalState() });

      await router.push(`/trips/${GET_TRIP_DATA_FIXTURE.trip.id}`);

      await waitFor(() => {
        expect(screen.getByText(GET_TRIP_DATA_FIXTURE.trip.name));
      });

      // Click expense to open ViewExpenseModal
      fireEvent.click(screen.getByTestId(`expense-${EURO_MOCK_EXPENSE_ONE.id}`));

      // Click Edit in ViewExpenseModal
      await waitFor(() => screen.getByRole("button", { name: /Edit/i }));
      fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

      // Edit modal open
      await waitFor(() => screen.getByText("Edit Expense"));

      // Verify existing data was prefilled
      expect(screen.getByTestId<HTMLInputElement>("expense-date").value).toEqual(
        format(new Date(EURO_MOCK_EXPENSE_ONE.localDateTime), "yyyy-MM-dd"),
      );
      expect(screen.getByTestId<HTMLInputElement>("expense-time").value).toEqual(
        format(new Date(EURO_MOCK_EXPENSE_ONE.localDateTime), "HH:mm"),
      );
      const countryButton = screen.getByRole("button", { name: EURO_MOCK_EXPENSE_ONE.country.name });
      expect(countryButton.classList.contains("et-expense-form__location-chip--selected")).toEqual(true);

      const cityButton = screen.getByRole("button", { name: EURO_MOCK_EXPENSE_ONE.city.name });
      expect(cityButton.classList.contains("et-expense-form__location-chip--selected")).toEqual(true);

      screen.getByText(EURO_MOCK_EXPENSE_ONE.currency.code);
      screen.getByText(EURO_MOCK_EXPENSE_ONE.amount);

      const categoryButton = screen.getByRole("button", { name: EURO_MOCK_EXPENSE_ONE.category.name });
      expect(categoryButton.classList.contains("et-expense-form__category-chip--selected")).toEqual(true);

      screen.getByText(EURO_MOCK_EXPENSE_ONE.users[0].firstName);
      screen.getByText(EURO_MOCK_EXPENSE_ONE.description);

      // Change country
      await fireEvent.click(screen.getByRole("button", { name: "United Arab Emirates" }));

      await waitFor(() => screen.getByRole("button", { name: "Dubai" }));
      await fireEvent.click(screen.getByRole("button", { name: "Dubai" }));

      // Change currency
      fireEvent.click(screen.getByRole("button", { name: "EUR" }));

      await waitFor(() => screen.getByRole("button", { name: "AED - United Arab Emirates dirham" }));
      await fireEvent.click(screen.getByRole("button", { name: "AED - United Arab Emirates dirham" }));

      // Enter amount
      await fireEvent.update(screen.getByPlaceholderText("0.00"), "40.00");

      // Select category (Snacks/Drinks)
      await fireEvent.click(screen.getByRole("button", { name: "Snacks/Drinks" }));
      // Add a note
      await fireEvent.update(screen.getByPlaceholderText("Add a note..."), "edited expense");

      await waitFor(() => {
        expect(screen.getByRole("button", { name: /Save Changes/i })).not.toBeDisabled();
      });

      fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

      await waitFor(() => {
        expect(updateExpense).toHaveBeenCalledWith(EURO_MOCK_EXPENSE_ONE.id, {
          localDateTime: expecteUpdatedExpense.localDateTime,
          countryId: UAE_FOR_TRIP.id,
          cityId: DUBAI.id,
          amount: 40,
          currencyId: AED.id,
          categoryId: SNACKS_DRINKS.id,
          description: "edited expense",
          userIds: [USER_ONE.id],
        });
      });

      const expenseEl = await waitFor(() => screen.getByTestId(`expense-${expecteUpdatedExpense.id}`));

      within(expenseEl).findByText(expecteUpdatedExpense.description);
      within(expenseEl).findByText(expecteUpdatedExpense.euroAmount);
      within(expenseEl).findByText(expecteUpdatedExpense.category.name);
      within(expenseEl).findByText(expecteUpdatedExpense.country.name);
    });

    it("should allow deleting an expense", async () => {
      vi.mocked(deleteExpense).mockResolvedValue({} as any);

      const { router } = await renderApp({ initialState: getInitalState() });

      await router.push(`/trips/${GET_TRIP_DATA_FIXTURE.trip.id}`);

      await waitFor(() => {
        expect(screen.getByText(GET_TRIP_DATA_FIXTURE.trip.name));
      });

      // Click expense to open ViewExpenseModal
      fireEvent.click(screen.getByTestId(`expense-${EURO_MOCK_EXPENSE_ONE.id}`));

      // Click Edit in ViewExpenseModal
      await waitFor(() => screen.getByRole("button", { name: /Delete/i }));
      fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

      await waitFor(() => screen.getByTestId("confirm-modal"));
      fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

      await waitFor(() => {
        expect(deleteExpense).toHaveBeenCalledWith(EURO_MOCK_EXPENSE_ONE.id);
      });

      await waitFor(() => expect(screen.queryByTestId(`expense-${EURO_MOCK_EXPENSE_ONE.id}`)).toBeNull());
    });
  });
});
