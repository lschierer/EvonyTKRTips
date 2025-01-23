import { type Compilation, type Route } from "../lib/greenwoodPages.ts";

import "../components/sidebar.ts";

const getLayout = (compilation: Compilation, route: Route) => {
  const page = compilation.graph.find((p) => {
    return !p.route.localeCompare(route.route);
  });
  let title = "No Title Found";
  if (page) {
    title = page.title ? page.title : page.label;
  }
  return `
  <!doctype html>
  <html lang="en" >
    <body>
      <header>
        <h1>${title}</h1>
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
