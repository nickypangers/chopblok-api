import db from "$/db";
import { and, eq, ilike } from "drizzle-orm";
import { Hono } from "hono";
import { likes, recipes } from "$/db/schema";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const recipesRoute = new Hono();

const postLikeSchema = z.object({
    userId: z.number().int().min(1),
    recipeId: z.number().int().min(1),
})

recipesRoute
    .get('/', async (c) => {
        let recipes = await db.query.recipes.findMany({
            with: {
                ingredients: true,
                steps: true,
                author: true,
                category: true,
                likes: true,
            }
        });
        return c.json({ data: recipes });
    })

recipesRoute.get('/search', async (c) => {
    const query = c.req.query();

    console.log(query);

    if (Object.keys(query).length == 0) {
        let recipes = await db.query.recipes.findMany({
            with: {
                ingredients: true,
                steps: true,
                author: true,
                category: true,
                likes: true,
            }
        });
        return c.json({ data: recipes });
    }

    let { keyword, authorId, categoryId, recipeType, timeRange } = query;

    let filterArray = [];
    if (keyword) {
        filterArray.push(ilike(recipes.title, `%${keyword}%`));
    }
    if (authorId && !isNaN(Number(authorId))) {
        filterArray.push(eq(recipes.authorId, Number(authorId)));
    }
    if (categoryId && !isNaN(Number(categoryId))) {
        filterArray.push(eq(recipes.categoryId, Number(categoryId)));
    }



    let result = await db.query.recipes.findMany({
        where: and(...filterArray),
        with: {
            ingredients: true,
            steps: true,
            author: true,
            category: true,
            likes: true,
        },
    })

    return c.json({ data: result });
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
            likes: true,
        }
    })
    return c.json({ data: recipe });
})

recipesRoute.post('/:id/likes', zValidator("json", postLikeSchema), async (c) => {
    const { id } = c.req.param();
    const data = c.req.valid("json");

    if (Number(id) != data.recipeId) {
        c.status(400)
        return c.json({ error: true, message: "Invalid recipe id" });
    }

    try {
        let like = await db.insert(likes).values([
            {
                userId: data.userId,
                recipeId: data.recipeId,
            }
        ]).returning();

        return c.json({ data: like });
    } catch (e: any) {
        c.status(400)
        return c.json({ error: true, message: e.message });
    }
})

export default recipesRoute;