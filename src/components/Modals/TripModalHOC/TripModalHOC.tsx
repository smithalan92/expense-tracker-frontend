import React, { ChangeEvent, useEffect, useState } from "react";
import { TripModalHOCProps } from "./TripModalHOC.types";

export default function ExpenseModalHOC({
  title,
  footer,
  onChangeData,
}: TripModalHOCProps) {
  // const expense = useAppSelector((state) =>
  //   selectExpenseById(state, expenseId ?? 0)
  // )!;

  const [name, setName] = useState("");

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  useEffect(() => {
    onChangeData();
  }, [name]);

  return (
    <div className="et-modal-backdrop overflow-hidden">
      <div className="animate-slide-in-bottom et-modal overflow-hidden absolute bottom-0 md:relative box-content w-[350px] md:w-full">
        <h2 className="font-bold text-2xl mb-2">{title}</h2>
        <div className="h-[450px] overflow-y-scroll pr-4">
          <div className="flex items-center py-4">
            <div className="w-24 mb-4">Name</div>
            <input value={name} onChange={onChangeName} />
          </div>
        </div>
        <div>{footer}</div>
      </div>
    </div>
  );
}
