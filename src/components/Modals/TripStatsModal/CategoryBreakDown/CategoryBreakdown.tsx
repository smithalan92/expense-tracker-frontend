import { CategoryBreakdownResult } from "@/api";
import StatSection from "@/components/sections/StatSection/StatSection";
import { useState } from "react";
import CategoryBreakDownPieChart from "./CategoryBreakDownPieChart";
import CategoryBreakdownTable from "./CategoryBreakdownTable";

export default function CategoryBreakdown({
  categoryBreakdown,
}: CategoryBreakdownProps) {
  const [activeTab, setActiveTab] = useState<CategoryBreakdownView>("chart");

  const onClickChartTab = () => {
    setActiveTab("chart");
  };

  const onClickTableTab = () => {
    setActiveTab("table");
  };

  return (
    <StatSection title="Expense Category Breakdown">
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
          <CategoryBreakDownPieChart categoryBreakdown={categoryBreakdown} />
        )}
        {activeTab === "table" && (
          <CategoryBreakdownTable categoryBreakdown={categoryBreakdown} />
        )}
      </div>
    </StatSection>
  );
}

export interface CategoryBreakdownProps {
  categoryBreakdown: CategoryBreakdownResult[];
}

export type CategoryBreakdownView = "chart" | "table";
