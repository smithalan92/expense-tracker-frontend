import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "@/router";
import { useAppSelector } from "@/store";
import { selectIsLoggedIn } from "@/store/slices/app";

export default function AppContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  useEffect(() => {
    if (isLoggedIn && location.pathname === PATHS.LOGIN) {
      navigate(PATHS.EXPENSES);
    } else if (location.pathname === PATHS.HOME) {
      navigate(PATHS.EXPENSES);
    }
  }, [location]);

  return (
    <div className="w-full max-w-3xl min-w-[390px] flex flex-col h-full">
      <Outlet />
    </div>
  );
}
