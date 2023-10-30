import { useMemo } from "react";

interface ModalBodyProps {
  children: React.ReactNode;
  height?: number | string;
}

export default function ModalBody({ children, height }: ModalBodyProps) {
  const bodyHeight = useMemo(() => {
    if (height && typeof height === "string") return height;
    return `${height ? height : 500}px`;
  }, [height]);

  return (
    <div
      className="flex flex-col overflow-scroll px-6"
      style={{ height: bodyHeight }}
    >
      {children}
    </div>
  );
}
