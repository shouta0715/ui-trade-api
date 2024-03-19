import { Hono } from "hono";
import { toGroupComponent } from "@/domain/components/to-group";
import { handleApiError } from "@/libs/errors";
import {
  paginationSchema,
  transformPagination,
} from "@/libs/schema/paginations";
import { validate } from "@/libs/validation";
import { getPopularComponents } from "@/services/components/popular";
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

export { components as componentsRouter };
