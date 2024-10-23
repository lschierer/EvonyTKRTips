import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import * as evonyTypes from "@schemas/api";

const app = new Hono();

app.get(
  "/:id",
  zValidator("query", z.object({ id: z.string().optional() })),
  (c) => {
    const { id } = c.req.valid("query");
    return c.json(
      {
        name: id,
      },
      200
    );
  }
);

export default app;
