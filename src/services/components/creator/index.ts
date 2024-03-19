import { eq } from "drizzle-orm";
import { runDrizzle } from "@/drizzle/db";
import { components } from "@/drizzle/schema";
import { Context } from "@/types/env";

export const getComponentCreator = async (c: Context, id: string) => {
  return runDrizzle(c, async (db) => {
    return db
      .select({
        creatorId: components.creatorId,
      })
      .from(components)
      .where(eq(components.id, id));
  });
};
