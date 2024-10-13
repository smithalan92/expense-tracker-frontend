import { CountryBreakdownResult } from "@/api";
import StatSection from "@/components/sections/StatSection/StatSection";
import { useState } from "react";
import CountryBreakdownPieChart from "./CountryBreakdownPieChart";
import CountryBreakdownTable from "./CountryBreakdownTable";

export default function CountryBreakdown({
  countryBreakdown,
}: CountryBreakdownProps) {
  const [activeTab, setActiveTab] = useState<CountryBreakdownView>("chart");

  const onClickChartTab = () => {
    setActiveTab("chart");
  };

  const onClickTableTab = () => {
    setActiveTab("table");
  };

  return (
    <StatSection title="Expense Country Breakdown">
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
          <CountryBreakdownPieChart countryBreakdown={countryBreakdown} />
        )}
        {activeTab === "table" && (
          <CountryBreakdownTable countryBreakdown={countryBreakdown} />
        )}
      </div>
    </StatSection>
  );
}

export interface CountryBreakdownProps {
  countryBreakdown: CountryBreakdownResult[];
}

export type CountryBreakdownView = "chart" | "table";
