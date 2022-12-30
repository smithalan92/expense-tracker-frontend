import { HourlySpendingResult } from "@/api.types";

export interface HourlySpendingBreakdownProps {
  hourlySpendingBreakdown: HourlySpendingResult[];
}

export type BreakdownView = "chart" | "table";
