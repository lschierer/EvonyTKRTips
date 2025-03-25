import type { Frontmatter, GetBody, GetFrontmatter } from "@greenwood/cli";

import { setTimeout } from "node:timers/promises";
import pTimeout from "p-timeout";

import getLayout from "../../layouts/standard.ts";

const getFrontmatter: GetFrontmatter = async () => {
  /*start work around for GetFrontmatter requiring async */
  const delayedPromise = setTimeout(1);
  await pTimeout(delayedPromise, {
    milliseconds: 1,
  });
  /* end workaround */

  const f: Frontmatter = {
    title: "Pair Picking",
    layout: "standard",
    collection: ["tools"],
    imports: ["/components/generals/tools/GeneralStats.ts type=module"],
  };
  return f;
};

const getBody: GetBody = async () => {
  /*start work around for GetFrontmatter requiring async */
  const delayedPromise = setTimeout(1);
  await pTimeout(delayedPromise, {
    milliseconds: 1,
  });
  /* end workaround */
  let returnable = "";

  returnable += `
    <general-stats></general-stats>
  `;

  return returnable;
};
export { getBody, getFrontmatter, getLayout };
