import { z } from "zod";

import { General } from "./generals";

export const FrontMatter = z.object({
  title: z.string(),
  author: z.union([z.string(), z.array(z.string())]).optional(),
  collection: z.union([z.string(), z.array(z.string())]).optional(),
  layout: z.union([z.literal("splash"), z.literal("standard")]).optional(),
  general: General.optional(),
  sidebar: z
    .object({
      order: z.number(),
    })
    .optional(),
});
export type FrontMatter = z.infer<typeof FrontMatter>;

export const ParsedResult = z.object({
  frontMatter: FrontMatter,
  html: z.string(),
});
export type ParsedResult = z.infer<typeof ParsedResult>;

export const ExternalPage = FrontMatter.extend({
  title: z.string(),
  route: z.string(),
  fileName: z.string(),
  html: z.string(),
});
export type ExternalPage = z.infer<typeof ExternalPage>;

const NavItemBase = ExternalPage.partial({
  html: true,
}).extend({
  expanded: z.boolean().optional(),
});

export type NavigationItem = z.infer<typeof NavItemBase> & {
  children: NavigationItem[];
};

export const NavigationItem: z.ZodType<NavigationItem> = NavItemBase.extend({
  children: z.lazy(() => NavigationItem.array()),
});

const ClientNavItemBase = ExternalPage.partial({
  html: true,
  fileName: true,
}).extend({
  expanded: z.boolean().optional(),
});

export type ClientNavItem = z.infer<typeof ClientNavItemBase> & {
  children: ClientNavItem[];
};
export const ClientNavItem: z.ZodType<ClientNavItem> = ClientNavItemBase.extend(
  {
    children: z.lazy(() => ClientNavItem.array()),
  }
);
