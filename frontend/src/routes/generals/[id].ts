import { html } from "lit";
import { defineRoute } from "@gracile/gracile/route";
import { document } from "@templates/base";

import * as gracile from "@gracile/gracile/hono";
import { type AppType, type Client, hcWithType } from "@backend/src/index";
import { hc } from "hono/client";

export default defineRoute({
  handler: {
    GET: async (context) => {
      const id = context.params.id;
      if (id === undefined) {
        return Response.redirect(context.url, 404);
      } else {
        const api = new URL("/api", context.url);
        if (import.meta.env.DEV) {
          api.port = "3000";
        }

        const client = hcWithType(api.toString());

        const res = await client.generals[":id"].$get({
          param: {
            id: id,
          },
        });
      }
    },
  },
  document: (context) => document({ ...context, section: "Generals" }),

  template: async (context) => html` <h1>${context.params.id}</h1> `,
});
