import { ReactComponent as AccomidationIcon } from "@/assets/category_icons/accommodation.svg";
import { ReactComponent as AlcoholIcon } from "@/assets/category_icons/alcohol.svg";
import { ReactComponent as AtmFeesIcon } from "@/assets/category_icons/atm_fees.svg";
import { ReactComponent as ClothesIcon } from "@/assets/category_icons/clothes.svg";
import { ReactComponent as CoffeeIcon } from "@/assets/category_icons/coffee.svg";
import { ReactComponent as FlightsIcon } from "@/assets/category_icons/flights.svg";
import { ReactComponent as JewelleryIcon } from "@/assets/category_icons/jewellery.svg";
import { ReactComponent as OtherIcon } from "@/assets/category_icons/other.svg";
import { ReactComponent as RestaurantsIcon } from "@/assets/category_icons/restaurants.svg";
import { ReactComponent as SnacksDrinksIcon } from "@/assets/category_icons/snacks_drinks.svg";
import { ReactComponent as SourvenirsIcon } from "@/assets/category_icons/souvenirs.svg";
import { ReactComponent as TipsIcon } from "@/assets/category_icons/tips.svg";
import { ReactComponent as TobbacoIcon } from "@/assets/category_icons/tobbaco.svg";
import { ReactComponent as ToursActivitesIcon } from "@/assets/category_icons/tours_activities.svg";
import { ReactComponent as TransportIcon } from "@/assets/category_icons/transport.svg";
import { useMemo } from "react";

function getIconFromCategoryID(id: number) {
  switch (id) {
    case 3:
      return TransportIcon;
    case 4:
      return RestaurantsIcon;
    case 5:
      return TobbacoIcon;
    case 6:
      return ToursActivitesIcon;
    case 7:
      return ClothesIcon;
    case 8:
      return JewelleryIcon;
    case 9:
      return AlcoholIcon;
    case 10:
      return OtherIcon;
    case 11:
      return SnacksDrinksIcon;
    case 12:
      return CoffeeIcon;
    case 13:
      return AtmFeesIcon;
    case 15:
      return TipsIcon;
    case 16:
      return SourvenirsIcon;
    case 17:
      return FlightsIcon;
    case 18:
      return AccomidationIcon;
    default:
      return OtherIcon;
  }
}

export default function ExpenseCategoryIcon({
  categoryId,
  className,
}: {
  categoryId: number;
  className?: string;
}) {
  const IconComponent = useMemo(
    () => getIconFromCategoryID(categoryId),
    [categoryId]
  );

  return <IconComponent className={className} />;
}
