import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "@/drizzle/schema";

export const getTestDB = async () => {
  const client = new Client(process.env.DB_URL as string);

  await client.connect();

  return drizzle(client, { schema, logger: true });
};

export const MOCK_ENV = {
  DB_URL: process.env.DB_URL,
};
