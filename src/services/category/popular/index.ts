import { desc } from "drizzle-orm";
import { runDrizzle } from "@/drizzle/db";
import { categories } from "@/drizzle/schema";
import { withPopularCategory } from "@/services/category/popular/with";
import { Context } from "@/types/env";

export const getPopularCategories = async (
  c: Context,
  limit = 20,
  offset = 0
) => {
  return runDrizzle(c, async (db) => {
    const { popular_categories, components_count } = withPopularCategory(db, {
      select: {
        name: categories.name,
        description: categories.description,
      },
      limit,
      offset,
    });

    const categoriesResult = await db
      .with(components_count, popular_categories)
      .select({
        name: popular_categories.name,
        description: popular_categories.description,
        count: popular_categories.count,
      })
      .from(popular_categories)
      .orderBy(desc(popular_categories.count));

    return categoriesResult;
  });
};
