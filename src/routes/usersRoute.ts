import db from "$/db";
import { users } from "$/db/schema";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const usersRoute = new Hono();

usersRoute.get('/', async (c) => {
    let users = await db.query.users.findMany({});
    return c.json({ data: users });
})

usersRoute.get('/:username', async (c) => {
    const { username } = c.req.param();
    let user = await db.query.users.findFirst({
        where: eq(users.username, username),
        with: {
            role: true,
            recipes: {
                with: {
                    ingredients: true,
                    steps: true,
                    author: true,
                    category: true,
                    likes: true,
                }
            }
        }
    })
    return c.json({ data: user });
})

export default usersRoute;