import db from "$/db";
import { recipes } from "$/db/schema";
import { Hono } from "hono";

const usersRoute = new Hono();

usersRoute.get('/', async (c) => {
    let users = await db.query.users.findMany({});
    return c.json({ users });
})

export default usersRoute;