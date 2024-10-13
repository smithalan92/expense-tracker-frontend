import { ReactComponent as DeleteIcon } from "@/assets/close.svg";
import { ChangeEvent, useState } from "react";

export default function ImagePicker({
  onChange,
  initalImage,
}: ImagePickerProps) {
  const [selectedImage, setSelectedImage] = useState<SelectedFile>(
    initalImage ?? null
  );

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(URL.createObjectURL(e.target.files![0]));
    onChange(e.target.files![0]);
  };

  const onRemoveFile = () => {
    setSelectedImage(null);
    onChange(null);
  };

  return (
    <div className="flex-1 relative">
      <label htmlFor="imagepicker" className="cursor-pointer">
        {selectedImage && (
          <img src={selectedImage} className="h-48 w-full object-cover" />
        )}
        {!selectedImage && (
          <div className="w-full h-48 flex items-center justify-center border border-dotted border-black rounded">
            Choose an image
          </div>
        )}
        <input
          type="file"
          hidden
          id="imagepicker"
          accept=".jpeg,.jpg,.png,.gif"
          onChange={onSelectFile}
        />
      </label>
      {selectedImage && (
        <button
          className="absolute bottom-0 right-0 p-1"
          onClick={onRemoveFile}
        >
          <div className="bg-gray-100 rounded-full p-2 hover:bg-gray-300">
            <DeleteIcon className="w-4 h-4 text-red-500" />
          </div>
        </button>
      )}
    </div>
  );
}

export type SelectedFile = null | string;

export interface ImagePickerProps {
  initalImage?: string | null;
  onChange: (file: File | null) => void;
}
