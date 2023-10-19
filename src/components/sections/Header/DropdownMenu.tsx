import { useAppDispatch, useAppSelector } from "@/store";
import { logout, selectUser } from "@/store/slices/app";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Dropdown({
  onClickSettings,
}: {
  onClickSettings: () => void;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const onClickLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const onClickSettingsItem = useCallback(() => {
    setIsDropdownVisible(false);
    onClickSettings();
  }, [onClickSettings]);

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
        className="focus:ring-4 text-md font-bold px-4 mx-2 rounded-full bg-expensr-blue text-white w-10 h-10 flex items-center justify-center"
        onClick={() => setIsDropdownVisible(!isDropdownVisible)}
      >
        {user!.firstName.substring(0, 1).toUpperCase()}
      </button>
      {isDropdownVisible && (
        <div
          className="absolute top-[48px] right-0 z-10 w-44 rounded divide-y shadow bg-base-300 divide-base-200"
          ref={dropdownRef}
        >
          <div className="py-3 px-4 text-sm border-b border-solid border-base-100">
            <div>Hey {user!.firstName}!</div>
          </div>
          <ul className="py-1 text-sm base-content">
            <li>
              <span
                onClick={onClickSettingsItem}
                className="cursor-pointer block py-2 px-4 hover:bg-base-200"
              >
                Settings
              </span>
            </li>
            <li>
              <span
                onClick={onClickLogout}
                className="cursor-pointer block py-2 px-4 hover:bg-base-200"
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
