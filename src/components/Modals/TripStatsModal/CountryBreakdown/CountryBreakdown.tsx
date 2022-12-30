import { useState } from "react";
import {
  CountryBreakdownProps,
  CountryBreakdownView,
} from "./CountryBreakdown.types";
import CountryBreakdownTable from "./CountryBreakdownTable";
import CountryBreakdownPieChart from "./CountryBreakdownPieChart";
import StatSection from "@/components/sections/StatSection/StatSection";

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
