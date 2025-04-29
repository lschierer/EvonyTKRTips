import { greenwoodPluginGoogleAnalytics } from "@greenwood/plugin-google-analytics";
import { greenwoodPluginAdapterAws } from "@greenwood/plugin-adapter-aws";
import type {
  Compilation,
  Config as GreenwoodConfig,
  Resource,
} from "@greenwood/cli";

import yaml from "js-yaml";
import { cosmiconfig } from "cosmiconfig";
import * as fs from "node:fs";

import process from "node:process";
import { exit } from "node:process";

import { TopHeaderSectionPlugin } from "topheader-plugin";
import { ExternalPluginFooterSection } from "footersection-plugin";
import { SiteConfig } from "@evonytkrtips/schemas";

import { SpecialitySourcePlugin } from "./src/plugins/collections/specialities.ts";
import { AscendingSourcePlugin } from "./src/plugins/collections/ascendingAttributes.ts";

const loadConfig = async () => {
  console.log(`loadConfig running`);

  const explorer = cosmiconfig("evonytkrtips", {
    mergeSearchPlaces: true,
    searchStrategy: "global",
    loaders: {
      ".yaml": (filepath) => {
        console.log(`checking ${filepath}`);

        const valid = SiteConfig.safeParse(
          yaml.load(fs.readFileSync(filepath, "utf-8"))
        );
        if (valid.success) {
          console.log(`successful parse`);
          return valid.data;
        }

        console.error(
          `staticConfig could not parse ${filepath}: ${valid.error.message}`
        );

        return false;
      },
      ".yml": (filepath) => {
        const valid = SiteConfig.safeParse(
          yaml.load(fs.readFileSync(filepath, "utf-8"))
        );
        if (valid.success) {
          return valid.data;
        }
        return false;
      },
    },
  });

  const result = await explorer.search().catch((error: unknown) => {
    console.error(
      `failed to find result for config `,
      error instanceof Error ? error.message : JSON.stringify(error)
    );
  });
  console.log(`result is ${typeof result}`);
  if (result && !result.isEmpty) {
    return result;
  } else {
    console.log(`returning false for config`, JSON.stringify(result));
    return false;
  }
};

let config:
  | false
  | {
      config: object;
      filepath: string;
      isEmpty?: boolean;
    }
  | object = await loadConfig();

if (typeof config === "object") {
  if ("config" in config) {
    console.log(
      `local config is ${JSON.stringify(config["config" as keyof typeof config])}`
    );

    config = config.config;
  } else {
    console.error(
      `recieved config object with no config key: ${JSON.stringify(config)}`
    );
  }
} else {
  console.warn(`No config available.`);
}

export const LocalConfig = config;
if (!LocalConfig) {
  exit(1);
}

//begin work around for https://github.com/TanStack/table/pull/5373

class ProcessEnvReplaceResource implements Resource {
  public compilation: Compilation;
  public options: object;

  constructor(compilation: Compilation, options?: object) {
    this.options = options ? options : {};
    this.compilation = compilation;
  }

  async shouldIntercept(url: URL) {
    /*start work around for GetFrontmatter requiring async */
    await new Promise((resolve) => setTimeout(resolve, 1));
    /* end workaround */

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

const gc: GreenwoodConfig = {
  useTsc: true,
  activeContent: true,
  isolation: true,
  optimization: "default",
  prerender: false,
  staticRouter: false,
  markdown: {
    plugins: [
      {
        name: "rehype-class-names",
        options: {
          "h1,h2,h3,h4,h5":
            "spectrum-Heading spectrum-Heading--serif spectrum-Heading--heavy",
          h1: "spectrum-Heading--sizeXXL",
          h2: "spectrum-Heading--sizeXL",
          h3: "spectrum-Heading--sizeL",
          h4: "spectrum-Heading--sizeM",
          h5: "spectrum-Heading--sizeS",
          a: "spectrum-Link  spectrum-Link--primary",
          "p,li": "spectrum-Body spectrum-Body--serif spectrum-Body--sizeM",
          "blockquote,blockquote paragraph":
            "spectrum-Body spectrum-Body--serif spectrum-Body--sizeS",
        },
      },
      "rehype-autolink-headings",
      "remark-alerts",
      "remark-gfm",
      "remark-rehype",
    ],
  },
  plugins: [
    {
      //include the workaround from above.
      type: "resource",
      name: "process-env-replace",
      provider: (compilation: Compilation) =>
        new ProcessEnvReplaceResource(compilation),
    },

    greenwoodPluginGoogleAnalytics({
      analyticsId: "G-98HFQWP71B",
    }),
    SpecialitySourcePlugin(),
    AscendingSourcePlugin(),
    greenwoodPluginAdapterAws(),
    TopHeaderSectionPlugin(LocalConfig),
    ExternalPluginFooterSection(LocalConfig),
  ],
};
export default gc;
