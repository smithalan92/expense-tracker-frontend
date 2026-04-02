import type { Trip } from "@/api/trip";
import { addDays, format } from "date-fns";

export const TESTING_TRIP: Trip = {
  id: 1,
  name: "Testing Trip",
  startDate: format(new Date(), "dd MMM yyyy"),
  endDate: format(addDays(new Date(), 7), "dd MMM yyyy"),
  image: "https://test.img/img.jpg",
  totalExpenseAmount: 10,
};

export const FAKE_TRIP: Trip = {
  id: 2,
  name: "Fake Trip",
  startDate: format(new Date(), "dd MMM yyyy"),
  endDate: format(addDays(new Date(), 7), "dd MMM yyyy"),
  image: "https://test.img/img.jpg",
  totalExpenseAmount: 20,
};
