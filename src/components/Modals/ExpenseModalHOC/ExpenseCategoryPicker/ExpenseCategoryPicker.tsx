import CustomSelect from "@/components/widgets/CustomSelect/CustomSelect";
import { useAppSelector } from "@/store";
import { selectCategories } from "@/store/slices/tripData";
import { useCallback, useMemo } from "react";
import {
  CategoryPickerOption,
  ExpenseCategoryPickerProps,
} from "./ExpenseCategoryPicker.types";

export default function ExpenseCategoryPicker({
  value,
  onChange,
}: ExpenseCategoryPickerProps) {
  const categories = useAppSelector(selectCategories);

  const categoryOptions = useMemo(() => {
    return categories.map<CategoryPickerOption>((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [categories]);

  const selectedCategory = useMemo(() => {
    if (!value) return null;

    return categoryOptions.find((c) => c.value === value);
  }, [value]);

  const onSelectCurrency = useCallback(
    (option: CategoryPickerOption | null) => {
      onChange(option!.value);
    },
    [onChange]
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
