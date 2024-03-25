import { Hono } from "hono";

import { toGroupCategories } from "@/domain/categories";
import { toGroupPopularCategories } from "@/domain/categories/popular";
import { NotFoundError, handleApiError } from "@/libs/errors";
import {
  paginationSchema,
  paginationWithSearchSchema,
  transformPagination,
} from "@/libs/schema/paginations";
import { validate } from "@/libs/validation";
import { getCategories, getCategory } from "@/services/category";
import { getCommandTopComponents } from "@/services/category/command";
import { getPopularCategories } from "@/services/category/popular";
import { searchCategory } from "@/services/category/search";
import {
  getTopComponentsInCategory,
  getTopComponentsInCategoryWithCreator,
} from "@/services/components/in-category";
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

categories.get("/search", async (c) => {
  const q = c.req.query("q");
  const l = c.req.query("limit");
  const o = c.req.query("offset");

  try {
    const { limit, offset } = transformPagination(l, o);
    validate({ q, limit, offset }, paginationWithSearchSchema);

    const categoriesData = await searchCategory(c, { q, limit, offset });

    const hasMore = categoriesData.length >= limit;

    return c.json({
      categories: categoriesData,
      hasMore,
    });
  } catch (error) {
    const { message, status } = handleApiError({ error });

    return c.body(message, status);
  }
});

categories.get("/commands", async (c) => {
  const l = c.req.query("limit");

  try {
    const { limit } = transformPagination(l);
    validate({ limit }, paginationSchema);

    const categoriesData = await getCategories(c, limit);

    const names = categoriesData.map((category) => category.name);

    const components = await getCommandTopComponents(c, names);

    return c.json(
      toGroupPopularCategories({ categories: categoriesData, components })
    );
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
      getTopComponentsInCategoryWithCreator(c, [category]),
    ]);

    if (!categoryData) throw new NotFoundError();

    return c.json(toGroupCategories({ category: categoryData, components }));
  } catch (error) {
    const { message, status } = handleApiError({ error });

    return c.body(message, status);
  }
});

categories.get("/", async (c) => {
  const l = c.req.query("limit");
  const o = c.req.query("offset");

  try {
    const { limit, offset } = transformPagination(l, o);
    validate({ limit, offset }, paginationSchema);

    const categoriesData = await getCategories(c, limit, offset);

    return c.json(categoriesData);
  } catch (error) {
    const { message, status } = handleApiError({ error });

    return c.body(message, status);
  }
});

export { categories as categoriesRouter };
