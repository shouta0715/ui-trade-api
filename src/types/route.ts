import { Context } from "@/types/env";

export type PaginationRoute = {
  c: Context;
  limit?: number;
  offset?: number;
};
