import { useMemo } from "react";

interface ModalFooterProps {
  children: React.ReactNode;
  justifyItems?: "end" | "center";
}

export default function ModaFooter({
  children,
  justifyItems,
}: ModalFooterProps) {
  const justify = useMemo(() => {
    if (!justifyItems || justifyItems === "end") return "flex-end";
    return "center";
  }, [justifyItems]);

  return (
    <div className="flex pt-6 px-6 pb-4" style={{ justifyContent: justify }}>
      {children}
    </div>
  );
}
