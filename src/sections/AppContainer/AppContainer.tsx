import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PATHS } from "@/router";
import { useAppDispatch, useAppSelector } from "@/store";
import { loadCurrencies, selectIsLoggedIn } from "@/store/slices/app";
import Header from "@/components/Header/Header";

export default function AppContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoggedIn && location.pathname === PATHS.LOGIN) {
      navigate(PATHS.TRIPS);
    } else if (location.pathname === PATHS.HOME) {
      navigate(PATHS.TRIPS);
    }
  }, [location]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(loadCurrencies());
    }
  }, [dispatch, isLoggedIn]);

  return (
    <div className="w-full max-w-3xl min-w-[390px] flex flex-col h-full overflow-hidden">
      {isLoggedIn && <Header />}
      <div className="px-4 py-8 w-full h-full">
        <div className="pb-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
