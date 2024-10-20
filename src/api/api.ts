import { Hono } from "hono";

import generals from "./generals";

const app = new Hono<{ Variables: Gracile.Locals }>();

app.route("/generals", generals);

export default app;
