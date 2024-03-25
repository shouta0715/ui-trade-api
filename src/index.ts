import { Hono } from "hono";
import { cors } from "hono/cors";
import { Env } from "./types/env";
import { categoriesRouter } from "@/routers/categories";
import { componentsRouter } from "@/routers/components";

const app = new Hono<Env>();

app.use(
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["GET"],
  })
);

app.route("/components", componentsRouter);
app.route("/categories", categoriesRouter);

export default app;
