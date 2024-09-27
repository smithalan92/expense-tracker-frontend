import AppContainer from "@/components/sections/AppContainer/AppContainer";
import ErrorPage from "@/Routes/ErrorPage/ErrorPage";
import Login from "@/Routes/Login/Login";
import TripData from "@/Routes/TripData/TripData";
import TripList from "@/Routes/TripList/TripList";
import { createBrowserRouter } from "react-router-dom";

export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  TRIPS: "/trips",
  TRIP: "/trips/:tripId",
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
        path: PATHS.TRIPS,
        element: <TripList />,
      },
      {
        path: PATHS.TRIP,
        element: <TripData />,
      },
    ],
  },
]);
