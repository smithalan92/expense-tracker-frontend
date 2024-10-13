import { DailyCostBreakdownResult } from "@/api";
import StatSection from "@/components/sections/StatSection/StatSection";
import { useState } from "react";
import DayBreakdownChart from "./DayBreakdownChart";
import DayBreakdownTable from "./DayBreakdownTable";

export default function DayBreakdown({
  dailyCostBreakdown,
}: DayBreakdownProps) {
  const [activeTab, setActiveTab] = useState<DayBreakdownView>("chart");

  const onClickChartTab = () => {
    setActiveTab("chart");
  };

  const onClickTableTab = () => {
    setActiveTab("table");
  };
  return (
    <StatSection title="Daily Expense Totals">
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
              <DayBreakdownChart dailyCostBreakdown={dailyCostBreakdown} />
            </div>
          </div>
        )}
        {activeTab === "table" && (
          <DayBreakdownTable dailyCostBreakdown={dailyCostBreakdown} />
        )}
      </div>
    </StatSection>
  );
}

export interface DayBreakdownProps {
  dailyCostBreakdown: DailyCostBreakdownResult[];
}

export type DayBreakdownView = "chart" | "table";
