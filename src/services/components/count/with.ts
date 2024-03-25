import { count, eq } from "drizzle-orm";
import { DB } from "@/drizzle/db";
import { components } from "@/drizzle/schema";

export const withComponentsCount = (db: DB) => {
  return db.$with("with_components_count").as(
    db
      .select({
        count: count().as("count"),
        categoryName: components.categoryName,
      })
      .from(components)
      .groupBy(components.categoryName)
  );
};

export const withComponentCount = (db: DB, categoryName: string) => {
  return db.$with("with_component_count").as(
    db
      .select({
        categoryName: components.categoryName,
        count: count().as("count"),
      })
      .from(components)
      .where(eq(components.categoryName, categoryName))
      .groupBy(components.categoryName)
  );
};
