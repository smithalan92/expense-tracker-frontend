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
      <div className="absolute left-1/3 lg:left-auto">
        <Link to={PATHS.HOME} className="btn btn-ghost normal-case text-xl">
          <Logo className="w-32" />
        </Link>
      </div>
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a onClick={onClickLogout}>Logout</a>
            </li>
            {/* <li tabIndex={0}>
              <a className="justify-between">
                Parent
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
              </a>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <a onClick={onClickLogout}>Logout</a>
          </li>
          {/* <li tabIndex={0}>
            <a>
              Parent
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2">
              <li>
                <a>Submenu 1</a>
              </li>
              <li>
                <a>Submenu 2</a>
              </li>
            </ul>
          </li> */}
        </ul>
      </div>
      <div className="navbar-end">
        <div className="text-md font-bold px-4 mx-2 rounded-full bg-base-content text-base-100 w-8 h-8 flex items-center justify-center">
          {user!.firstName.substring(0, 1).toUpperCase()}
        </div>
      </div>
    </div>
  );
}
