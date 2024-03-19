import { Hono } from "hono";
import { Env } from "./types/env";
import { componentsRouter } from "@/routers/components";

const app = new Hono<Env>();

app.route("/components", componentsRouter);

export default app;
