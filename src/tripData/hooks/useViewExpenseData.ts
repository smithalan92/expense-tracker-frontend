import type { TripExpense } from "@/api";
import { computed, type Ref } from "vue";

export default function useViewExpenseData(expense: Ref<TripExpense, TripExpense>) {
  return computed<DataField[]>(() => {
    return [
      {
        label: "Cost",
        value: `€${expense.value.euroAmount} / ${expense.value.amount} ${expense.value.currency.code}`,
        icon: ["fas", "tag"],
      },
      {
        label: "Category",
        value: expense.value.category.name,
        icon: ["fas", "layer-group"],
      },
      {
        label: "Location",
        value: `${expense.value.city.name}, ${expense.value.country.name}`,
        icon: ["fas", "location-dot"],
      },
      {
        label: "User",
        value: `${expense.value.user.firstName} ${expense.value.user.lastName}`,
        icon: ["fas", "user"],
      },
      {
        label: "Description",
        value: expense.value.description || "No description provided",
        icon: ["far", "clipboard"],
      },
    ];
  });
}

interface DataField {
  label: string;
  value: string | number;
  icon: string[];
}
