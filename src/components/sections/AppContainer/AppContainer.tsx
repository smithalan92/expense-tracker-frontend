import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "@/router";
import { useAppSelector } from "@/store";
import { selectIsLoggedIn } from "@/store/slices/app";
import Header from "@/components/sections/Header/Header";
import { ToastContainer } from "react-toastify";
import PWAPrompt from "./PWAPrompt";

export default function AppContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  useEffect(() => {
    if (isLoggedIn && location.pathname === PATHS.LOGIN) {
      navigate(PATHS.TRIPS);
    } else if (location.pathname === PATHS.HOME) {
      navigate(PATHS.TRIPS);
    }
  }, [location]);

  return (
    <div className="w-full flex flex-col h-full overflow-hidden items-center max-w-[800px] bg-base-100">
      {isLoggedIn && <Header />}
      <div className="px-4 w-full max-w-3xl min-w-[390px] flex flex-col h-full overflow-hidden">
        <Outlet />
      </div>
      <ToastContainer
        autoClose={4000}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        position="top-center"
        theme="light"
        toastClassName="drop-shadow-md my-4 mx-2 bg-base-100 text-center rounded text-black"
        progressStyle={{ background: "#0284c7" }}
        limit={3}
      />
      <PWAPrompt />
    </div>
  );
}
