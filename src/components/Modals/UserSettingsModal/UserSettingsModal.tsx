import Modal from "@/components/Modals/ModalBase/Modal";
import ModalBody from "@/components/Modals/ModalBase/ModalBody";
import ModalHeader from "@/components/Modals/ModalBase/ModalHeader";
import CustomSelect from "@/components/widgets/CustomSelect/CustomSelect";
import { useAppDispatch, useAppSelector } from "@/store";
import type { ExpenseViewType } from "@/store/slices/userSettings";
import {
  setExpenseViewType,
  toggleNativeMobileSelectsDisabled,
  toggleUseMultiUserPickerForExpenses,
} from "@/store/slices/userSettings";
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

  const useMultiUserPickerForExpenses = useAppSelector(
    (state) => state.userSettings.useMultiUserPickerForExpenses
  );

  const toggleNativeMobileSelects = useCallback(() => {
    dispatch(toggleNativeMobileSelectsDisabled());
  }, [dispatch]);

  const toggleShouldUseMultiUserPickerForExpenses = useCallback(() => {
    dispatch(toggleUseMultiUserPickerForExpenses());
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
    <Modal>
      <ModalHeader
        title="Settings"
        includeCloseButton={true}
        onClickClose={onClose}
      />
      <ModalBody>
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
          <div className="flex mt-4 mb-4 justify-between items-center">
            <span>Use multi user picker for add expense</span>
            <input
              id="useMultiUserPickerForExpenses"
              name="useMultiUserPickerForExpenses"
              type="checkbox"
              className="toggle toggle-primary"
              checked={useMultiUserPickerForExpenses}
              onChange={toggleShouldUseMultiUserPickerForExpenses}
            />
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
