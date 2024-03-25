import { and, eq, inArray, sql } from "drizzle-orm";
import { SelectedFields } from "drizzle-orm/pg-core";
import { DB } from "@/drizzle/db";
import { components } from "@/drizzle/schema";
import { withLikesCounts } from "@/services/likes/count/with";

type SortedComponentsProps<T extends SelectedFields> = {
  select: T;
  categories: string[];
};

export const withUniqueByCategory = <T extends SelectedFields>(
  db: DB,
  { select, categories }: SortedComponentsProps<T>
) => {
  const with_likes_count = withLikesCounts(db);

  const with_ranked_components = db.$with("with_ranked_components").as(
    db
      .select({
        ...select,
        row: sql`ROW_NUMBER() OVER(PARTITION BY ${components.categoryName} ORDER BY ${with_likes_count.count} DESC)`
          .mapWith(Number)
          .as("row"),
      })
      .from(components)
      .where(
        and(
          eq(components.draft, false),
          inArray(components.categoryName, categories)
        )
      )
      .leftJoin(
        with_likes_count,
        eq(components.id, with_likes_count.componentId)
      )
  );

  return {
    with_ranked_components,
    with_likes_count,
  };
};
