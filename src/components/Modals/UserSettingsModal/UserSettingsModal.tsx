import { ReactComponent as CloseIcon } from "@/assets/close.svg";
import CustomSelect from "@/components/widgets/CustomSelect/CustomSelect";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setExpenseViewType,
  toggleNativeMobileSelectsDisabled,
} from "@/store/slices/userSettings";
import { ExpenseViewType } from "@/store/slices/userSettings.types";
import { useCallback, useMemo } from "react";

interface ExpenseViewPickerOption {
  label: string;
  value: ExpenseViewType;
}

export default function UserSettingsModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const isNativeSelectsOnMobileDisabled = useAppSelector(
    (state) => state.userSettings.disableNativeSelectsOnMobile
  );
  const expenseListDisplayType = useAppSelector(
    (state) => state.userSettings.expenseView
  );

  const toggleNativeMobileSelects = useCallback(() => {
    dispatch(toggleNativeMobileSelectsDisabled());
  }, [dispatch]);

  const expenseDisplayViewOptions = useMemo<ExpenseViewPickerOption[]>(() => {
    return [
      { label: "Table", value: "table" },
      { label: "Card", value: "card" },
    ];
  }, []);

  const selectedOption = useMemo(() => {
    return expenseDisplayViewOptions.find(
      (i) => i.value === expenseListDisplayType
    );
  }, [expenseDisplayViewOptions, expenseListDisplayType]);

  const onSelectExpenseDisplayView = useCallback(
    (item: ExpenseViewPickerOption | null) => {
      dispatch(setExpenseViewType(item!.value));
    },
    [dispatch]
  );

  return (
    <div className="et-modal-backdrop overflow-hidden">
      <div className="animate-slide-in-bottom et-modal overflow-hidden absolute bottom-0 md:relative box-content w-[350px] md:w-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-2xl">Add a Country</h2>
          <div
            className="hover:bg-gray-200 p-2 rounded-full cursor-pointer"
            onClick={onClose}
          >
            <CloseIcon className="w-[12px]" />
          </div>
        </div>
        <div className="min-h-[500px] overflow-hidden pr-4">
          <div className="flex flex-col py-4">
            <div className="flex mt-4 mb-4 justify-between items-center">
              <span>Use native mobile pickers</span>
              <input
                id="useNativeSelectsOnMobile"
                name="useNativeSelectsOnMobile"
                type="checkbox"
                className="toggle toggle-primary"
                checked={!isNativeSelectsOnMobileDisabled}
                onChange={toggleNativeMobileSelects}
              />
            </div>
            <div className="flex mt-2 items-center justify-between">
              <span className="mr-8">Expense List display</span>
              <CustomSelect
                className="cursor-pointer w-32"
                options={expenseDisplayViewOptions as any}
                onChange={onSelectExpenseDisplayView}
                value={selectedOption}
                menuPortalTarget={document.body}
                isMulti={false}
                isSearchable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
