import { greenwoodPluginPostCss } from "@greenwood/plugin-postcss";
import { greenwoodPluginGoogleAnalytics } from "@greenwood/plugin-google-analytics";

import process from "node:process";

import type { Compilation } from "@greenwood/cli";

import { GeneralSourcePlugin } from "./src/plugins/collections/generals.ts";
import { SpecialitySourcePlugin } from "./src/plugins/collections/specialities.ts";

//begin work around for https://github.com/TanStack/table/pull/5373

class ProcessEnvReplaceResource {
  public compilation: Compilation;
  public options: object;

  constructor(compilation: Compilation, options?: object) {
    this.options = options ? options : {};
    this.compilation = compilation;
  }

  shouldIntercept(url: URL) {
    // your custom condition goes here
    return url.pathname.includes("tanstack");
  }

  async intercept(url: URL | string, request: Request, response: Response) {
    const body = await response.text();
    const env =
      process.env.__GWD_COMMAND__ === "develop" ? "development" : "production";
    const contents = body.replace(/process.env.NODE_ENV/g, `"${env}"`);

    return new Response(contents, {
      headers: new Headers({
        "Content-Type": "text/javascript",
      }),
    });
  }
}

//end workaround

export default {
  useTsc: true,
  activeContent: true,
  isolation: true,
  optimization: "default",
  prerender: false,
  staticRouter: false,
  markdown: {
    plugins: [
      "rehype-autolink-headings",
      "remark-alerts",
      "remark-gfm",
      "remark-rehype",
    ],
    settings: {
      commonmark: true,
    },
  },
  plugins: [
    {
      //include the workaround from above.
      type: "resource",
      name: "process-env-replace",
      provider: (compilation: Compilation) =>
        new ProcessEnvReplaceResource(compilation),
    },
    greenwoodPluginPostCss({
      extendConfig: true,
    }),
    greenwoodPluginGoogleAnalytics({
      analyticsId: "G-98HFQWP71B",
    }),
    GeneralSourcePlugin(),
    SpecialitySourcePlugin(),
  ],
};
