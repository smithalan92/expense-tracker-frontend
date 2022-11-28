import { useAppDispatch, useAppSelector } from "@/store";
import { logout, selectUser } from "@/store/slices/app";
import React, { useEffect, useRef, useState } from "react";

export default function Dropdown() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onClickLogout = () => {
    dispatch(logout());
  };

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownVisible(false);
      }
    };
    // Bind the event listener
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative">
      <button
        className="focus:ring-4 text-md font-bold px-4 mx-2 rounded-full bg-base-content text-base-100 w-8 h-8 flex items-center justify-center"
        onClick={() => setIsDropdownVisible(!isDropdownVisible)}
      >
        {user!.firstName.substring(0, 1).toUpperCase()}
      </button>
      {isDropdownVisible && (
        <div
          className="absolute top-[40px] right-0 z-10 w-44 bg-white rounded divide-y shadow bg-gray-700 divide-gray-600"
          ref={dropdownRef}
        >
          <div className="py-3 px-4 text-sm text-white border-b border-solid border-gray-500">
            <div>Hey {user!.firstName}!</div>
          </div>
          <ul className="py-1 text-sm text-gray-200">
            <li>
              <span
                onClick={onClickLogout}
                className="cursor-pointer block py-2 px-4 hover:bg-gray-600"
              >
                Logout
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
