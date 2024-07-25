import { relations } from "drizzle-orm";
import { index, pgTable, serial, text } from "drizzle-orm/pg-core";
import recipes from "./recipes";

const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: text('name').unique().notNull(),
}, (table) => ({
    categoryNameIdx: index('category_name_idx').on(table.name),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
    recipes: many(recipes, {
        relationName: 'recipe_category',
    }),
}))

export default categories;