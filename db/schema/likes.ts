import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import users from "./users";
import recipes from "./recipes";
import { relations } from "drizzle-orm";

const likes = pgTable('likes', {
    userId: integer('user_id').notNull().references(() => users.id),
    recipeId: integer('recipe_id').notNull().references(() => recipes.id),
}, (table) => ({
    pk: primaryKey({ columns: [table.userId, table.recipeId] })
}))

export const likesRelations = relations(likes, ({ one }) => ({
    user: one(users, {
        fields: [likes.userId],
        references: [users.id],
    }),
    recipe: one(recipes, {
        fields: [likes.recipeId],
        references: [recipes.id],
    }),
}))

export default likes;