import { getContentByRoute } from "@greenwood/cli/src/data/client.js";

import {
  type Compilation,
  type Route,
  type Page,
} from "../lib/greenwoodPages.ts";

const getLayout = async (compilation: Compilation, route: Route) => {
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  const pages: Page[] = new Array<Page>();
  (await getContentByRoute(route.route))
    .sort((a: Page, b: Page) => {
      return a.label.localeCompare(b.label);
    })
    .map((p: Page) => {
      pages.push(p);
    });
  return `
  <!doctype html>
  <html lang="en" >
    <body>
      <header>
        <h1>Welcome to my site!</h1>
      </header>
      <nav>
        <ul>
          ${pages
            .map((p) => {
              const { title, label, route } = p;
              return `
              <li>
                <a href="${route}">
                  ${title ? title : label}
                </a>
              </li>
            `;
            })
            .join("")}
        </ul>
      </nav>

      <content-outlet></content-outlet>
    </body>
  </html>
  `;
};

export { getLayout };
