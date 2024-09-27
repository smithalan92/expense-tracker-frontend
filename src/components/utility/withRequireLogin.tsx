import { PATHS } from "@/router";
import { useAppSelector } from "@/store";
import { selectIsLoggedIn } from "@/store/slices/app";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function withRequireLogin<T extends React.PropsWithChildren>(
  WrappedComponent: React.ComponentType<T>
) {
  return (props: T) => {
    const navigate = useNavigate();
    const isLoggedIn = useAppSelector(selectIsLoggedIn);

    useEffect(() => {
      if (!isLoggedIn) navigate(PATHS.LOGIN);
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
