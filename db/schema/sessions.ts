import { relations, sql } from "drizzle-orm";
import { integer, pgTable, serial, timestamp, uuid, } from "drizzle-orm/pg-core";
import users from "./users";

const sessions = pgTable('sessions', {
    userId: serial('user_id').primaryKey(),
    token: uuid('token').defaultRandom(),
    refreshToken: uuid('refresh_token').defaultRandom(),
    createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { mode: 'string' }).notNull().default(sql`NOW() + interval \'1 hour\'`),
})

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    })
}))


export default sessions;