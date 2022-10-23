import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectExpenseCategories,
  selectSelectedCategoryId,
  setSelectedCategoryId,
} from "@/store/slices/newExpense";
import { useCallback, useMemo } from "react";
import { CategoryPickerOption } from "./ExpenseCategoryPicker.types";

export default function ExpenseCategoryPicker() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectExpenseCategories);
  const selectedCategoryId = useAppSelector(selectSelectedCategoryId);

  const categoryOptions = useMemo(() => {
    return categories.map<CategoryPickerOption>((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [categories]);

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null;

    return categoryOptions.find((c) => c.value === selectedCategoryId);
  }, [selectedCategoryId]);

  const onSelectCurrency = useCallback(
    (option: CategoryPickerOption | null) => {
      dispatch(setSelectedCategoryId(option!.value));
    },
    [dispatch]
  );

  return (
    <CustomSelect
      className="flex-1"
      name="category"
      menuPlacement="top"
      options={categoryOptions}
      isSearchable={true}
      value={selectedCategory}
      onChange={onSelectCurrency}
    />
  );
}
