import { and, eq } from "drizzle-orm";
import { runDrizzle } from "@/drizzle/db";
import { components, users } from "@/drizzle/schema";
import { withUniqueByCategory } from "@/services/components/in-category/with";
import { Context } from "@/types/env";

export const getTopComponentsInCategory = async (
  c: Context,
  categories: string[]
) => {
  return runDrizzle(c, async (db) => {
    const { with_likes_count, with_ranked_components } = withUniqueByCategory(
      db,
      {
        select: {
          id: components.id,
          previewUrl: components.previewUrl,
          categoryName: components.categoryName,
        },
        categories,
      }
    );

    const data = db
      .with(with_likes_count, with_ranked_components)
      .select({
        id: with_ranked_components.id,
        previewUrl: with_ranked_components.previewUrl,
        categoryName: with_ranked_components.categoryName,
      })
      .from(with_ranked_components)

      .where(and(eq(with_ranked_components.row, 1)));

    return data;
  });
};

export const getTopComponentsInCategoryWithCreator = async (
  c: Context,
  categories: string[]
) => {
  return runDrizzle(c, async (db) => {
    const { with_likes_count, with_ranked_components } = withUniqueByCategory(
      db,
      {
        select: {
          id: components.id,
          previewUrl: components.previewUrl,
          categoryName: components.categoryName,
          creatorId: components.creatorId,
        },
        categories,
      }
    );

    const data = db
      .with(with_likes_count, with_ranked_components)
      .select({
        id: with_ranked_components.id,
        previewUrl: with_ranked_components.previewUrl,
        categoryName: with_ranked_components.categoryName,
        creatorId: with_ranked_components.creatorId,
        creatorName: users.name,
        image: users.image,
      })
      .from(with_ranked_components)
      .innerJoin(users, eq(with_ranked_components.creatorId, users.id))
      .where(and(eq(with_ranked_components.row, 1)));

    return data;
  });
};
