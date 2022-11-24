import { CategoryBreakdownResult } from "@/api.types";

export interface CategoryBreakdownProps {
  categoryBreakdown: CategoryBreakdownResult[];
}

export type CategoryBreakdownView = "chart" | "table";
