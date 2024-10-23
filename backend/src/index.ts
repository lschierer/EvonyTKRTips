import { Hono } from "hono";
import { logger } from "hono/logger";
import { poweredBy } from "hono/powered-by";
import { hc } from "hono/client";

import api from "./api/api";

const app = new Hono();
app.use(poweredBy());
app.use(logger());

app.get("/test", (c) => c.text("hello world"));
const APIRoute = app.route("/api", api);
export type AppType = typeof APIRoute;

const client = hc<AppType>("");
export type Client = typeof client;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<typeof app>(...args);

export default app;
