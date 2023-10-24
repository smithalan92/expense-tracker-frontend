import { StatSectionProps } from "./StatSection.types";

export default function StatSection({ title, children }: StatSectionProps) {
  return (
    <div className="w-full rounded-lg border border-solid border-gray-300 shadow-sm p-2">
      <h2 className="text-lg font-bold p-2">{title}</h2>
      <div className="px-2 py-1">{children}</div>
    </div>
  );
}
