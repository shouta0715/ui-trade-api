import { count } from "drizzle-orm";
import { DB } from "@/drizzle/db";
import { likes } from "@/drizzle/schema";

export const withLikesCount = (db: DB) => {
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
