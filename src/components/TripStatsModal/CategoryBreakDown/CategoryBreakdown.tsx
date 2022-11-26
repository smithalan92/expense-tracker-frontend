import { useState } from "react";
import {
  CategoryBreakdownProps,
  CategoryBreakdownView,
} from "./CategoryBreakdown.types";
import CategoryBreakdownTable from "./CategoryBreakdownTable";
import CategoryBreakDownPieChart from "./CategoryBreakDownPieChart";
import ExpandableSection from "@/components/ExpandableSection/ExpandableSection";

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
    <ExpandableSection title="Expense Category Breakdown">
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
    </ExpandableSection>
  );
}
