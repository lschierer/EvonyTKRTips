import { html } from "lit";
import { defineRoute } from "@gracile/gracile/route";
import { document } from "@templates/base";

export default defineRoute({
  document: (context) => document(context),

  template: async (context) => html` <h1>${context.params.id}</h1> `,
});
