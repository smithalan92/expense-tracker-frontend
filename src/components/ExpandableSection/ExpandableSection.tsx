import { useState } from "react";
import { ReactComponent as CaretIcon } from "@/assets/caret.svg";
import { ExpandableSectionProps } from "./ExpandableSection.types";

export default function ExpandableSection({
  title,
  children,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div
        className="font-bold text-xl flex items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {title}
        <CaretIcon
          className={`ease-in-out duration-100 w-6 ml-2 mt-1 ${
            isExpanded && "rotate-180"
          }`}
        />
      </div>
      {isExpanded && <div className="mt-2">{children}</div>}
    </>
  );
}
