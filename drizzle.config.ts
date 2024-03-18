import "dotenv/config"; // make sure to install dotenv package
import type { Config } from "drizzle-kit";

const dbCredentials = {
  host: "127.0.0.1",
  port: 54322,
  user: "postgres",
  password: "postgres",
  database: "postgres",
};

export default {
  driver: "pg",
  out: "./src/drizzle",
  schema: "./src/drizzle/schema.ts",
  dbCredentials,
  verbose: true,
  strict: true,
} satisfies Config;
