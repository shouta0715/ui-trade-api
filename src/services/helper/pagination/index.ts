import { PgSelect } from "drizzle-orm/pg-core";

export const withLimit = <T extends PgSelect>(
  qb: T,
  limit = 20,
  offset = 0
) => {
  return qb.limit(limit).offset(offset);
};
