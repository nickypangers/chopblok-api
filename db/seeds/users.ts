import { eq } from "drizzle-orm";
import * as schema from '../schema';
import usersData from "./data/users.json";
import db from "..";

async function getRoleId(db: db, name: string) {
    let role = await db.query.roles.findFirst({
        where: eq(schema.roles.name, name)
    });
    if (!role) {
        throw new Error("Unkown role: " + name);
    }
    return role.id;
}

export default async function seed(db: db) {
    await Promise.all(usersData.map(async (user) => {
        await db.insert(schema.users).values([{
            ...user,
            roleId: await getRoleId(db, 'Basic'),
        }])
    }));
}