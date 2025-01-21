export const prerender = true;

import type * as greenwoodTypes from "../../../lib/greenwoodPages.ts";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("pages/Generals/details/index.ts");

function getBody() {
  return `
    <generals-collection></generals-collection>
  `;
}

function getLayout(
  compilation: greenwoodTypes.Compilation,
  route: greenwoodTypes.Route
) {
  if (DEBUG) {
    console.log(`route is ${JSON.stringify(route)}`);
  }

  return `
    <!doctype html>
    <html>
      <head>
        <script type="module"  src="../../../components/collections/generals.ts"></script>
      </head>
      <body>
        <h1>Available Generals</h1>

        <content-outlet></content-outlet>
      </body>
    </html>
  `;
}

function getFrontmatter() {
  return {
    title: "General Details",
    author: "Luke Schierer",
    tableOfContents: false,
  };
}

export { getFrontmatter, getBody, getLayout };
