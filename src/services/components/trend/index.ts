import { desc, eq } from "drizzle-orm";
import { runDrizzle } from "@/drizzle/db";
import { components, files, users } from "@/drizzle/schema";
import { withTrendComponents } from "@/services/components/trend/with";
import { PaginationRoute } from "@/types/route";

export const getTrendComponents = async ({
  c,
  ...pagination
}: PaginationRoute & { category?: string }) => {
  return runDrizzle(c, async (db) => {
    const { with_like_weight, trend_components } = withTrendComponents(db, {
      select: {
        id: components.id,
        name: components.name,
        previewUrl: components.previewUrl,
        createdAt: components.createdAt,
        creatorId: components.creatorId,
      },
      ...pagination,
    });

    return db
      .with(with_like_weight, trend_components)
      .select({
        id: trend_components.id,
        name: trend_components.name,
        previewUrl: trend_components.previewUrl,
        createdAt: trend_components.createdAt,
        extension: files.extension,
        count: trend_components.count,
        weight: trend_components.weight,
        userId: users.id,
        username: users.name,
        image: users.image,
      })
      .from(trend_components)
      .innerJoin(users, eq(users.id, trend_components.creatorId))
      .innerJoin(files, eq(files.componentId, trend_components.id))
      .orderBy(desc(trend_components.weight), desc(trend_components.createdAt));
  });
};
