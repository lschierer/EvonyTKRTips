import type { BuffAttributes } from "../../../../types/BuffAttributes";
import { z } from "zod";

 export const buffAttributesSchema = z.enum(["Attack", "Attack_Speed", "Death_to_Survival", "Death_to_Soul", "Death_to_Wounded", "Defense", "Deserter_Capacity", "Double_Items_Drop_Rate", "HP", "Healing_Speed", "Hospital_Capacity", "Leadership", "Load", "March_Size_Capacity", "March_Time", "Marching_Speed", "Marching_Speed_to_Monsters", "Politics", "Rally_Capacity", "Range", "Resources_Production", "Stamina_Cost", "SubCity_Construction_Speed", "SubCity_Gold_Production", "SubCity_Training_Speed", "SubCity_Troop_Capacity", "Training_Capacity", "Training_Speed", "Wounded_to_Death"]) as z.ZodType<BuffAttributes>;

 export type BuffAttributesSchema = z.infer<typeof buffAttributesSchema>;