import { HourlySpendingResult } from "@/api";
import StatSection from "@/components/sections/StatSection/StatSection";
import { useState } from "react";
import BreakdownChart from "./HourlySpendingBreakdownChart";
import BreakdownTable from "./HourlySpendingBreakdownTable";

export default function DayBreakdown({
  hourlySpendingBreakdown,
}: HourlySpendingBreakdownProps) {
  const [activeTab, setActiveTab] = useState<BreakdownView>("chart");

  const onClickChartTab = () => {
    setActiveTab("chart");
  };

  const onClickTableTab = () => {
    setActiveTab("table");
  };
  return (
    <StatSection title="Spending by hour">
      <div className="tabs">
        <a
          className={`tab tab-bordered px-8 ${
            activeTab === "chart" ? "tab-active" : ""
          }`}
          onClick={onClickChartTab}
        >
          Chart
        </a>
        <a
          className={`tab tab-bordered px-8 ${
            activeTab === "table" ? "tab-active" : ""
          }`}
          onClick={onClickTableTab}
        >
          Table
        </a>
      </div>
      <div className="mt-4">
        {activeTab === "chart" && (
          <div className="overflow-scroll">
            <div className="w-[600px]">
              <BreakdownChart
                hourlySpendingBreakdown={hourlySpendingBreakdown}
              />
            </div>
          </div>
        )}
        {activeTab === "table" && (
          <BreakdownTable hourlySpendingBreakdown={hourlySpendingBreakdown} />
        )}
      </div>
    </StatSection>
  );
}

export interface HourlySpendingBreakdownProps {
  hourlySpendingBreakdown: HourlySpendingResult[];
}

export type BreakdownView = "chart" | "table";
