import { getTestDB } from "@/__test__";
import {
  categories,
  components,
  files,
  likes,
  profiles,
  users,
} from "@/drizzle/schema";
import { randomBool, randomExtension, randomString } from "@/utils/random";

export const testRandomUser = async () => {
  const db = await getTestDB();
  const values = await db
    .insert(users)
    .values({
      id: randomString(),
      email: randomString(),
      name: randomString(),
      image: randomString(),
    })
    .onConflictDoNothing()
    .returning();

  return values[0];
};

export const testRandomCategory = async (
  value?: typeof categories.$inferInsert
) => {
  const db = await getTestDB();
  const name = randomString();
  const description = randomString();

  const values = await db
    .insert(categories)
    .values({
      name,
      description,
      ...value,
    })
    .onConflictDoNothing()
    .returning();

  return values[0];
};

export const testRandomProfile = async (
  userId: string,
  value?: typeof profiles.$inferInsert
) => {
  const db = await getTestDB();
  const values = await db
    .insert(profiles)
    .values({
      userId,
      website: randomString(),
      github: randomString(),
      twitter: randomString(),
      ...value,
    })
    .onConflictDoNothing()
    .returning();

  return values[0];
};

export const testRandomComponent = async (
  name: string,
  value?: typeof components.$inferInsert
) => {
  const db = await getTestDB();

  const defaultValues: typeof components.$inferInsert = {
    categoryName: name,
    name: randomString(),
    description: randomString(),
    document: randomString(),
    previewUrl: randomString(),
    creatorId: randomString(),
    draft: randomBool(),
    functionName: randomString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: randomString(),
    ...value,
  };

  const res = await db
    .insert(components)
    .values({
      ...defaultValues,
    })
    .onConflictDoNothing()
    .returning();

  return res[0];
};

export const testRandomComponents = async (
  name: string,
  length = 5,
  value?: Partial<typeof components.$inferInsert>
) => {
  const insertValues = Array.from({ length }).map(() => {
    return {
      categoryName: name,
      name: randomString(),
      description: randomString(),
      document: randomString(),
      previewUrl: randomString(),
      creatorId: randomString(),
      draft: randomBool(),
      functionName: randomString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: randomString(),
      ...value,
    };
  });

  const db = await getTestDB();

  const res = await db
    .insert(components)
    .values(insertValues)
    .onConflictDoNothing()
    .returning();

  return res;
};

export const testRandomFile = async (componentId: string) => {
  const db = await getTestDB();

  const values = await db
    .insert(files)
    .values({
      componentId,
      name: randomString(),
      extension: randomExtension(),
      objectId: randomString(),
    })
    .onConflictDoNothing()
    .returning();

  return values[0];
};

export const testRandomLike = async (userId: string, componentId: string) => {
  const db = await getTestDB();

  return db
    .insert(likes)
    .values({
      userId,
      componentId,
    })
    .onConflictDoNothing()
    .execute();
};
