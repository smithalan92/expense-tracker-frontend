import { createBrowserRouter, useNavigate } from "react-router-dom";
import AppContainer from "@/components/sections/AppContainer/AppContainer";
import ErrorPage from "@/Routes/ErrorPage/ErrorPage";
import Login from "@/Routes/Login/Login";
import TripData from "@/Routes/TripData/TripData";
import { useAppSelector } from "./store";
import { selectIsLoggedIn } from "./store/slices/app";
import { useEffect } from "react";
import TripList from "@/Routes/TripList/TripList";

export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  TRIPS: "/trips",
  TRIP: "/trips/:tripId",
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
        path: PATHS.TRIP,
        element: (
          <PrivateRoute>
            <TripData />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
