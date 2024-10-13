import { CityBreakdownResult } from "@/api";
import StatSection from "@/components/sections/StatSection/StatSection";
import { useState } from "react";
import CityBreakdownPieChart from "./CityBreakdownPieChart";
import CityBreakdownTable from "./CityBreakdownTable";

export default function CityBreakdown({ cityBreakdown }: CityBreakdownProps) {
  const [activeTab, setActiveTab] = useState<CityBreakdownView>("chart");

  const onClickChartTab = () => {
    setActiveTab("chart");
  };

  const onClickTableTab = () => {
    setActiveTab("table");
  };

  return (
    <StatSection title="Expense City Breakdown">
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
          <CityBreakdownPieChart cityBreakdown={cityBreakdown} />
        )}
        {activeTab === "table" && (
          <CityBreakdownTable cityBreakdown={cityBreakdown} />
        )}
      </div>
    </StatSection>
  );
}

export interface CityBreakdownProps {
  cityBreakdown: CityBreakdownResult[];
}

export type CityBreakdownView = "chart" | "table";
