import { ReactComponent as Logo } from "@/assets/logo.svg";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  login,
  selectIsLoggingIn,
  selectHasLoggingInFailed,
  selectIsLoggedIn,
} from "@/store/slices/app";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/router";

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isLoggingIn = useAppSelector(selectIsLoggingIn);
  const hasFailedToLogin = useAppSelector(selectHasLoggingInFailed);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onClickLogin = () => {
    dispatch(login({ email, password }));
  };

  const canLogin = useMemo(() => {
    return (
      !isLoggingIn && email.trim().length > 0 && password.trim().length > 0
    );
  }, [email, password, isLoggingIn]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate(PATHS.TRIPS);
    }
  }, [isLoggedIn]);

  const onEnterPress = useCallback(
    (e: KeyboardEvent) => {
      if (!canLogin) return;
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        onClickLogin();
      }
    },
    [canLogin, email, password]
  );

  useEffect(() => {
    document.addEventListener("keydown", onEnterPress);

    return () => {
      document.removeEventListener("keydown", onEnterPress);
    };
  }, [onEnterPress]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-12">
      <Logo className="w-[300px]" />
      <div className="mt-12 flex flex-col">
        {hasFailedToLogin && (
          <div className="alert alert-error shadow-lg mb-6 animate__animated animate__bounceIn">
            <span>Invalid username or password</span>
          </div>
        )}
        <input
          type="text"
          placeholder="Email"
          className="input input-bordered rounded-md input-primary w-72 max-w-lg"
          autoFocus={true}
          value={email}
          onChange={onChangeEmail}
        />
        <input
          type="password"
          placeholder="Password"
          className="mt-4 input input-bordered rounded-md input-primary w-72 max-w-lg"
          value={password}
          onChange={onChangePassword}
        />
        <div className="mt-8 flex w-full">
          <button
            className="btn btn-primary rounded-lg w-full"
            disabled={!canLogin}
            onClick={onClickLogin}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
