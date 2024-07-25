import db from "$/db";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { recipes } from "$/db/schema";

const recipesRoute = new Hono();

recipesRoute
    .get('/', async (c) => {
        let recipes = await db.query.recipes.findMany({
            with: {
                ingredients: true,
                steps: true,
                author: true,
                category: true,
            }
        });
        return c.json({ recipes });
    })

recipesRoute.get('/:id', async (c) => {
    let { id } = c.req.param();
    let recipe = await db.query.recipes.findFirst({
        where: eq(recipes.id, Number(id)),
        with: {
            ingredients: true,
            steps: true,
            author: true,
            category: true,
        }
    })
    return c.json({ recipe });
})

export default recipesRoute;