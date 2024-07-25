import { integer, pgTable, serial, text, unique } from "drizzle-orm/pg-core";
import recipes from "./recipes";
import { relations } from "drizzle-orm";

const steps = pgTable('steps', {
    id: serial('id').primaryKey(),
    recipeId: integer('recipe_id').notNull().references(() => recipes.id),
    order: integer('order').notNull(),
    description: text('description').notNull(),
    imageUrl: text('image_url'),
}, (table) => ({
    rIdOrder1: unique().on(table.recipeId, table.order),
}))

export const stepsRelations = relations(steps, ({ one }) => ({
    recipes: one(recipes, {
        fields: [steps.recipeId],
        references: [recipes.id],
        relationName: 'recipe_steps',
    }),
}))

export default steps;