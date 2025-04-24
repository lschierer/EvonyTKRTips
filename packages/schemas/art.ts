import * as z from "zod";

import { Buff } from "./buff";

export const Art = z.object({
  name: z.string(),
  level: z.string(),
  buff: z.array(Buff),
});
export type Art = z.infer<typeof Art>;

export const ArtWork = z.object({
  art: Art,
});
export type ExcaliburL3 = z.infer<typeof ArtWork>;
