import { and, desc, eq, sql } from "drizzle-orm";
import { SelectedFields } from "drizzle-orm/pg-core";
import { DB } from "@/drizzle/db";
import { components } from "@/drizzle/schema";
import { withLimit } from "@/services/helper/pagination";
import { withLikeWeight } from "@/services/likes/count/with";

type WIthTrendComponentProps<T extends SelectedFields> = {
  select: T;
  limit?: number;
  offset?: number;
  category?: string;
};

export const withTrendComponents = <T extends SelectedFields>(
  db: DB,
  { select, limit = 20, offset = 0, category }: WIthTrendComponentProps<T>
) => {
  const with_like_weight = withLikeWeight(db);

  const where = category
    ? and(eq(components.categoryName, category), eq(components.draft, false))
    : eq(components.draft, false);

  const asDynamic = db
    .select({
      ...select,
      count: sql`COALESCE(${with_like_weight.count}, 0)`
        .mapWith(Number)
        .as("count"),
      weight: sql`COALESCE(${with_like_weight.weight}, 0)`
        .mapWith(Number)
        .as("weight"),
    })
    .from(components)
    .leftJoin(with_like_weight, eq(components.id, with_like_weight.componentId))
    .where(where)
    .orderBy(desc(sql`COALESCE(${with_like_weight.count}, 0)`))
    .$dynamic();

  const trend_components = db
    .$with("trend_components")
    .as(withLimit(asDynamic, limit, offset));

  return {
    trend_components,
    with_like_weight,
  };
};
