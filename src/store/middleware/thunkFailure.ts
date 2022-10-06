import { Middleware } from "redux";

const thunkFailureMiddlewareHandler: Middleware = () => (next) => (action) => {
  const { error } = action;
  if (error) {
    console.error(error);
  }

  return next(action);
};

export default thunkFailureMiddlewareHandler;
