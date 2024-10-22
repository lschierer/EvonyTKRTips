import { Hono } from "hono";
import { type } from "arktype";
import { arktypeValidator } from "@hono/arktype-validator";

import * as evonyTypes from "@schemas/evony";

const app = new Hono<{ Variables: Gracile.Locals }>();

const error = c.json("Invalid", 400);

app.post(
  "/:id",
  arktypeValidator("json", evonyTypes.GeneralTypes.General), (c) => {
    const data = c.req.valid('json');
    if(data instanceof type.errors) {
      return c.json({
        success: false,
        message: `${data.summary}`,
        status: 400
      });
    }
    else {

    }

  })
);

export default app;
