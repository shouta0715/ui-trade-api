import { eq, desc, sql } from "drizzle-orm";

import { SelectedFields } from "drizzle-orm/pg-core";
import { DB } from "@/drizzle/db";
import { categories } from "@/drizzle/schema";
import { withComponentsCount } from "@/services/components/count/with";
import { withLimit } from "@/services/helper/pagination";

type SortedCategoryProps<T extends SelectedFields> = {
  select: T;
  limit?: number;
  offset?: number;
};

export const withPopularCategory = <T extends SelectedFields>(
  db: DB,
  { select, limit = 20, offset = 0 }: SortedCategoryProps<T>
) => {
  const components_count = withComponentsCount(db);

  const asDynamic = db
    .select({
      ...select,
      count: sql`COALESCE(${components_count.count}, 0)`
        .mapWith(Number)
        .as("count"),
    })
    .from(categories)
    .leftJoin(
      components_count,
      eq(categories.name, components_count.categoryName)
    )
    .orderBy(desc(sql`COALESCE(${components_count.count}, 0)`))
    .$dynamic();

  const popular_categories = db
    .$with("popular_categories")
    .as(withLimit(asDynamic, limit, offset));

  return {
    popular_categories,
    components_count,
  };
};
