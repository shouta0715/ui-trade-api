import { eq, desc, sql } from "drizzle-orm";

import { SelectedFields } from "drizzle-orm/pg-core";
import { DB } from "@/drizzle/db";
import { components } from "@/drizzle/schema";
import { withLimit } from "@/services/helper/pagination";
import { withLikesCounts } from "@/services/likes/count/with";

type SortedComponentsProps<T extends SelectedFields> = {
  select: T;
  limit?: number;
  offset?: number;
};

export const withPopularComponents = <T extends SelectedFields>(
  db: DB,
  { select, limit = 20, offset = 0 }: SortedComponentsProps<T>
) => {
  const likes_count = withLikesCounts(db);

  const asDynamic = db
    .select({
      ...select,
      count: sql`COALESCE(${likes_count.count}, 0)`.mapWith(Number).as("count"),
    })
    .from(components)
    .leftJoin(likes_count, eq(components.id, likes_count.componentId))
    .where(eq(components.draft, false))
    .orderBy(desc(sql`COALESCE(${likes_count.count}, 0)`))
    .$dynamic();

  const popular_components = db
    .$with("popular_components")
    .as(withLimit(asDynamic, limit, offset));

  return {
    popular_components,
    likes_count,
  };
};
