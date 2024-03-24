import { sql } from "drizzle-orm";
import { getTestDB } from "@/__test__";
import {
  testRandomCategory,
  testRandomComponents,
  testRandomFile,
  testRandomLike,
  testRandomUser,
} from "@/__test__/random";

export const createMockTrendComponent = async ({
  draft = false,
  length = 10,
}: {
  draft: boolean;
  length?: number;
}) => {
  const db = await getTestDB();

  await db.execute(sql`TRUNCATE TABLE components CASCADE`);

  const { id } = await testRandomUser();
  const category = await testRandomCategory();
  const components = await testRandomComponents(category.name, length, {
    draft,
    creatorId: id,
  });

  const files = await Promise.all(
    components.map(async (component) => {
      return testRandomFile(component.id);
    })
  );

  const likes = await Promise.all(
    components.map(async (component) => {
      return testRandomLike(component.creatorId, component.id);
    })
  );

  return {
    category,
    components,
    files,
    likes,
  };
};
