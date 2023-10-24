import { getTripStats } from "@/api";
import { GetTripStatsResponse } from "@/api.types";
import { ReactComponent as CloseIcon } from "@/assets/close.svg";
import StatSection from "@/components/sections/StatSection/StatSection";
import Spinner from "@/components/widgets/Spinner";
import { useAppDispatch } from "@/store";
import { setShouldShowTripStatsModal } from "@/store/slices/tripData";
import format from "date-fns/format";
import { useCallback, useEffect, useMemo, useState } from "react";
import CategoryBreakdown from "./CategoryBreakDown/CategoryBreakdown";
import CityBreakdown from "./CityBreakdown/CityBreakdown";
import CountryBreakdown from "./CountryBreakdown/CountryBreakdown";
import DayBreakdown from "./DayBreakdown/DayBreakdown";
import HourlySpendingBreakdown from "./HourlySpendingBreakdown/HourlySpendingBreakdown";
import UserBreakdown from "./UserBreakdown/UserBreakdown";

export default function TripStatsModal({ tripId }: { tripId: number }) {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [hasFailedToLoad, setHasFailedToLoad] = useState(false);
  const [stats, setStats] = useState<GetTripStatsResponse | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const hasEmptyStats = useMemo(() => {
    if (stats === null) return false;
    return stats.userBreakdown.length === 0;
  }, [stats]);

  useEffect(() => {
    getTripStats(tripId)
      .then((res) => {
        setStats(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setHasFailedToLoad(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      dispatch(setShouldShowTripStatsModal(false));
    }, 300);
  };

  const maybeRenderContent = useCallback(() => {
    if (isLoading || (hasFailedToLoad && !stats) || hasEmptyStats) return null;

    const {
      mostExpenseDay,
      leastExpensiveDay,
      categoryBreakdown,
      userBreakdown,
      dailyCostBreakdown,
      countryBreakdown,
      cityBreakdown,
      hourlySpendingBreakdown,
    } = stats!;

    return (
      <div>
        <div className="flex flex-col py-4">
          <StatSection title="Most Expensive Day">
            <span>
              {format(new Date(mostExpenseDay.localDate), "dd MMM yyyy")} spent{" "}
              <span className="text-red-500">
                €{mostExpenseDay.totalEuroAmount}
              </span>
            </span>
          </StatSection>
        </div>
        <div className="flex flex-col py-4">
          <StatSection title="Least Expensive Day">
            <span>
              {format(new Date(leastExpensiveDay.localDate), "dd MMM yyyy")}{" "}
              spent{" "}
              <span className="text-green-500">
                €{leastExpensiveDay.totalEuroAmount}
              </span>
            </span>
          </StatSection>
        </div>
        <div className="flex flex-col py-4">
          <UserBreakdown userBreakdown={userBreakdown} />
        </div>
        <div className="flex flex-col py-4">
          <CategoryBreakdown categoryBreakdown={categoryBreakdown} />
        </div>
        <div className="flex flex-col py-4">
          <CountryBreakdown countryBreakdown={countryBreakdown} />
        </div>
        <div className="flex flex-col py-4">
          <CityBreakdown cityBreakdown={cityBreakdown} />
        </div>
        <div className="flex flex-col py-4">
          <DayBreakdown dailyCostBreakdown={dailyCostBreakdown} />
        </div>
        <div className="flex flex-col py-4">
          <HourlySpendingBreakdown
            hourlySpendingBreakdown={hourlySpendingBreakdown}
          />
        </div>
      </div>
    );
  }, [hasEmptyStats, hasFailedToLoad, isLoading, stats]);

  const maybeRenderLoader = useCallback(() => {
    if (!isLoading) return null;
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }, [isLoading]);

  const maybeRenderFailedState = useCallback(() => {
    if (!hasFailedToLoad) return null;
    return (
      <div className="w-full h-full flex items-center justify-center">
        Stats failed to load. Please try again later.
      </div>
    );
  }, [hasFailedToLoad]);

  const maybeRenderEmptyState = useCallback(() => {
    if (!hasEmptyStats) return null;
    return (
      <div className="w-full h-full flex items-center justify-center">
        No stats available. Add some expenses and come back!
      </div>
    );
  }, [hasEmptyStats]);

  return (
    <div
      className={`et-modal-backdrop overflow-hidden ${
        isClosing ? "animate-fade-out" : ""
      }`}
    >
      <div className="animate-slide-in-bottom bg-base-100 h-full md:h-[80%] overflow-y-scroll absolute bottom-0 md:relative w-full md:w-[750px] md:rounded-lg">
        <div className="flex items-center bg-expensr-blue px-8 text-white h-16 sticky top-0 w-full z-20">
          <h2 className="font-bold text-2xl flex-1">Trip Stats</h2>
          <span
            className="cursor-pointer p-4 hover:text-gray-300 text-lg"
            onClick={onClickClose}
          >
            <CloseIcon className="w-4 h-4" />
          </span>
        </div>
        <div className="px-8">
          {maybeRenderLoader()}
          {maybeRenderFailedState()}
          {maybeRenderContent()}
          {maybeRenderEmptyState()}
        </div>
      </div>
    </div>
  );
}
