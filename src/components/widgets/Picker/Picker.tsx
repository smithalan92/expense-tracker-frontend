import CustomSelect from "@/components/widgets/CustomSelect/CustomSelect";
import { useCallback, useMemo } from "react";
import { OnChangeValue } from "react-select";

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
    [isMulti, onChange]
  );

  const selected = useMemo(() => {
    if (!isMulti) return options.find((c) => c.value === value);
    return options.filter((o) => value.includes(o.value));
  }, [isMulti, options, value]);

  return (
    <CustomSelect
      className="flex-1"
      options={options}
      onChange={onSelect}
      value={selected}
      menuPortalTarget={document.body}
      isMulti={isMulti}
    />
  );
}

export interface PickerOption {
  value: number;
  label: string;
}

export interface PickerBaseProps {
  options: PickerOption[];
  isDisabled?: boolean;
}

export interface PickerSingleProps extends PickerBaseProps {
  value: number | null;
  isMulti: false;
  onChange: (id: number) => void;
}

export interface PickerMultiProps extends PickerBaseProps {
  value: number[];
  isMulti: true;
  onChange: (ids: number[]) => void;
}

export type PickerProps = PickerSingleProps | PickerMultiProps;
