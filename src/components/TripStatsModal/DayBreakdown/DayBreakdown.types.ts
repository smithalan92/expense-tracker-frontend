import { DailyCostBreakdownResult } from "@/api.types";

export interface DayBreakdownProps {
  dailyCostBreakdown: DailyCostBreakdownResult[];
}

export type DayBreakdownView = "chart" | "table";
