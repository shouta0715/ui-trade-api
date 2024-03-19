import { Hono } from "hono";
import { toGroupComponent } from "@/domain/components/to-group";
import { NotFoundError, handleApiError } from "@/libs/errors";
import {
  paginationSchema,
  transformPagination,
} from "@/libs/schema/paginations";
import { validate } from "@/libs/validation";
import { getComponentCreator } from "@/services/components/creator";
import { getPopularComponents } from "@/services/components/popular";
import { getPreviewComponents } from "@/services/components/previews";
import { getTrendComponents } from "@/services/components/trend";
import { Env } from "@/types/env";

const components = new Hono<Env>();

components.get("/popular", async (c) => {
  const l = c.req.query("limit");
  const o = c.req.query("offset");

  try {
    const { limit, offset } = transformPagination(l, o);
    validate({ limit, offset }, paginationSchema);

    const data = await getPopularComponents(c, limit, offset);

    return c.json(toGroupComponent(data));
  } catch (error) {
    const { message, status } = handleApiError({ error });

    return c.body(message, status);
  }
});

components.get("/trend", async (c) => {
  const l = c.req.query("limit");
  const o = c.req.query("offset");
  const category = c.req.query("category");

  try {
    const { limit, offset } = transformPagination(l, o);
    validate({ limit, offset }, paginationSchema);

    const data = await getTrendComponents({
      c,
      limit,
      offset,
      category,
    });

    return c.json(toGroupComponent(data));
  } catch (error) {
    const { message, status } = handleApiError({ error });

    return c.body(message, status);
  }
});

components.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const data = await getPreviewComponents(c, id);

    if (data.length === 0) throw new NotFoundError();

    const group = toGroupComponent(data);

    return c.json(group[0]);
  } catch (error) {
    const { message, status } = handleApiError({ error });

    return c.body(message, status);
  }
});

components.get("/:id/creator", async (c) => {
  const id = c.req.param("id");
  try {
    const data = await getComponentCreator(c, id);

    return c.json(data[0]);
  } catch (error) {
    const { message, status } = handleApiError({ error });

    return c.body(message, status);
  }
});

export { components as componentsRouter };
