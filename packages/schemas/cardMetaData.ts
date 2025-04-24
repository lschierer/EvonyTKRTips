import { z } from "zod";

export const CardMeta = z.object({
  heading: z.string(),
  description: z.string(),
  variant: z
    .union([z.literal("standard"), z.literal("gallery"), z.literal("quiet")])
    .optional(),
  footer: z.string().optional(),
  subheading: z.string().optional(),
  style: z.string().optional(),
  alt: z.string().optional(),
  imgSrc: z.string().optional(),
  icon: z.string().optional(),
  target: z.string().optional(),
});
export type CardMeta = z.infer<typeof CardMeta>;
