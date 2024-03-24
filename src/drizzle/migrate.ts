/* eslint-disable no-console */
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";
import * as schema from "./schema";

async function main() {
  const client = new Client(process.env.DB_URL);

  await client.connect();

  const db = drizzle(client, { schema, logger: true });

  await migrate(db, { migrationsFolder: "src/drizzle" });
}

main()
  .then(() => {
    console.log("Migrations complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
