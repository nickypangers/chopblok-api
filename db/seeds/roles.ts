import db from "..";
import rolesData from "./data/roles.json";
import { roles } from "../schema";

export default async function seed(db: db) {
    await db.insert(roles).values(rolesData);
}