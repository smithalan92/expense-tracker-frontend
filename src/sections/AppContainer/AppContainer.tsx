import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "@/router";
import { useAppSelector } from "@/store";
import { selectIsLoggedIn } from "@/store/slices/app";
import Header from "@/components/Header/Header";

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
    <div className="w-full flex flex-col h-full overflow-hidden items-center">
      {isLoggedIn && <Header />}
      <div className="px-4 w-full max-w-3xl min-w-[390px] flex flex-col h-full overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
