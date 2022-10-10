import { createBrowserRouter, useNavigate } from "react-router-dom";
import AppContainer from "@/sections/AppContainer/AppContainer";
import ErrorPage from "@/Routes/ErrorPage/ErrorPage";
import Login from "@/Routes/Login/Login";
import ExpenseList from "@/Routes/ExpenseList/ExpenseList";
import { useAppSelector } from "./store";
import { selectIsLoggedIn } from "./store/slices/app";
import { useEffect } from "react";
import TripList from "@/Routes/TripList/TripList";

export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  TRIPS: "/trips",
  EXPENSES: "/expenses",
};

function PrivateRoute({ children }: { children: JSX.Element | JSX.Element[] }) {
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) navigate(PATHS.LOGIN);
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}

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
        path: PATHS.TRIPS,
        element: (
          <PrivateRoute>
            <TripList />
          </PrivateRoute>
        ),
      },
      {
        path: PATHS.EXPENSES,
        element: (
          <PrivateRoute>
            <ExpenseList />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
