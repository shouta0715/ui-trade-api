import { Hono } from "hono";

import { toGroupCategories } from "@/domain/categories";
import { toGroupPopularCategories } from "@/domain/categories/popular";
import { NotFoundError, handleApiError } from "@/libs/errors";
import {
  paginationSchema,
  transformPagination,
} from "@/libs/schema/paginations";
import { validate } from "@/libs/validation";
import { getCategory } from "@/services/category";
import { getPopularCategories } from "@/services/category/popular";
import { getTopComponentsInCategory } from "@/services/components/in-category";
import { Env } from "@/types/env";

const categories = new Hono<Env>();

categories.get("/popular", async (c) => {
  const l = c.req.query("limit");
  const o = c.req.query("offset");

  try {
    const { limit, offset } = transformPagination(l, o);
    validate({ limit, offset }, paginationSchema);

    const categoriesData = await getPopularCategories(c, limit, offset);
    const names = categoriesData.map((category) => category.name);
    const components = await getTopComponentsInCategory(c, names);

    const grouped = toGroupPopularCategories({
      categories: categoriesData,
      components,
    });

    return c.json(grouped);
  } catch (error) {
    const { message, status } = handleApiError({ error });

    return c.body(message, status);
  }
});

categories.get("/:category", async (c) => {
  const category = c.req.param("category");

  try {
    const [categoryData, components] = await Promise.all([
      getCategory(c, category),
      getTopComponentsInCategory(c, [category]),
    ]);

    if (!categoryData) throw new NotFoundError();

    return c.json(toGroupCategories({ category: categoryData, components }));
  } catch (error) {
    const { message, status } = handleApiError({ error });

    return c.body(message, status);
  }
});

export { categories as categoriesRouter };
