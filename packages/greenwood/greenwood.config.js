import { greenwoodPluginTypeScript } from "@greenwood/plugin-typescript";
import { greenwoodPluginPostCss } from "@greenwood/plugin-postcss";
import { greenwoodPluginGoogleAnalytics } from "@greenwood/plugin-google-analytics";

import process from "node:process";

//begin work around for https://github.com/TanStack/table/pull/5373
import { ResourceInterface } from "@greenwood/cli/src/lib/resource-interface.js";

class ProcessEnvReplaceResource extends ResourceInterface {
  constructor(compilation) {
    super();

    this.compilation = compilation;
  }

  async shouldIntercept(url) {
    // your custom condition goes here
    return url.pathname.includes("tanstack");
  }

  async intercept(url, request, response) {
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
      provider: (compilation) => new ProcessEnvReplaceResource(compilation),
    },
    greenwoodPluginTypeScript({
      extendConfig: true,
    }),
    greenwoodPluginPostCss({
      extendConfig: true,
    }),
    greenwoodPluginGoogleAnalytics({
      analyticsId: "G-98HFQWP71B",
    }),
  ],
};
