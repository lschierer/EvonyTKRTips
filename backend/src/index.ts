import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { hc } from "hono/client";

import api from "./api/api";

const app = new Hono();

app.get("/test", (c) => c.text("hello world"));
const APIRoute = app.route("/api", api);
export type AppType = typeof APIRoute;

const client = hc<typeof app>("");
export type Client = typeof client;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<typeof app>(...args);

export default app;
