import App from "@/app/App.vue";
import { createAppRouter } from "@/app/router";
import { createTestingPinia } from "@pinia/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

// --- API mocks only ---
vi.mock("@/api/expense", () => ({
  addExpensesToTrip: vi.fn(),
  updateExpense: vi.fn(),
  deleteExpense: vi.fn(),
}));

vi.mock("@/api/trip", () => ({
  getTripData: vi.fn(),
  deleteTrip: vi.fn(),
  updateTrip: vi.fn(),
}));

vi.mock("@vueuse/core", () => ({
  useOnline: () => ({ value: true }),
  onClickOutside: vi.fn(),
}));

// Stub components not under test
vi.mock("@/trips/AddOrEditTripModal.vue", () => ({ default: { template: "<div />" } }));
vi.mock("@/modal/StatsModal.vue", () => ({ default: { template: "<div />" } }));
vi.mock("@/modal/ConfirmModal.vue", () => ({
  default: {
    emits: ["confirm", "close"],
    template: `<div data-testid="confirm-modal"><button @click="$emit('confirm')">Confirm</button></div>`,
  },
}));
vi.mock("@/pickers/DatePicker.vue", () => ({
  default: {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: `<input :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" />`,
  },
}));
vi.mock("@/pickers/TimePicker.vue", () => ({
  default: {
    props: ["modelValue"],
    emits: ["update:modelValue"],
    template: `<input :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" />`,
  },
}));
vi.mock("@/tripData/ExpenseCategoryIcon.vue", () => ({ default: { template: "<span />" } }));
vi.mock("@/utils/Tooltip.vue", () => ({
  default: {
    props: ["message", "disabled", "forceOpenOnMobile", "placement"],
    template: "<span><slot /></span>",
  },
}));
vi.mock("@fortawesome/vue-fontawesome", () => ({
  FontAwesomeIcon: { template: "<span />" },
}));

import { addExpensesToTrip, deleteExpense, updateExpense } from "@/api/expense";
import { getTripData } from "@/api/trip";
import { mockExpense, mockTrip, mockTripDataState } from "./fixtures";

const TRIP_ID = mockTrip.id;

const tripDataResponse = {
  trip: mockTrip,
  expenses: [mockExpense],
  countries: mockTripDataState.countries,
  currencyIds: [1],
  categories: [{ id: 2, name: "Food" }],
  userIds: [1],
};

async function renderTripDataView() {
  const router = createAppRouter();

  render(App, {
    global: {
      plugins: [
        router,
        createTestingPinia({
          stubActions: false,
          initialState: {
            app: {
              authToken: "test-token",
              user: { id: 1, firstName: "Alan", lastName: "Smith" },
              users: [{ id: 1, firstName: "Alan", lastName: "Smith" }],
              currencies: [{ id: 1, code: "EUR", name: "Euro" }],
              // Needed by useSyncCurrencyWithSelectedCountry to auto-select currency on country pick
              countries: [{ id: 4, name: "Japan", currency: { id: 1, code: "EUR", name: "Euro" } }],
            },
          },
        }),
      ],
      stubs: { "fa-icon": true },
    },
  });

  await router.push(`/trips/${TRIP_ID}`);
  return { router };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Expense — add", () => {
  it("opens the Add Expense modal when the Expense button is clicked", async () => {
    vi.mocked(getTripData).mockResolvedValue(tripDataResponse);

    await renderTripDataView();

    await waitFor(() => screen.getByText(mockTrip.name));

    fireEvent.click(screen.getByRole("button", { name: /expense/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Add Expense" })).toBeInTheDocument();
    });
  });

  it("adds an expense after filling in the form and clicking Add Expense", async () => {
    vi.mocked(getTripData).mockResolvedValue(tripDataResponse);
    vi.mocked(addExpensesToTrip).mockResolvedValue({
      data: { expenses: [{ ...mockExpense, id: 99, description: "Ramen dinner", amount: "75.00" }] },
    } as any);

    await renderTripDataView();

    await waitFor(() => screen.getByText(mockTrip.name));
    fireEvent.click(screen.getByRole("button", { name: /expense/i }));
    await waitFor(() => screen.getByRole("heading", { name: "Add Expense" }));

    // Select country (Japan)
    fireEvent.click(screen.getByRole("button", { name: "Japan" }));
    // Select city (Tokyo)
    await waitFor(() => screen.getByRole("button", { name: "Tokyo" }));
    fireEvent.click(screen.getByRole("button", { name: "Tokyo" }));
    // Select category (Food)
    fireEvent.click(screen.getByRole("button", { name: /Food/i }));
    // Enter amount
    fireEvent.update(screen.getByPlaceholderText("0.00"), "75");
    // Add a note
    fireEvent.update(screen.getByPlaceholderText("Add a note..."), "Ramen dinner");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Add Expense/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /Add Expense/i }));

    await waitFor(() => {
      expect(addExpensesToTrip).toHaveBeenCalledOnce();
    });
  });
});

