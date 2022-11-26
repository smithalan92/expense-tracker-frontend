import { useEffect, useRef, useState } from "react";
import { ReactComponent as CaretIcon } from "@/assets/caret.svg";
import { ExpandableSectionProps } from "./ExpandableSection.types";

export default function ExpandableSection({
  title,
  children,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef(null);
  const [timeoutRef, setTimeoutRef] = useState<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (timeoutRef) clearTimeout(timeoutRef);
    if (isExpanded && contentRef) {
      setTimeoutRef(
        setTimeout(() => {
          (contentRef.current! as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 0)
      );
    }
  }, [isExpanded]);

  return (
    <>
      <div
        className="font-bold text-xl flex items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">{title}</div>
        <CaretIcon
          className={`ease-in-out duration-100 w-4 ml-2 ${
            isExpanded && "rotate-180"
          }`}
        />
      </div>
      <div ref={contentRef}>
        {isExpanded && <div className="mt-2">{children}</div>}
      </div>
    </>
  );
}
