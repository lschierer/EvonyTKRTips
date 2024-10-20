import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

import * as gracile from "@gracile/gracile/hono";

// @ts-ignore
import { handler } from "./dist/server/entrypoint.js";

import api from "./src/api/api";

const app = new Hono<{ Variables: Gracile.Locals }>();

app.get("/test", (c) => c.text("hello world"));
app.route("/api", api);

app.get("*", serveStatic({ root: gracile.getClientDistPath(import.meta.url) }));

app.use((c, next) => {
  c.set("requestId", crypto.randomUUID());
  c.set("userEmail", c.req.header("x-forwarded-email") || "null@0.home.arpa");

  return next();
});

app.use(gracile.honoAdapter(handler));

export const server = serve(
  { fetch: app.fetch, hostname: gracile.server.LOCALHOST },
  (address) => gracile.printUrls(address)
);
