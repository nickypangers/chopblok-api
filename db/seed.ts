import { getTableName, sql, Table } from "drizzle-orm";
import db, { connection } from ".";
import * as schema from "./schema";
import * as seeds from "./seeds";

if (!process.env.DB_SEEDING) {
    throw new Error('You must set DB_SEEDING to "true" when running seeds');
}

async function resetTable(db: db, table: Table) {
    return db.execute(
        sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`)
    );
}

async function main() {
    for (const table of [
        schema.categories,
        schema.ingredients,
        schema.likes,
        schema.recipes,
        schema.roles,
        schema.steps,
        schema.users,
    ]) {
        // await db.delete(table); // clear tables without truncating / resetting ids
        await resetTable(db, table);
    }



    await seeds.categories(db);
    await seeds.roles(db);
    await seeds.users(db);
    await seeds.recipes(db);

    await connection.end();
}

main().then(() => {
    console.log("Seeding complete");
});