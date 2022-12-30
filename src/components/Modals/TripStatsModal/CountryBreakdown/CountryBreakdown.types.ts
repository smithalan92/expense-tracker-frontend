import { CountryBreakdownResult } from "@/api.types";

export interface CountryBreakdownProps {
  countryBreakdown: CountryBreakdownResult[];
}

export type CountryBreakdownView = "chart" | "table";
