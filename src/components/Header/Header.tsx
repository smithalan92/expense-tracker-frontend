import { useAppDispatch, useAppSelector } from "@/store";
import { logout, selectUser } from "@/store/slices/app";
import { ReactComponent as Logo } from "@/assets/logo.svg";
import { Link } from "react-router-dom";
import { PATHS } from "@/router";

export default function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const onClickLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="navbar bg-base-100 pb-4 min-h-20">
      <div className="navbar-start">
        <Link to={PATHS.HOME} className="btn btn-ghost normal-case text-xl">
          <Logo className="w-32" />
        </Link>
      </div>
      <div className="navbar-end">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost">
            <div className="text-md font-bold px-4 mx-2 rounded-full bg-base-content text-base-100 w-8 h-8 flex items-center justify-center">
              {user!.firstName.substring(0, 1).toUpperCase()}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-22"
          >
            <li>
              <a onClick={onClickLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
