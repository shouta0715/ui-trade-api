import { Context as TC } from "hono";

export type Env = {
  Bindings: {
    DB_URL: string;
  };
};

export type Context = TC<Env>;
