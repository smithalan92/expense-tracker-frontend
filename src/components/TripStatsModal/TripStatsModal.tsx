import { getTripStats } from "@/api";
import { GetTripStatsResponse } from "@/api.types";
import { useAppDispatch } from "@/store";
import { setShouldShowTripStatsModal } from "@/store/slices/tripData";
import { formatDateForStoring } from "@/utils/date";
import format from "date-fns/format";
import { useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "../Spinner";

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
    } = stats!;

    return (
      <div>
        <div className="flex flex-col py-4 border-t border-solid border-neutral-focus">
          <span className="font-bold text-xl">Most Expense Day</span>
          <span className="mt-2">
            {format(new Date(mostExpenseDay.localDate), "dd MMM yyyy")} spent{" "}
            <span className="text-red-500">
              €{mostExpenseDay.totalEuroAmount}
            </span>
          </span>
        </div>
        <div className="flex flex-col py-4 border-t border-solid border-neutral-focus">
          <span className="font-bold text-xl">Least Expense Day</span>
          <span className="mt-2">
            {format(new Date(leastExpensiveDay.localDate), "dd MMM yyyy")} spent{" "}
            <span className="text-green-500">
              €{leastExpensiveDay.totalEuroAmount}
            </span>
          </span>
        </div>
        <div className="flex flex-col py-4 border-t border-solid border-neutral-focus">
          <span className="font-bold text-xl">Expense Breakdown By User</span>
          <div className="mt-2">
            <table className="table table-compact w-full border-collapse">
              <colgroup>
                <col width="50%" />
                <col width="50%" />
              </colgroup>
              <thead>
                <tr>
                  <th>User</th>
                  <th align="center">Amount</th>
                </tr>
              </thead>
              <tbody>
                {userBreakdown.map((bd) => {
                  return (
                    <tr key={bd.userFirstName}>
                      <td>{bd.userFirstName}</td>
                      <td align="center">€{bd.totalEuroAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col py-4 border-t border-solid border-neutral-focus">
          <span className="font-bold text-xl">Expense Category Breakdown</span>
          <div className="mt-2">
            <table className="table table-compact w-full border-collapse">
              <colgroup>
                <col width="50%" />
                <col width="50%" />
              </colgroup>
              <thead>
                <tr>
                  <th>Category</th>
                  <th align="center">Amount</th>
                </tr>
              </thead>
              <tbody>
                {categoryBreakdown.map((cb) => {
                  return (
                    <tr key={cb.categoryName}>
                      <td>{cb.categoryName}</td>
                      <td align="center">€{cb.totalEuroAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
    <div className="flex w-full h-full absolute top-0 left-0 justify-center items-center bg-black/50">
      <div className="modal-box overflow-hidden absolute bottom-[-32px] md:relative box-content">
        <span
          className="btn btn-md btn-circle absolute right-4 top-4 text-lg"
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
