import { ChangeEvent, useCallback } from "react";
import type { PickerOption } from "../Picker/Picker";

export interface MobileSelectProps {
  className?: string;
  options: PickerOption[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  onChange: any;
  value?: PickerOption;
  isMulti?: boolean;
}

export default function MobileSelect({
  className,
  options,
  onChange,
  value,
}: MobileSelectProps) {
  const onSelectChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const option = options.find((o) => {
        if (typeof o.value === "number")
          return o.value === parseInt(event.target.value, 10);
        return o.value === event.target.value;
      });
      onChange(option!);
    },
    [options, onChange]
  );

  return (
    <select
      onChange={onSelectChange}
      value={value?.value}
      className={`px-4 w-full h-12 rounded rounded-lg text-base border border-solid border-gray-300 flex-1 bg-white ${
        className ?? ""
      }`}
    >
      <option hidden>Select...</option>
      {options.map((option) => {
        return (
          <option
            // selected={option.value === value?.value}
            value={option.value}
            key={option.value}
          >
            {option.label}
          </option>
        );
      })}
    </select>
  );
}
