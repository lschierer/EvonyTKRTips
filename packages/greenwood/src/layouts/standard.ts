import { type Compilation, type Route } from "../lib/greenwoodPages.ts";

import "../components/sidebar.ts";

import debugFunction from "../lib/debug.ts";
const DEBUG = debugFunction("layouts/standard.ts");

const getLayout = (compilation: Compilation, route: Route) => {
  const page = compilation.graph.find((p) => {
    return !p.route.localeCompare(route.route);
  });
  if (DEBUG) {
    console.log(`route is ${route.route}`);
  }
  let title = "No Title Found";
  if (page) {
    title = page.title ? page.title : page.label;
  }
  return `
  <!doctype html>
  <html lang="en" >
    <head>
      ${
        route.route.toLowerCase().startsWith("/generals/details/")
          ? `<link rel="stylesheet" href="../styles/generalDetails.css" />`
          : ""
      }
      ${
        route.route.toLowerCase().startsWith("/monsters/monstersimulator/")
          ? `
            <link rel="stylesheet" href="../styles/MonsterSimulator.css" />

          `
          : ""
      }

      <link rel="stylesheet" src="@spectrum-css/sidenav/dist/index.css" />

    </head>
    <body>
      <header>
        <h1 class="spectrum-Heading spectrum-Heading--sizeXXL">${title}</h1>
        <script type="module" src="../components/sidebar.ts"></script>
      </header>

      <div class="main">
        <side-bar route="${route.route}"></side-bar>
        <div class="content">
          <content-outlet></content-outlet>
        </div>
      </div>
    </body>
  </html>
  `;
};

export { getLayout };

export default getLayout;
