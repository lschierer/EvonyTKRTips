import { html } from "@gracile/gracile/server-html";

import { TopNav } from "@src/components/top-nav";

export interface Props {
  url: URL;
  title?: string | null;
  siteTitle?: string | null;
}

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

    <body class="h-full ">
      <div class="bg-blue-500 w-screen">
        <p>test</p>
        <top-nav> </top-nav>
      </div>

      <route-template-outlet></route-template-outlet>
    </body>
  </html>
`;
