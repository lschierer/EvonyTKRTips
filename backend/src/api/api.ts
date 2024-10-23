import { Hono } from "hono";

import generals from "./generals";

const app = new Hono();

app.route("/generals", generals);

export default app;
