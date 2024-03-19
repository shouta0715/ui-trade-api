import { count, eq, sql, sum } from "drizzle-orm";
import { DB } from "@/drizzle/db";
import { likes } from "@/drizzle/schema";

export const withLikesCounts = (db: DB) => {
  return db.$with("with_likes_count").as(
    db
      .select({
        count: count().as("count"),
        componentId: likes.componentId,
      })
      .from(likes)
      .groupBy(likes.componentId)
  );
};

export const withLikesCount = (db: DB, componentId: string) => {
  return db.$with("with_likes_count").as(
    db
      .select({
        componentId: likes.componentId,
        count: count().as("count"),
      })
      .from(likes)
      .where(eq(likes.componentId, componentId))
      .groupBy(likes.componentId)
  );
};

export const withLikeWeight = (db: DB) => {
  return db.$with("with_like_weight").as(
    db
      .select({
        count: count().as("count"),
        componentId: likes.componentId,
        weight: sum(
          sql`
            CASE
              WHEN "createdAt" > NOW() - INTERVAL '12 hours' THEN 0.5
              WHEN "createdAt" > NOW() - INTERVAL '24 hours' THEN 0.3
              WHEN "createdAt" > NOW() - INTERVAL '72 hours' THEN 0.1
              ELSE 0
            END
          `
        ).as("weight"),
      })
      .from(likes)
      .groupBy(likes.componentId)
  );
};
