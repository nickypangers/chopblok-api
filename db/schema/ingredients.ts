import { integer, pgTable, serial, text, unique } from "drizzle-orm/pg-core";
import recipes from "./recipes";
import { relations } from "drizzle-orm";

const ingredients = pgTable('ingredients', {
    id: serial('id').primaryKey(),
    recipeId: integer('recipe_id').notNull().references(() => recipes.id),
    name: text('name').notNull(),
    quantity: text('quantity').notNull(),
    imageUrl: text('image_url'),
}, (table) => ({
    rIdName1: unique().on(table.recipeId, table.name),
}))

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
    recipe: one(recipes, {
        fields: [ingredients.recipeId],
        references: [recipes.id],
        relationName: 'recipe_ingredients',
    }),
}))

export default ingredients;