import { createBrowserRouter } from "react-router-dom";
import AppContainer from "@/sections/AppContainer/AppContainer";
import ErrorPage from "@/Routes/ErrorPage/ErrorPage";
import Login from "@/Routes/Login/Login";
import ExpenseList from "@/Routes/ExpenseList/ExpenseList";

export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  EXPENSES: "/expenses",
};

export default createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <AppContainer />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: PATHS.LOGIN,
        element: <Login />,
      },
      {
        path: PATHS.EXPENSES,
        element: <ExpenseList />,
      },
    ],
  },
]);
