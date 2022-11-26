import { getTripStats } from "@/api";
import { GetTripStatsResponse } from "@/api.types";
import { useAppDispatch } from "@/store";
import { setShouldShowTripStatsModal } from "@/store/slices/tripData";
import format from "date-fns/format";
import { useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "../Spinner";
import CategoryBreakdown from "./CategoryBreakDown/CategoryBreakdown";
import UserBreakdown from "./UserBreakdown/UserBreakdown";
import ExpandableSection from "@/components/ExpandableSection/ExpandableSection";
import DayBreakdown from "./DayBreakdown/DayBreakdown";

export default function TripStatsModal({ tripId }: { tripId: number }) {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [hasFailedToLoad, setHasFailedToLoad] = useState(false);
  const [stats, setStats] = useState<GetTripStatsResponse | null>(null);

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
  }, []);

  const onClickClose = () => {
    dispatch(setShouldShowTripStatsModal(false));
  };

  const maybeRenderContent = useCallback(() => {
    if (isLoading || (hasFailedToLoad && !stats) || hasEmptyStats) return null;

    const {
      mostExpenseDay,
      leastExpensiveDay,
      categoryBreakdown,
      userBreakdown,
      dailyCostBreakdown,
    } = stats!;

    return (
      <div>
        <div className="flex flex-col py-4 border-t border-solid border-neutral-focus">
          <ExpandableSection title="Most expense Day">
            <span>
              {format(new Date(mostExpenseDay.localDate), "dd MMM yyyy")} spent{" "}
              <span className="text-red-500">
                €{mostExpenseDay.totalEuroAmount}
              </span>
            </span>
          </ExpandableSection>
        </div>
        <div className="flex flex-col py-4 border-t border-solid border-neutral-focus">
          <ExpandableSection title="Least Expensive Day">
            <span>
              {format(new Date(leastExpensiveDay.localDate), "dd MMM yyyy")}{" "}
              spent{" "}
              <span className="text-green-500">
                €{leastExpensiveDay.totalEuroAmount}
              </span>
            </span>
          </ExpandableSection>
        </div>
        <div className="flex flex-col py-4 border-t border-solid border-neutral-focus">
          <UserBreakdown userBreakdown={userBreakdown} />
        </div>
        <div className="flex flex-col py-4 border-t border-solid border-neutral-focus">
          <CategoryBreakdown categoryBreakdown={categoryBreakdown} />
        </div>
        <div className="flex flex-col py-4 border-t border-solid border-neutral-focus">
          <DayBreakdown dailyCostBreakdown={dailyCostBreakdown} />
        </div>
      </div>
    );
  }, [isLoading]);

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
  }, [isLoading]);

  const maybeRenderEmptyState = useCallback(() => {
    if (!hasEmptyStats) return null;
    return (
      <div className="w-full h-full flex items-center justify-center">
        No stats available. Add some expenses and come back!
      </div>
    );
  }, [isLoading]);

  return (
    <div className="et-modal-backdrop overflow-hidden">
      <div className="animate-slide-in-bottom et-modal overflow-hidden absolute bottom-0 md:relative box-content w-[350px] md:w-full">
        <span
          className="cursor-pointer px-2 absolute hover:bg-blue-200 hover:rounded-full hover:text-gray-700 right-4 top-4 text-lg"
          onClick={onClickClose}
        >
          ✕
        </span>
        <h2 className="font-bold text-2xl mb-8">Trip Stats</h2>
        <div className="h-[550px] overflow-y-scroll pr-4">
          {maybeRenderLoader()}
          {maybeRenderFailedState()}
          {maybeRenderContent()}
          {maybeRenderEmptyState()}
        </div>
      </div>
    </div>
  );
}
