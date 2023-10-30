interface ModalProps {
  children: React.ReactNode;
  position?: "center" | "bottom";
}

export default function Modal({ children, position }: ModalProps) {
  return (
    <div className="et-modal-backdrop overflow-hidden">
      <div
        className={`animate-slide-in-bottom et-modal overflow-hidden box-content w-[390px] md:w-full p-0 ${
          position !== "center" ? "absolute bottom-0 md:relative" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
