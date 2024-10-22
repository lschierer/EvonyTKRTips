import { html } from "lit";
import { defineRoute } from "@gracile/gracile/route";
import { document } from "@templates/base";

import * as gracile from "@gracile/gracile/hono";
import { type AppType } from "@server";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:8787/");

export default defineRoute({
  document: (context) => document({ ...context, section: "Generals" }),

  template: async (context) => html` <h1>${context.params.id}</h1> `,
});
