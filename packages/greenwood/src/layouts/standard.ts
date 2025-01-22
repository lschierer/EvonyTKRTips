import { type Compilation, type Route } from "../lib/greenwoodPages.ts";

import "../components/sidebar.ts";

const getLayout = (compilation: Compilation, route: Route) => {
  return `
  <!doctype html>
  <html lang="en" >
    <body>
      <header>
        <h1>${
          /* eslint-disable @typescript-eslint/no-unsafe-member-access */
          globalThis.page
            ? globalThis.page.title
              ? globalThis.page.title
              : globalThis.page.label
            : "No Title Found"
        }</h1>
        <script type="module" src="../components/sidebar.ts"></script>
      </header>

      <side-bar route="${route.route}"></side-bar>
      <content-outlet></content-outlet>
    </body>
  </html>
  `;
};

export { getLayout };

export default getLayout;
