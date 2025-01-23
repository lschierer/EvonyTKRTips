import debugFunction from "./debug.ts";
const DEBUG = debugFunction("lib/greenwoodpages.ts");

import { z } from "zod";
export type Compilation = {
  graph: Page[];
  context: object;
  config: object;
  // TODO put resources into manifest
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  resources: Map<any, any>;
  manifest: {
    apis: Map<any, any>;
  };
};

export type Route = {
  id: string;
  label: string;
  title: string;
  route: string;
  layout: string;
  data: {
    collection: string;
    author: string | string[];
    tableOfContents: [];
    imports: [];
    tocHeading: number | string;
  };
  imports: [];
  resources: [];
  pageHref: string;
  outputHref: string;
  isSSR: boolean;
  prerender: boolean;
  isolation: boolean;
  hydration: boolean;
  servePage: string;
};

export const Page = z.object({
  id: z.string(),
  route: z.string(),
  label: z.string(),
  title: z.string().optional(),
  data: z
    .object({
      sidebar: z
        .object({
          order: z.number().optional(),
        })
        .optional(),
      author: z.string().optional(),
      description: z.string().optional(),
      tableOfContents: z
        .object({
          minHeadingLevel: z.number().optional(),
          maxHeadingLevel: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
});
export type Page = z.infer<typeof Page>;

const baseSideBarEntry = z.object({
  name: z.string(),
  route: z.string(),
});

type baseSideBarEntry = z.infer<typeof baseSideBarEntry>;
export type SideBarEntry = z.infer<typeof baseSideBarEntry> & {
  children: SideBarEntry[];
};
export const SideBarEntry: z.ZodType<SideBarEntry> = baseSideBarEntry.extend({
  children: z.lazy(() => SideBarEntry.array()),
});

export const sortPages = (a: Page, b: Page) => {
  return sortbyContainsRoute(a, b)
    ? sortbyContainsRoute(a, b)
    : sortbyfrontmatter(a, b)
      ? sortbyfrontmatter(a, b)
      : sortbyTitle(a, b)
        ? sortbyTitle(a, b)
        : sortbylabel(a, b);
};

const sortbyContainsRoute = (a: Page, b: Page) => {
  if (b.route.startsWith(a.route)) {
    return -1;
  } else if (a.route.startsWith(b.route)) {
    return 1;
  } else {
    return 0;
  }
};

const sortbyfrontmatter = (a: Page, b: Page) => {
  if (
    a.data !== undefined &&
    a.data.sidebar !== undefined &&
    a.data.sidebar.order !== undefined
  ) {
    if (DEBUG) {
      console.log(`sorting by sidebar order`);
    }
    if (
      b.data !== undefined &&
      b.data.sidebar !== undefined &&
      b.data.sidebar.order !== undefined
    ) {
      return a.data.sidebar.order > b.data.sidebar.order
        ? 1
        : a.data.sidebar.order < b.data.sidebar.order
          ? -1
          : 0;
    }
    return -1;
  } else if (
    b.data !== undefined &&
    b.data.sidebar !== undefined &&
    b.data.sidebar.order !== undefined
  ) {
    if (DEBUG) {
      console.log(`sorting by sidebar order`);
    }
    return 1;
  }
  return 0;
};

const sortbyTitle = (a: Page, b: Page) => {
  if (a.title !== undefined) {
    if (b.title !== undefined) {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    }
    return a.title.toLowerCase().localeCompare(b.label.toLowerCase());
  }
  if (b.title !== undefined) {
    return a.label.toLowerCase().localeCompare(b.title.toLowerCase());
  }
  return 0;
};

const sortbylabel = (a: Page, b: Page) => {
  return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
};
