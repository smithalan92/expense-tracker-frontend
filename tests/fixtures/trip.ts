import type { Trip } from "@/api/trip";
import { addDays, format } from "date-fns";
import { IRELAND_FOR_TRIP } from "./countries_cities";
import { USER_ONE } from "./users";

export const TESTING_TRIP: Trip = {
  id: 1,
  name: "Testing Trip",
  startDate: format(new Date(), "dd MMM yyyy"),
  endDate: format(addDays(new Date(), 7), "dd MMM yyyy"),
  image: "https://test.img/img.jpg",
  totalExpenseAmount: 10,
  countries: [
    {
      id: IRELAND_FOR_TRIP.id,
      code: IRELAND_FOR_TRIP.code,
      name: IRELAND_FOR_TRIP.name,
    },
  ],
  users: [{ id: USER_ONE.id, name: `${USER_ONE.firstName} ${USER_ONE.lastName}` }],
  expenseCount: 0,
};

export const FAKE_TRIP: Trip = {
  id: 2,
  name: "Fake Trip",
  startDate: format(new Date(), "dd MMM yyyy"),
  endDate: format(addDays(new Date(), 7), "dd MMM yyyy"),
  image: "https://test.img/img.jpg",
  totalExpenseAmount: 20,
  countries: [
    {
      id: IRELAND_FOR_TRIP.id,
      code: IRELAND_FOR_TRIP.code,
      name: IRELAND_FOR_TRIP.name,
    },
  ],
  users: [{ id: USER_ONE.id, name: `${USER_ONE.firstName} ${USER_ONE.lastName}` }],
  expenseCount: 0,
};
