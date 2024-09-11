import { useMemo } from "react";

interface ModalProps {
  children: React.ReactNode;
  position?: "center" | "bottom";
  width?: number;
}

export default function Modal({ children, position, width }: ModalProps) {
  const stylesToApply = useMemo(() => {
    const styles: React.CSSProperties = {};

    if (width) {
      styles.width = `${width}px`;
    }

    return styles;
  }, [width]);

  return (
    <div className="et-modal-backdrop overflow-hidden">
      <div
        style={stylesToApply}
        className={`animate-slide-in-bottom et-modal overflow-hidden box-content w-[390px] md:w-full p-0 ${
          position !== "center" ? "absolute bottom-0 md:relative" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
