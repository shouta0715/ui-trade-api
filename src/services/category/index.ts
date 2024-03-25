import { desc, eq } from "drizzle-orm";
import { runDrizzle } from "@/drizzle/db";
import { categories } from "@/drizzle/schema";
import {
  withComponentCount,
  withComponentsCount,
} from "@/services/components/count/with";
import { Context } from "@/types/env";

export const getCategory = async (c: Context, name: string) => {
  return runDrizzle(c, async (db) => {
    const with_component_count = withComponentCount(db, name);

    const data = await db
      .with(with_component_count)
      .select({
        name: with_component_count.categoryName,
        description: categories.description,
        count: with_component_count.count,
      })
      .from(categories)
      .innerJoin(
        with_component_count,
        eq(categories.name, with_component_count.categoryName)
      );

    return data[0];
  });
};

export const getCategories = async (c: Context, limit = 20, offset = 0) => {
  return runDrizzle(c, async (db) => {
    const with_component_count = withComponentsCount(db);

    const query = db
      .with(with_component_count)
      .select({
        name: categories.name,
        description: categories.description,
        count: with_component_count.count,
      })
      .from(categories)
      .innerJoin(
        with_component_count,
        eq(categories.name, with_component_count.categoryName)
      )
      .orderBy(desc(with_component_count.count))
      .$dynamic();

    return query.limit(limit).offset(offset);
  });
};
