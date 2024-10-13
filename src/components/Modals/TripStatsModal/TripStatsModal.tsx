import { getTripStats, GetTripStatsResponse } from "@/api";
import Modal from "@/components/Modals/ModalBase/Modal";
import ModalBody from "@/components/Modals/ModalBase/ModalBody";
import ModalHeader from "@/components/Modals/ModalBase/ModalHeader";
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
  const [includeFlights, setIncludeFlights] = useState(true);
  const [includeAccommodation, setIncludeAccommodation] = useState(true);

  const hasEmptyStats = useMemo(() => {
    if (stats === null) return false;
    return stats.userBreakdown.length === 0;
  }, [stats]);

  const totalAmountSpent = useMemo(() => {
    if (!stats) return 0;
    return stats.countryBreakdown.reduce((acc, current) => {
      return acc + current.euroTotal;
    }, 0);
  }, [stats]);

  useEffect(() => {
    setIsLoading(true);
    getTripStats(tripId, {
      includeFlights,
      includeHotels: includeAccommodation,
    })
      .then((res) => {
        setStats(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setHasFailedToLoad(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeFlights, includeAccommodation]);

  const onClickClose = useCallback(() => {
    dispatch(setShouldShowTripStatsModal(false));
  }, [dispatch]);

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
          <StatSection title="Total amount spent">
            <span className="">€{totalAmountSpent}</span>
          </StatSection>
        </div>
        <div className="flex flex-col py-4">
          <StatSection title="Most Expensive Day">
            <span>
              <span className="text-red-500">
                €{mostExpenseDay.totalEuroAmount}&nbsp;
              </span>
              on {format(new Date(mostExpenseDay.localDate), "dd MMMM yyyy")}
            </span>
          </StatSection>
        </div>
        <div className="flex flex-col py-4">
          <StatSection title="Least Expensive Day">
            <span>
              <span className="text-green-500">
                €{leastExpensiveDay.totalEuroAmount}&nbsp;
              </span>
              on {format(new Date(leastExpensiveDay.localDate), "dd MMMM yyyy")}
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

  const maybeRenderFilters = useCallback(() => {
    if (isLoading) return null;

    return (
      <div className="flex py-2 mt-4">
        <div className="flex items-center justify-center">
          <label>
            <span className="mr-1">Include Flights</span>
            <input
              type="checkbox"
              checked={includeFlights}
              onChange={(e) => setIncludeFlights(e.target.checked)}
            />
          </label>
        </div>
        <div className="flex items-center justify-center ml-4">
          <label>
            <span className="mr-1"> Include Accommodation</span>
            <input
              type="checkbox"
              checked={includeAccommodation}
              onChange={(e) => setIncludeAccommodation(e.target.checked)}
            />
          </label>
        </div>
      </div>
    );
  }, [isLoading, includeFlights, includeAccommodation]);

  return (
    <Modal>
      <ModalHeader
        title="Trip Stats"
        includeCloseButton={true}
        onClickClose={onClickClose}
      />
      <ModalBody>
        {maybeRenderLoader()}
        {maybeRenderFilters()}
        {maybeRenderFailedState()}
        {maybeRenderContent()}
        {maybeRenderEmptyState()}
      </ModalBody>
    </Modal>
  );
}
