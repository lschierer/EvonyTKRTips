import type { Skin } from "../types/Skin";
import { buffSchema } from "./buffSchema";
import { z } from "zod";

 /**
 * @description Some generals have Skins or alternate outfits that add buffs
 */
export const skinSchema = z.object({ "name": z.string(), "activeBuffs": z.array(z.lazy(() => buffSchema)), "passiveBuffs": z.array(z.lazy(() => buffSchema)) }).describe("Some generals have Skins or alternate outfits that add buffs") as z.ZodType<Skin>;

 export type SkinSchema = z.infer<typeof skinSchema>;