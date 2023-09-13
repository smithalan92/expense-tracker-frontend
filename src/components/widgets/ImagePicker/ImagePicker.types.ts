export type SelectedFile = null | string;

export interface ImagePickerProps {
  onChange: (file: File | null) => void;
}
