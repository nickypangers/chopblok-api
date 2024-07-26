import db from "$/db";
import { Hono } from "hono";

const categoriesRoute = new Hono();

categoriesRoute
    .get('/', async (c) => {
        let categories = await db.query.categories.findMany({
        });
        return c.json({ data: categories });
    })


export default categoriesRoute;