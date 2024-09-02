import db from "$/db";
import { sessions, users } from "$/db/schema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

const authRoute = new Hono();

const postSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

authRoute.post('/', zValidator('json', postSchema), async (c) => {
    const { email, password } = c.req.valid('json');

    try {
        let user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user || user.passwordHash !== password) {
            c.status(404);
            return c.json({ error: true, message: "Invalid credentials" });
        }

        const date = new Date();

        const session = await db.insert(sessions).values({
            userId: user.id,
        })
            .onConflictDoUpdate({
                target: sessions.userId,
                set: {
                    token: crypto.randomUUID(),
                    refreshToken: crypto.randomUUID(),
                    createdAt: date.toISOString(),
                    expiresAt: new Date(date.getTime() + (60 * 60 * 1000)).toISOString(),
                }
            }).returning();

        return c.json({ data: { session: session[0], username: user.username } });

    } catch (e) {
        c.status(404);
        return c.json({ error: true, message: e });
    }
})

export default authRoute;