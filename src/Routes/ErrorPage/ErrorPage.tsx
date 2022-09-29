import { useRouteError } from "react-router-dom";
import { RouterError } from "./ErrorPage.types";

export default function ErrorPage() {
  const error = useRouteError() as RouterError;
  console.error(error);

  // TODO - Design properly
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
