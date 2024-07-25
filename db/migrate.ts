import { migrate } from "drizzle-orm/postgres-js/migrator";
import config from "$/drizzle.config";
import db, { connection } from ".";

if (!process.env.DB_MIGRATING) {
    throw new Error("DB_MIGRATING environment variable is not set");
}

migrate(db, { migrationsFolder: config.out! })
    .then(() => connection.end())
    .then(() => console.log("Database migration completed successfully"));