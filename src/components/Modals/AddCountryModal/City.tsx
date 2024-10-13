import { City as CityType } from "@/api";
import { ReactComponent as CheckIcon } from "@/assets/check.svg";

interface CityProps {
  city: Omit<CityType, "timezoneName">;
  isSelected: boolean;
  onClick: (cityId: number) => void;
}

export default function City({ city, isSelected, onClick }: CityProps) {
  return (
    <div
      className="flex items-center justify-between h-12 overflow-hidden px-2 py-4 hover:opacity-70 cursor-pointer"
      key={city.id}
      onClick={() => onClick(city.id)}
    >
      <span className={`truncate ${isSelected ? "text-green-600" : ""}`}>
        {city.name}
      </span>
      {isSelected && (
        <span className="ml-2">
          <CheckIcon className="w-6 fill-green-600" />
        </span>
      )}
    </div>
  );
}
