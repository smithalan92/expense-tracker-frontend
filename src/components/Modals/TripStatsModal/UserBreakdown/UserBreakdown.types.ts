import { UserBreakdownResult } from "@/api.types";

export interface UserBreakdownProps {
  userBreakdown: UserBreakdownResult[];
}

export type UserBreakdownView = "chart" | "table";
