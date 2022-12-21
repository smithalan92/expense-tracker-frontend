import { useState } from "react";
import { UserBreakdownProps, UserBreakdownView } from "./UserBreakdown.types";
import UserBreakdownTable from "./UserBreakdownTable";
import UserBreakdownBarChart from "./UserBreakdownBarChart";
import StatSection from "@/components/StatSection/StatSection";

export default function UserBreakdown({ userBreakdown }: UserBreakdownProps) {
  const [activeTab, setActiveTab] = useState<UserBreakdownView>("chart");

  const onClickChartTab = () => {
    setActiveTab("chart");
  };

  const onClickTableTab = () => {
    setActiveTab("table");
  };

  return (
    <StatSection title="Expense Breakdown By User">
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
          <UserBreakdownBarChart userBreakdown={userBreakdown} />
        )}
        {activeTab === "table" && (
          <UserBreakdownTable userBreakdown={userBreakdown} />
        )}
      </div>
    </StatSection>
  );
}
