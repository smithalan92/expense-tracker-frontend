import { ReactComponent as CloneIcon } from "@/assets/clone.svg";
import { ReactComponent as EditIcon } from "@/assets/edit.svg";
import { ReactComponent as LocationIcon } from "@/assets/location.svg";
import { ReactComponent as NoteIcon } from "@/assets/note.svg";
import { ReactComponent as PriceTagIcon } from "@/assets/price-tag.svg";
import { ReactComponent as TrashIcon } from "@/assets/trash.svg";
import { ReactComponent as UserIcon } from "@/assets/user.svg";
import Modal from "@/components/Modals/ModalBase/Modal";
import ModalBody from "@/components/Modals/ModalBase/ModalBody";
import ModalFooter from "@/components/Modals/ModalBase/ModalFooter";
import ModalHeader from "@/components/Modals/ModalBase/ModalHeader";
import ExpenseCategoryIcon from "@/components/sections/ExpenseList/ExpenseListCards/ExpenseCategoryIcon";
import { useAppDispatch, useAppSelector } from "@/store";
import { copyExpense, selectExpenseById } from "@/store/slices/tripData";
import format from "date-fns/format";
import { useCallback, useMemo, useState } from "react";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";

interface DataField {
  label: string;
  value: string | number | React.ReactNode;
  icon: {
    Component: any;
    props?: Record<string, any>;
    additionalStyles?: string;
  };
}

interface ViewExpenseModalProps {
  expenseId: number;
  onClose: () => void;
  onClickEditExpense: () => void;
  onConfirmDeleteExpense: () => void;
}

export default function ViewExpenseModal({
  expenseId,
  onClose,
  onClickEditExpense,
  onConfirmDeleteExpense,
}: ViewExpenseModalProps) {
  const dispatch = useAppDispatch();
  const expense = useAppSelector((state) =>
    selectExpenseById(state, expenseId)
  )!;

  const expenseDate = useMemo(() => {
    return format(new Date(expense.localDateTime), "do MMM yy");
  }, [expense]);

  const expenseTime = useMemo(() => {
    return format(new Date(expense.localDateTime), "HH:mm");
  }, [expense]);

  const dataFieldsToDisplay = useMemo<DataField[]>(() => {
    return [
      {
        label: "Cost",
        value: `€${expense.euroAmount} / ${expense.amount} ${expense.currency.code}`,
        icon: {
          Component: PriceTagIcon,
        },
      },
      {
        label: "Category",
        value: expense.category.name,
        icon: {
          Component: ExpenseCategoryIcon,
          props: { categoryId: expense.category.id },
        },
      },
      {
        label: "Location",
        value: `${expense.city.name}, ${expense.country.name}`,
        icon: {
          Component: LocationIcon,
        },
      },
      {
        label: "User",
        value: `${expense.user.firstName} ${expense.user.lastName}`,
        icon: {
          Component: UserIcon,
        },
      },
      {
        label: "Description",
        value: (
          <span className={expense.description ? "" : "italic"}>
            {expense.description
              ? expense.description
              : "No description provided."}
          </span>
        ),
        icon: {
          Component: NoteIcon,
        },
      },
    ];
  }, [expense]);

  const [shouldConfirmDelete, setShouldConfirmDelete] = useState(false);
  const [shouldConfirmCopy, setShouldConfirmCopy] = useState(false);

  const onClickDeleteExpense = useCallback(() => {
    setShouldConfirmDelete(true);
  }, []);

  const onClickConfirmCopy = useCallback(() => {
    setShouldConfirmCopy(true);
  }, []);

  const onConfirmCopy = useCallback(
    async (shouldCopy: boolean) => {
      setShouldConfirmCopy(false);

      if (shouldCopy) {
        await dispatch(copyExpense(expenseId));
        onClose();
      }
    },
    [dispatch, expenseId, onClose]
  );

  const onConfirmDelete = useCallback(
    (shouldDelete: boolean) => {
      setShouldConfirmDelete(false);
      if (shouldDelete) {
        onConfirmDeleteExpense();
        onClose();
      }
    },
    [onConfirmDeleteExpense, onClose]
  );

  return (
    <div>
      <Modal>
        <ModalHeader
          includeCloseButton={true}
          onClickClose={onClose}
          title={
            <div className="flex flex-col items-center flex-1">
              <span className="font-bold text-2xl">{expenseDate}</span>
              <span className="font-bold text-md">{expenseTime}</span>
            </div>
          }
        />

        <ModalBody height={330}>
          <div className="flex flex-col py-2">
            {dataFieldsToDisplay.map(({ label, value, icon }) => {
              const iconProps = icon?.props || {};
              return (
                <div
                  className="flex flex-1 py-2 items-center border-b border-dashed border-primary last:border-0"
                  key={label}
                >
                  <div className="flex items-center flex-col border-r border-dashed border-primary w-20 pr-3">
                    <icon.Component {...iconProps} className="w-6" />
                    <span className="text-[10px] mt-1 font-bold">{label}</span>
                  </div>
                  <div className="flex-1 ml-6 text-sm">{value}</div>
                </div>
              );
            })}
          </div>
        </ModalBody>
        <ModalFooter>
          <button
            className="flex items-center py-2 px-4 text-md mx-4 hover:underline text-primary font-bold"
            onClick={onClickEditExpense}
          >
            <EditIcon className="w-6 mr-1 fill-primary" />
            Edit
          </button>
          <button
            className="flex items-center py-2 px-4 text-md mx-4 hover:underline text-primary font-bold text-blue-400"
            onClick={onClickConfirmCopy}
          >
            <CloneIcon className="w-6 mr-1 fill-primary" />
            Copy
          </button>
          <button
            className="flex items-center py-2 px-4 text-md text-red-400 hover:underline font-bold"
            onClick={onClickDeleteExpense}
          >
            <TrashIcon className="w-6 mr-1" />
            Delete
          </button>
        </ModalFooter>
      </Modal>
      {shouldConfirmDelete && (
        <ConfirmModal
          title="Are you sure you want to delete this expense?"
          onConfirm={onConfirmDelete}
        />
      )}
      {shouldConfirmCopy && (
        <ConfirmModal
          title="Are you sure you want to copy this expense?"
          onConfirm={onConfirmCopy}
        />
      )}
    </div>
  );
}
