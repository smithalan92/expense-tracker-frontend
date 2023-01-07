export interface PickerOption {
  value: number;
  label: string;
}

export interface PickerBaseProps {
  options: PickerOption[];
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
