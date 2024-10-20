import { Hono } from "hono";

import * as evonyTypes from "../schemas/evony";

const app = new Hono<{ Variables: Gracile.Locals }>();

app.get("/generals/:id", (c) => {
  return c.json(
    evonyTypes.General({
      name: "My Name",
      id: crypto.randomUUID(),
      level: 45,
    }),
  );
});

export default app;
