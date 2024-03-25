import { desc, eq, ilike } from "drizzle-orm";
import { runDrizzle } from "@/drizzle/db";
import { categories } from "@/drizzle/schema";
import { withComponentsCount } from "@/services/components/count/with";
import { withLimit } from "@/services/helper/pagination";
import { Context } from "@/types/env";

type SearchCategory = {
  q?: string;
  limit?: number;
  offset?: number;
};

export const searchCategory = async (
  c: Context,
  { q = "", limit = 20, offset = 0 }: SearchCategory
) => {
  return runDrizzle(c, async (db) => {
    const with_components_count = withComponentsCount(db);

    const query = db
      .with(with_components_count)
      .select({
        name: categories.name,
        count: with_components_count.count,
      })
      .from(categories)
      .innerJoin(
        with_components_count,
        eq(categories.name, with_components_count.categoryName)
      )
      .where(ilike(categories.name, `%${q}%`))
      .orderBy(desc(with_components_count.count))
      .$dynamic();

    return withLimit(query, limit, offset);
  });
};
