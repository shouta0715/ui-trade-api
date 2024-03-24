import { desc, eq } from "drizzle-orm";
import { runDrizzle } from "@/drizzle/db";
import { components, files, users } from "@/drizzle/schema";
import { withPopularComponents } from "@/services/components/ranking/with";
import { Context } from "@/types/env";

export const getRankingComponents = async (
  c: Context,
  limit = 20,
  offset = 0
) => {
  return runDrizzle(c, async (db) => {
    const { popular_components, likes_count } = withPopularComponents(db, {
      select: {
        id: components.id,
        name: components.name,
        previewUrl: components.previewUrl,
        createdAt: components.createdAt,
        creatorId: components.creatorId,
      },
      limit,
      offset,
    });

    return db
      .with(likes_count, popular_components)
      .select({
        id: popular_components.id,
        name: popular_components.name,
        previewUrl: popular_components.previewUrl,
        createdAt: popular_components.createdAt,
        extension: files.extension,
        count: popular_components.count,
        userId: users.id,
        username: users.name,
        image: users.image,
      })
      .from(popular_components)
      .innerJoin(files, eq(files.componentId, popular_components.id))
      .innerJoin(users, eq(users.id, popular_components.creatorId))
      .orderBy(
        desc(popular_components.count),
        desc(popular_components.createdAt)
      );
  });
};
