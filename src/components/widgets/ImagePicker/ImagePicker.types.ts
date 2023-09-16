export type SelectedFile = null | string;

export interface ImagePickerProps {
  initalImage?: string | null;
  onChange: (file: File | null) => void;
}
