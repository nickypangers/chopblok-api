import db from '$/db';
import sessions from '$/db/schema/sessions';
import { eq } from 'drizzle-orm';
import { createMiddleware } from 'hono/factory'

const authMiddleware = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
        c.status(401);
        return c.json({ error: true, message: "Authorization header is required" });
    }
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') {
        c.status(401);
        return c.json({ error: true, message: "Invalid authorization type" });
    }

    if (!token) {
        c.status(401);
        return c.json({ error: true, message: "Token is required" });
    }

    // Check if token is valid
    try {
        const session = await db.query.sessions.findFirst({
            where: eq(sessions.token, token),
        });

        if (!session) {
            c.status(401);
            return c.json({ error: true, message: "Invalid token" });
        }

        console.log(session);

        await next();
    } catch (e) {
        c.status(401);
        return c.json({ error: true, message: (e as Error).message });
    }

})