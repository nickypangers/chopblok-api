import db from "..";
import categoriesData from "./data/categories.json";
import { categories } from "../schema";

export default async function seed(db: db) {
    await db.insert(categories).values(categoriesData);
}