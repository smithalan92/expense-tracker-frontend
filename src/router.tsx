import { createBrowserRouter } from "react-router-dom";
import AppContainer from "@/sections/AppContainer/AppContainer";
import ErrorPage from "@/Routes/ErrorPage/ErrorPage";
import ExpenseList from "@/Routes/ExpenseList/ExpenseList";

export default createBrowserRouter([
  {
    path: "/",
    element: <AppContainer />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/expenses",
        element: <ExpenseList />,
      },
    ],
  },
]);
