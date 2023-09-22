import { ChangeEvent, useCallback } from "react";
import { PickerOption } from "../Picker/Picker.types";

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
      const option = options.find(
        (o) => o.value === parseInt(event.target.value, 10)
      );
      onChange(option!);
    },
    [options, onChange]
  );

  if (options.find((o) => o.label.toLowerCase() === "tanzania")) {
    console.log(value);
  }

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
