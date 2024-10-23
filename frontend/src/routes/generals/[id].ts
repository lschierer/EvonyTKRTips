import { html } from "lit";
import { defineRoute } from "@gracile/gracile/route";
import { document } from "@templates/base";

import * as gracile from "@gracile/gracile/hono";
import { type AppType, type Client, hcWithType } from "@backend/src/index";
import { hc } from "hono/client";
import * as evonyTypes from "@schemas/api";

const DEBUG = true;

type Props = {
  success: boolean;
  general: evonyTypes.General;
};

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
        if (DEBUG) {
          console.log(`api url is ${api.toString()}`);
        }
        const client = hcWithType(api.toString());

        const result = await fetch(api);
        if (!result.ok) {
          return Response.redirect(context.url, result.status);
        } else {
          const generalObject = await result.json();
          const valid = evonyTypes.generalSchema.safeParse(generalObject);
          if (!valid.success) {
            console.log(`invalid general`);
            console.log(`error is ${valid.error}`);
            return Response.redirect(context.url, 404);
          }
        }
      }
    },
  },
  document: (context) => document({ ...context, section: "Generals" }),

  template: async (context) => html` <h1>${context.params.id}</h1> `,
});
