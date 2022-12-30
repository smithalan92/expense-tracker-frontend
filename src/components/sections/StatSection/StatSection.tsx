import { StatSectionProps } from "./StatSection.types";

export default function StatSection({ title, children }: StatSectionProps) {
  return (
    <div className="flex flex-col">
      <h1 className="font-semibold text-xl">{title}</h1>
      <div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
