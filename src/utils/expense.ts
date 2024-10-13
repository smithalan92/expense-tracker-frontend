import type {
  AddExpenseParams,
  ParsedTripExpense,
  TripDataState,
} from "@/store/slices/tripData";

export function getTempExpense(
  tripDataState: TripDataState,
  params: AddExpenseParams
) {
  const currency = tripDataState.currencies.find(
    (c) => c.id == params.currencyId
  )!;
  const category = tripDataState.categories.find(
    (c) => c.id == params.categoryId
  )!;
  const city = tripDataState.cities.find((c) => c.id === params.cityId)!;

  const country = tripDataState.countries.find((c) => c.id === city.countryId)!;

  const expense: ParsedTripExpense = {
    id: Math.random() * -1,
    amount: `${params.amount}`,
    currency,
    euroAmount: `${params.amount} ${currency.code}`,
    localDateTime: params.date,
    description: params.description,
    category,
    city: {
      ...city,
      timezone: "",
    },
    country,
    user: {
      id: 0,
      firstName: "",
      lastName: "",
    },
    createdAt: "",
    updatedAt: "",
    isSaved: false,
  };

  return expense;
}
