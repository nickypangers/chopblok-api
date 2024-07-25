import { eq } from "drizzle-orm";
import db from "..";
import * as schema from '../schema';
import recipesData from "./data/recipes.json";
import stepsData from "./data/steps.json";
import ingredientsData from "./data/ingredients.json";

async function getCategoryId(db: db, name: string) {
    let category = await db.query.categories.findFirst({
        where: eq(schema.categories.name, name)
    });
    if (!category) {
        throw new Error("Unkown category: " + name);
    }
    return category.id;
}

export default async function seed(db: db) {
    await Promise.all(recipesData.map(async (recipe) => {
        let [recipeResult] = await db.insert(schema.recipes).values(
            [
                {
                    ...recipe,
                    authorId: 1,
                    categoryId: await getCategoryId(db, 'Breakfast'),
                }
            ]
        ).returning();

        let steps = stepsData[recipeResult.title as "Lobster Bisque" | "Pumpkin Pie"];
        let ingredients = ingredientsData[recipeResult.title as "Lobster Bisque" | "Pumpkin Pie"];

        await db.insert(schema.steps).values(
            steps.map((step) => ({
                ...step,
                recipeId: recipeResult.id,
            }))
        );
        await db.insert(schema.ingredients).values(
            ingredients.map((ingredient) => ({
                ...ingredient,
                recipeId: recipeResult.id,
            }))
        );
    }));
}