describe("Expense — edit", () => {
  it("opens the Edit Expense modal with pre-filled data when edit is triggered", async () => {
    vi.mocked(getTripData).mockResolvedValue(tripDataResponse);

    await renderTripDataView();

    await waitFor(() => screen.getByText(mockTrip.name));

    // Click expense to open ViewExpenseModal
    fireEvent.click(document.querySelector(`[data-expense-id="${mockExpense.id}"]`)!);

    // Click Edit in ViewExpenseModal
    await waitFor(() => screen.getByRole("button", { name: /Edit/i }));
    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    await waitFor(() => {
      expect(screen.getByText("Edit Expense")).toBeInTheDocument();
    });

    // Amount should be pre-filled (number input shows 50, not 50.00)
    expect(screen.getByDisplayValue(String(parseFloat(mockExpense.amount)))).toBeInTheDocument();
  });

  it("saves the edited expense when Save Changes is clicked", async () => {
    vi.mocked(getTripData).mockResolvedValue(tripDataResponse);
    vi.mocked(updateExpense).mockResolvedValue({
      expense: { ...mockExpense, description: "Fancy ramen", amount: "90.00" },
    });

    await renderTripDataView();

    await waitFor(() => screen.getByText(mockTrip.name));

    // Click expense to open ViewExpenseModal
    fireEvent.click(document.querySelector(`[data-expense-id="${mockExpense.id}"]`)!);

    // Click Edit in ViewExpenseModal
    await waitFor(() => screen.getByRole("button", { name: /Edit/i }));
    fireEvent.click(screen.getByRole("button", { name: /Edit/i }));

    await waitFor(() => screen.getByText("Edit Expense"));

    fireEvent.update(screen.getByPlaceholderText("0.00"), "90");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Save Changes/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));

    await waitFor(() => {
      expect(updateExpense).toHaveBeenCalledWith(mockExpense.id, expect.objectContaining({ amount: 90 }));
    });
  });
});

describe("Expense — clone", () => {
  it("opens the Copy Expense modal with pre-filled data when copy is triggered", async () => {
    vi.mocked(getTripData).mockResolvedValue(tripDataResponse);

    await renderTripDataView();

    await waitFor(() => screen.getByText(mockTrip.name));

    // Click expense to open ViewExpenseModal
    fireEvent.click(document.querySelector(`[data-expense-id="${mockExpense.id}"]`)!);

    // Click Copy in ViewExpenseModal — this shows a confirmation first
    await waitFor(() => screen.getByRole("button", { name: /Copy/i }));
    fireEvent.click(screen.getByRole("button", { name: /Copy/i }));

    // Confirm the copy action
    await waitFor(() => screen.getByTestId("confirm-modal"));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(screen.getByText("Copy Expense")).toBeInTheDocument();
    });

    // Amount should be pre-filled
    expect(screen.getByDisplayValue(String(parseFloat(mockExpense.amount)))).toBeInTheDocument();
  });

  it("creates a copy when Create Copy is clicked", async () => {
    vi.mocked(getTripData).mockResolvedValue(tripDataResponse);
    vi.mocked(addExpensesToTrip).mockResolvedValue({
      data: { expenses: [{ ...mockExpense, id: 99 }] },
    } as any);

    await renderTripDataView();

    await waitFor(() => screen.getByText(mockTrip.name));

    // Click expense to open ViewExpenseModal
    fireEvent.click(document.querySelector(`[data-expense-id="${mockExpense.id}"]`)!);

    // Click Copy → confirm
    await waitFor(() => screen.getByRole("button", { name: /Copy/i }));
    fireEvent.click(screen.getByRole("button", { name: /Copy/i }));
    await waitFor(() => screen.getByTestId("confirm-modal"));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => screen.getByText("Copy Expense"));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Create Copy/i })).not.toBeDisabled();
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Copy/i }));

    await waitFor(() => {
      expect(addExpensesToTrip).toHaveBeenCalledOnce();
    });
  });
});

describe("Expense — delete", () => {
  it("shows confirmation modal when delete is triggered", async () => {
    vi.mocked(getTripData).mockResolvedValue(tripDataResponse);

    await renderTripDataView();

    await waitFor(() => screen.getByText(mockTrip.name));

    // Click expense to open ViewExpenseModal
    fireEvent.click(document.querySelector(`[data-expense-id="${mockExpense.id}"]`)!);

    // Click Delete in ViewExpenseModal
    await waitFor(() => screen.getByRole("button", { name: /Delete/i }));
    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    await waitFor(() => {
      expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    });
  });

  it("deletes the expense after confirming", async () => {
    vi.mocked(getTripData).mockResolvedValue(tripDataResponse);
    vi.mocked(deleteExpense).mockResolvedValue(undefined as any);

    await renderTripDataView();

    await waitFor(() => screen.getByText(mockTrip.name));

    // Click expense to open ViewExpenseModal
    fireEvent.click(document.querySelector(`[data-expense-id="${mockExpense.id}"]`)!);

    // Click Delete → confirm
    await waitFor(() => screen.getByRole("button", { name: /Delete/i }));
    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
    await waitFor(() => screen.getByTestId("confirm-modal"));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => {
      expect(deleteExpense).toHaveBeenCalledWith(mockExpense.id);
    });
  });
});
