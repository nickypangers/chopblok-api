import { relations } from "drizzle-orm";
import { index, pgTable, serial, text } from "drizzle-orm/pg-core";
import users from "./users";

const roles = pgTable("roles", {
    id: serial('id').primaryKey(),
    name: text('name').unique().notNull(),
}, (table) => ({
    roleNameIdx: index('role_name_idx').on(table.name),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(users, {
        relationName: 'user_role',
    }),
}))

export default roles;