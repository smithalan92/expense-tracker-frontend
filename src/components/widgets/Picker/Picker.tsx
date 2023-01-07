import CustomSelect from "@/components/widgets/CustomSelect/CustomSelect";
import { useCallback, useMemo } from "react";
import { OnChangeValue } from "react-select";
import { PickerOption, PickerProps } from "./Picker.types";

export default function Picker({
  options,
  value,
  isMulti,
  onChange,
}: PickerProps) {
  const onSelect = useCallback(
    (selected: OnChangeValue<PickerOption, typeof isMulti>) => {
      if (isMulti) {
        const ids = (selected as PickerOption[]).map((v) => v.value);
        onChange(ids);
      } else {
        onChange((selected as PickerOption)?.value ?? null);
      }
    },
    []
  );

  const selected = useMemo(() => {
    if (!isMulti) return options.find((c) => c.value === value);
    return options.filter((o) => value.includes(o.value));
  }, [options, value]);

  return (
    <CustomSelect
      className="flex-1"
      options={options}
      onChange={onSelect}
      value={selected}
      menuPortalTarget={document.body}
      isMulti={true}
    />
  );
}
