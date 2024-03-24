import { and, eq } from "drizzle-orm";
import { runDrizzle } from "@/drizzle/db";
import { components, files, profiles, users } from "@/drizzle/schema";
import { withLikesCount } from "@/services/likes/count/with";
import { Context } from "@/types/env";

export const getPreviewComponents = async (c: Context, id: string) => {
  return runDrizzle(c, async (db) => {
    const with_likes_count = withLikesCount(db, id);

    return db
      .with(with_likes_count)
      .select({
        // components fields
        id: components.id,
        createdAt: components.createdAt,
        draft: components.draft,
        name: components.name,
        categoryName: components.categoryName,
        functionName: components.functionName,

        // files fields
        extension: files.extension,
        filename: files.name,
        fileId: files.id,

        // users fields
        userId: users.id,
        username: users.name,
        image: users.image,

        // profiles fields

        website: profiles.website,
        github: profiles.github,
        twitter: profiles.twitter,

        // likes count
        count: with_likes_count.count,
      })
      .from(components)
      .leftJoin(
        with_likes_count,
        eq(components.id, with_likes_count.componentId)
      )
      .where(and(eq(components.id, id), eq(components.draft, false)))
      .innerJoin(users, eq(components.creatorId, users.id))
      .innerJoin(files, eq(components.id, files.componentId))
      .leftJoin(profiles, eq(users.id, profiles.userId));
  });
};
