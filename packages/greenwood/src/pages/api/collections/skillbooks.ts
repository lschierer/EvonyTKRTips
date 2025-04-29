import { SkillBooks } from "@evonytkrtips/schemas";
import collection from "@evonytkrtips/assets/collections/skillBooks";

import {
  type SummarizedBuff,
  mapBuffs,
  summarizeBuffs,
} from "../../../lib/BuffSummary.ts";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
if (DEBUG) {
  console.log(`DEBUG enabled for ${new URL(import.meta.url).pathname}`);
}

/**
 * Summarizes skillbook buffs by attribute, troop class, and condition
 * Note: SkillBooks don't have a level hierarchy like other data types
 */
export const handler = async (request: Request): Promise<Response> => {
  try {
    // Parse the URL to get the name parameter
    const url = new URL(request.url);
    const name = url.searchParams.get("name");

    if (DEBUG) {
      console.log(`skillbooks handler looking for name: ${name}`);
    }

    // Load all skillbook data
    const allItems: SkillBooks.SkillBook[] = [];

    await Promise.all(
      collection.map(async (itemFile) => {
        const filePath = `@evonytkrtips/assets/collections/skillbooks/${itemFile}`;

        try {
          let data = (await import(filePath, {
            with: { type: "json" },
          })) as object;

          if ("default" in data) {
            data = data.default as object;
          }

          const valid = SkillBooks.SkillBook.safeParse(data);
          if (valid.success) {
            allItems.push(valid.data);
          }
        } catch (error) {
          console.error(`Error loading ${itemFile}:`, error);
        }
      })
    );

    // If a name was provided, find that specific item
    if (name) {
      const found = allItems.find(
        (item) =>
          item.name.localeCompare(name, undefined, { sensitivity: "base" }) ===
          0
      );

      if (found) {
        if (DEBUG) {
          console.log(`Found skillbook: ${found.name}`);
        }

        // Create a map to store summarized buffs
        const buffMap = new Map<string, SummarizedBuff>();

        // Handle both single buff and array of buffs
        const buffs = Array.isArray(found.buff) ? found.buff : [found.buff];

        if (DEBUG) {
          console.log(`Processing ${buffs.length} buffs`);
        }

        // Map the buffs for this skillbook
        const levelStr =
          found.level !== undefined ? found.level.toString() : "N/A";
        const buffMap2 = mapBuffs(buffs, found.name, levelStr);

        // Add to the main buff map
        for (const [key, value] of buffMap2.entries()) {
          buffMap.set(key, {
            attribute: value.attribute,
            class: value.class,
            condition: value.condition,
            totalValue: value.totalValue,
            unit: value.unit,
            sources: [...value.sources],
          });
        }

        // Convert map to array and sort
        const summarizedBuffs = summarizeBuffs(buffMap);

        if (DEBUG) {
          console.log(`Summarized ${summarizedBuffs.length} buffs`);
        }

        return new Response(
          JSON.stringify({
            summary: summarizedBuffs,
            count: summarizedBuffs.length,
            dataType: "Skill Books",
            name: found.name,
            level: found.level,
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "max-age=3600",
            },
          }
        );
      } else {
        if (DEBUG) {
          console.log(`No skillbook found with name: ${name}`);
          console.log(
            `Available names: ${allItems.map((item) => item.name).join(", ")}`
          );
        }

        // Return 404 if the requested item wasn't found
        return new Response(
          JSON.stringify({
            error: {
              status: 404,
              code: "RESOURCE_NOT_FOUND",
              message: `The requested Skill Book '${name}' was not found in the collection`,
              details: {
                resourceType: "Skill Book",
                requestedId: name,
                availableIds: allItems.map((item) => item.name),
              },
            },
          }),
          {
            status: 404,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    } else {
      // If no name was provided, return a list of available items
      return new Response(
        JSON.stringify({
          availableItems: allItems.map((item) => ({
            name: item.name,
            level: item.level,
          })),
          count: allItems.length,
          dataType: "Skill Books",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "max-age=3600",
          },
        }
      );
    }
  } catch (error) {
    console.error("Error processing skill books:", error);
    return new Response(
      JSON.stringify({
        error: {
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process skill books",
          details: {
            error: error instanceof Error ? error.message : String(error),
          },
        },
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
