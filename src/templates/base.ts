import { html } from "@gracile/gracile/server-html";
import {
  type BodyTemplate,
  type RouteContextGeneric,
} from "@gracile/engine/routes/route";

import { TopNav } from "@src/components/top-nav";

export interface Props {
  url: URL;
  section: string;
  title?: string | null;
  siteTitle?: string | null;
}

// I need a better way to handle this.
const tkrSections = ["Generals", "Monsters", "SvS", "Reference"];

export const document = (props: Props) => html`
  <!doctype html>
  <html lang="en" class="spectrum spectrum--medium spectrum--light">
    <head>
      <!-- Basics -->
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <!-- Global assets -->
      <link
        rel="stylesheet"
        href=${new URL("./base.css", import.meta.url).pathname}
      />
      <script
        type="module"
        src=${new URL("./base.client.ts", import.meta.url).pathname}
      ></script>

      <!-- SEO and page metadata -->
      <title>${props.title}</title>
      <link type="image/svg+xml" href="/favicon.svg" rel="icon" />
    </head>

    <body class="h-full">
      <div class=" w-full">
        <top-nav
          section="${props.section}"
          sitesectionsjson="${JSON.stringify(tkrSections)}"
        >
        </top-nav>
      </div>
      <main class="w-9/12 ">
        <route-template-outlet></route-template-outlet>
      </main>
    </body>
  </html>
`;
