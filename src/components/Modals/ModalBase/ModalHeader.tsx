import { ReactComponent as CloseIcon } from "@/assets/close.svg";

interface ModalHeaderProps {
  title: React.ReactNode;
  includeCloseButton?: boolean;
  onClickClose?: () => void;
}

export default function ModalHeader({
  title,
  includeCloseButton,
  onClickClose,
}: ModalHeaderProps) {
  return (
    <div className="flex justify-between items-center bg-primary py-4 px-6 text-white">
      {typeof title === "string" && (
        <h2 className="font-bold text-2xl">{title}</h2>
      )}
      {typeof title !== "string" && title}
      {includeCloseButton && onClickClose && (
        <div className="p-1 hover:cursor-pointer" onClick={onClickClose}>
          <CloseIcon className="w-3" />
        </div>
      )}
    </div>
  );
}
