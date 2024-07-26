import db from "$/db";
import { Hono } from "hono";

const usersRoute = new Hono();

usersRoute.get('/', async (c) => {
    let users = await db.query.users.findMany({});
    return c.json({ data: users });
})

export default usersRoute;