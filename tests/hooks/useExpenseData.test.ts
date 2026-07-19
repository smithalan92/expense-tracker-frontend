import useExpenseData from "@/components/trip/modals/AddOrEditExpense/hooks/useExpenseData";
import { format } from "date-fns";
import { describe, expect, it } from "vitest";
import { AED_MOCK_EXPENSE_ONE, EURO_MOCK_EXPENSE_ONE } from "../fixtures/expenses";
import { USER_ONE, USER_TWO } from "../fixtures/users";

const DATE_FORMAT = "yyyy-MM-dd HH:mm";

describe("useExpenseData", () => {
  describe("initial expenseData", () => {
    it("defaults to an empty expense for the given currency when no expense is provided", () => {
      const { expenseData } = useExpenseData(null, 5, false);

      expect(expenseData.selectedCity).toBeNull();
      expect(expenseData.selectedCurrency).toBe(5);
      expect(expenseData.selectedCategory).toBeNull();
      expect(expenseData.selectedUsers).toEqual([]);
      expect(expenseData.description).toBe("");
      expect(expenseData.amount).toBeNull();
      expect(expenseData.expenseDate).toBe(format(new Date(), DATE_FORMAT));
    });

    it("populates fields from an existing expense", () => {
      const { expenseData } = useExpenseData(EURO_MOCK_EXPENSE_ONE, 99, false);

      expect(expenseData.expenseDate).toBe(
        format(new Date(EURO_MOCK_EXPENSE_ONE.localDateTime), DATE_FORMAT),
      );
      expect(expenseData.selectedCity).toBe(EURO_MOCK_EXPENSE_ONE.city.id);
      expect(expenseData.selectedCurrency).toBe(EURO_MOCK_EXPENSE_ONE.currency.id);
      expect(expenseData.selectedCategory).toBe(EURO_MOCK_EXPENSE_ONE.category.id);
      expect(expenseData.selectedUsers).toEqual([USER_ONE.id]);
      expect(expenseData.description).toBe(EURO_MOCK_EXPENSE_ONE.description);
      expect(expenseData.amount).toBe(EURO_MOCK_EXPENSE_ONE.amount);
    });

    it("prefixes the description with [CP] when copying an expense", () => {
      const { expenseData } = useExpenseData(EURO_MOCK_EXPENSE_ONE, 99, true);

      expect(expenseData.description).toBe(`[CP] ${EURO_MOCK_EXPENSE_ONE.description}`);
    });

    it("does not prefix the description when there is no expense to copy from", () => {
      const { expenseData } = useExpenseData(null, 5, true);

      expect(expenseData.description).toBe("[CP] ");
    });
  });

  describe("hasOriginalDataChanged / isDataValid - new expense", () => {
    it("is always considered changed for a brand new expense", () => {
      const { isDataValid, expenseData } = useExpenseData(null, 1, false);

      expenseData.selectedCity = 1;
      expenseData.selectedCategory = 1;
      expenseData.selectedUsers = [USER_ONE.id];
      expenseData.description = "Coffee";
      expenseData.amount = "5.50";

      expect(isDataValid.value).toBe(true);
    });

    it("is false when the amount is zero or negative", () => {
      const { isDataValid, expenseData } = useExpenseData(null, 1, false);

      expenseData.selectedCity = 1;
      expenseData.selectedCategory = 1;
      expenseData.selectedUsers = [USER_ONE.id];
      expenseData.description = "Coffee";
      expenseData.amount = "0";

      expect(isDataValid.value).toBe(false);
    });

    it("is false when the amount is not a number", () => {
      const { isDataValid, expenseData } = useExpenseData(null, 1, false);

      expenseData.selectedCity = 1;
      expenseData.selectedCategory = 1;
      expenseData.selectedUsers = [USER_ONE.id];
      expenseData.description = "Coffee";
      expenseData.amount = "abc";

      expect(isDataValid.value).toBe(false);
    });

    it("is false when the description is blank", () => {
      const { isDataValid, expenseData } = useExpenseData(null, 1, false);

      expenseData.selectedCity = 1;
      expenseData.selectedCategory = 1;
      expenseData.selectedUsers = [USER_ONE.id];
      expenseData.description = "   ";
      expenseData.amount = "5.50";

      expect(isDataValid.value).toBe(false);
    });

    it("is false when no users are selected", () => {
      const { isDataValid, expenseData } = useExpenseData(null, 1, false);

      expenseData.selectedCity = 1;
      expenseData.selectedCategory = 1;
      expenseData.description = "Coffee";
      expenseData.amount = "5.50";

      expect(isDataValid.value).toBe(false);
    });

    it("is false when the city is not selected", () => {
      const { isDataValid, expenseData } = useExpenseData(null, 1, false);

      expenseData.selectedCategory = 1;
      expenseData.selectedUsers = [USER_ONE.id];
      expenseData.description = "Coffee";
      expenseData.amount = "5.50";

      expect(isDataValid.value).toBe(false);
    });

    it("is false when the category is not selected", () => {
      const { isDataValid, expenseData } = useExpenseData(null, 1, false);

      expenseData.selectedCity = 1;
      expenseData.selectedUsers = [USER_ONE.id];
      expenseData.description = "Coffee";
      expenseData.amount = "5.50";

      expect(isDataValid.value).toBe(false);
    });

    it("is false when the expense date is invalid", () => {
      const { isDataValid, expenseData } = useExpenseData(null, 1, false);

      expenseData.selectedCity = 1;
      expenseData.selectedCategory = 1;
      expenseData.selectedUsers = [USER_ONE.id];
      expenseData.description = "Coffee";
      expenseData.amount = "5.50";
      expenseData.expenseDate = "not-a-date";

      expect(isDataValid.value).toBe(false);
    });
  });

  describe("hasOriginalDataChanged / isDataValid - editing an existing expense", () => {
    it("is false when nothing has changed", () => {
      const { isDataValid } = useExpenseData(EURO_MOCK_EXPENSE_ONE, 1, false);

      expect(isDataValid.value).toBe(false);
    });

    it("is true when the amount changes", () => {
      const { isDataValid, expenseData } = useExpenseData(EURO_MOCK_EXPENSE_ONE, 1, false);

      expenseData.amount = "15.00";

      expect(isDataValid.value).toBe(true);
    });

    it("treats numerically equal amounts as unchanged", () => {
      const { isDataValid, expenseData } = useExpenseData(EURO_MOCK_EXPENSE_ONE, 1, false);

      expenseData.amount = "10.0";

      expect(isDataValid.value).toBe(false);
    });

    it("is true when the description changes", () => {
      const { isDataValid, expenseData } = useExpenseData(EURO_MOCK_EXPENSE_ONE, 1, false);

      expenseData.description = "Updated description";

      expect(isDataValid.value).toBe(true);
    });

    it("is true when the selected city changes", () => {
      const { isDataValid, expenseData } = useExpenseData(EURO_MOCK_EXPENSE_ONE, 1, false);

      expenseData.selectedCity = 999;

      expect(isDataValid.value).toBe(true);
    });

    it("is true when the selected users change", () => {
      const { isDataValid, expenseData } = useExpenseData(AED_MOCK_EXPENSE_ONE, 1, false);

      expenseData.selectedUsers = [USER_TWO.id];

      expect(isDataValid.value).toBe(true);
    });

    it("treats reordered users as unchanged", () => {
      const { isDataValid, expenseData } = useExpenseData(AED_MOCK_EXPENSE_ONE, 1, false);

      expenseData.selectedUsers = [...AED_MOCK_EXPENSE_ONE.users.map((u) => u.id)].reverse();

      expect(isDataValid.value).toBe(false);
    });

    it("is false when changed but no longer valid (e.g. users cleared)", () => {
      const { isDataValid, expenseData } = useExpenseData(EURO_MOCK_EXPENSE_ONE, 1, false);

      expenseData.selectedUsers = [];

      expect(isDataValid.value).toBe(false);
    });
  });
});
