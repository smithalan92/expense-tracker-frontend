import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectShouldShowAddExpenseModal,
  setShouldShowAddExpenseModal,
} from "@/store/slices/expenses";

export default function AddExpenseModal() {
  const dispatch = useAppDispatch();
  const shouldShowAddExpenseModal = useAppSelector(
    selectShouldShowAddExpenseModal
  );

  const onChangeVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(onchange);
    dispatch(setShouldShowAddExpenseModal(e.target.value === "true"));
  };

  return (
    <>
      <input
        type="checkbox"
        id="add-expense-modal"
        className="modal-toggle"
        checked={shouldShowAddExpenseModal}
        onChange={onChangeVisibility}
      />
      <label
        className="modal modal-bottom sm:modal-middle cursor-pointer px-4"
        htmlFor="add-expense-modal"
      >
        <label className="modal-box">
          <h2 className="font-bold text-lg">Add Expense</h2>
          <p className="py-4">
            You've been selected for a chance to get one year of subscription to
            use Wikipedia for free!
          </p>
          <div className="modal-action">Yay!</div>
        </label>
      </label>
    </>
  );
}
