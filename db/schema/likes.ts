import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import users from "./users";
import recipes from "./recipes";

const likes = pgTable('likes', {
    userId: integer('user_id').notNull().references(() => users.id),
    recipeId: integer('recipe_id').notNull().references(() => recipes.id),
}, (table) => ({
    pk: primaryKey({ columns: [table.userId, table.recipeId] })
}))

export default likes;