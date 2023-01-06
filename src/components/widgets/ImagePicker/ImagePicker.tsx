import { ChangeEvent, useState } from "react";
import { ImagePickerProps, SelectedFile } from "./ImagePicker.types";

export default function ImagePicker({ onChange }: ImagePickerProps) {
  const [selectedImage, setSelectedImage] = useState<SelectedFile>(null);

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedImage(URL.createObjectURL(e.target.files![0]));
    onChange(e.target.files![0]);
  };

  return (
    <div className="flex-1">
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
    </div>
  );
}
