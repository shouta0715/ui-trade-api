import dotenv from "dotenv";
import type { Config } from "drizzle-kit";

dotenv.config({
  path: "./.dev.vars",
});

export default {
  driver: "pg",
  out: "./src/drizzle",
  schema: "./src/drizzle/schema.ts",
  dbCredentials: {
    connectionString: process.env.DB_URL as string,
  },
  verbose: true,
  strict: true,
} satisfies Config;
