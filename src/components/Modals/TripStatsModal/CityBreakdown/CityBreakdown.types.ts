import { CityBreakdownResult } from "@/api.types";

export interface CityBreakdownProps {
  cityBreakdown: CityBreakdownResult[];
}

export type CityBreakdownView = "chart" | "table";
