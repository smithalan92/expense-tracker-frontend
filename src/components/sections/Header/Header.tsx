import { ReactComponent as Logo } from "@/assets/logo.svg";
import { PATHS } from "@/router";
import { Link } from "react-router-dom";
import Dropdown from "./DropdownMenu";

export default function Header({
  onClickSettings,
}: {
  onClickSettings: () => void;
}) {
  return (
    <div className="navbar bg-base-100 pb-4 min-h-20">
      <div className="navbar-start">
        <Link to={PATHS.HOME} className="p-2">
          <Logo className="w-32" />
        </Link>
      </div>
      <div className="navbar-end">
        <Dropdown onClickSettings={onClickSettings} />
      </div>
    </div>
  );
}
