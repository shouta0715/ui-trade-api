/* eslint-disable consistent-return */
import { drizzle } from "drizzle-orm/node-postgres";
import { Context } from "hono";
import { Client } from "pg";
import { Env } from "../types/env";
import * as schema from "./schema";

export const getDB = async (env: string) => {
  const client = new Client(env);

  await client.connect();

  return drizzle(client, { schema });
};

export type DB = Awaited<ReturnType<typeof getDB>>;

export const runDrizzle = async <T>(
  { env }: Context<Env>,
  fn: (db: DB) => Promise<T>
) => {
  const db = await getDB(env.DB_URL);

  return fn(db);
};
