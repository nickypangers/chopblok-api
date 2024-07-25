import { Hono } from "hono";
import { z } from "zod";
import usersRoute from "./routes/usersRoute";
import recipesRoute from "./routes/recipesRoute";



const categorySchema = z.object({
  id: z.number().int(),
  name: z.string().max(100),
});

type Category = z.infer<typeof categorySchema>;

const recipeSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  title: z.string().max(255),
  description: z.string(),
  createdAt: z.string().date(),
});

type Recipe = z.infer<typeof recipeSchema>;

const app = new Hono();

app.get('/', (c) => c.text('Testing'));
app.route('/users', usersRoute);
app.route('/recipes', recipesRoute);

export default app;