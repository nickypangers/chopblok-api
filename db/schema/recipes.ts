import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import users from "./users";
import categories from "./categories";
import { relations } from "drizzle-orm";
import ingredients from "./ingredients";
import steps from "./steps";
import likes from "./likes";

const recipes = pgTable('recipes', {
    id: serial('id').primaryKey(),
    authorId: integer('author_id').notNull().references(() => users.id),
    title: text('title').notNull(),
    subtitle: text('subtitle').default(''),
    description: text('description').notNull(),
    imageUrl: text('image_url').notNull(),
    categoryId: integer('category_id').notNull().references(() => categories.id),
    durationInMinutes: integer('duration_in_minutes').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
})

export const recipesRelations = relations(recipes, ({ one, many }) => ({
    author: one(users, {
        fields: [recipes.authorId],
        references: [users.id],
        relationName: 'recipe_author',
    }),
    category: one(categories, {
        fields: [recipes.categoryId],
        references: [categories.id],
        relationName: 'recipe_category',
    }),
    ingredients: many(ingredients, {
        relationName: 'recipe_ingredients',
    }),
    steps: many(steps, {
        relationName: 'recipe_steps',
    }),
    likes: many(likes),
}))

export default recipes;