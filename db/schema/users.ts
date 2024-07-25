import { index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import roles from "./roles";
import { relations } from "drizzle-orm";
import recipes from "./recipes";

const users = pgTable("users", {
    id: serial('id').primaryKey(),
    username: text('username').unique().notNull(),
    email: text('email').unique().notNull(),
    passwordHash: text('password').notNull(),
    roleId: integer('role_id').notNull().references(() => roles.id),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
}, (table) => ({
    usernameIdx: index('username_idx').on(table.username),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id],
        relationName: 'user_role',
    }),
    recipes: many(recipes, {
        relationName: 'recipe_author',
    })
}))

export default users;