import { Ascending, Constants } from "@evonytkrtips/schemas";
import collection from "@evonytkrtips/assets/collections/ascendingattributes";

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
 * Determines if a level is less than or equal to the max level
 * @param level The level to check
 * @param maxLevel The maximum level to compare against
 * @returns True if level is less than or equal to maxLevel
 */
function isLevelLessThanOrEqual(level: string, maxLevel: string): boolean {
  const levelOptions = Constants.AscendingLevel.options;
  const levelIndex = (levelOptions as string[]).indexOf(level);
  const maxLevelIndex = (levelOptions as string[]).indexOf(maxLevel);

  // If either level is not found, return false
  if (levelIndex === -1 || maxLevelIndex === -1) {
    return false;
  }

  return levelIndex <= maxLevelIndex;
}

/**
 * Summarizes ascending attribute buffs by attribute, troop class, and condition
 */
export const handler = async (request: Request): Promise<Response> => {
  try {
    // Parse the URL to get the parameters
    const url = new URL(request.url);
    const name = url.searchParams.get("name");
    const maxLevel = url.searchParams.get("level");

    if (DEBUG) {
      console.log(
        `ascending handler looking for name: ${name}, level: ${maxLevel}`
      );
    }

    // Validate level parameter if provided
    if (
      maxLevel &&
      !(Constants.AscendingLevel.options as string[]).includes(maxLevel)
    ) {
      return new Response(
        JSON.stringify({
          error: {
            status: 400,
            code: "INVALID_PARAMETER",
            message: `Invalid level parameter: ${maxLevel}`,
            details: {
              validLevels: Constants.AscendingLevel.options,
            },
          },
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Load all ascending attribute data
    const allItems: Ascending.GeneralAscending[] = [];

    await Promise.all(
      collection.map(async (itemFile) => {
        const filePath = `@evonytkrtips/assets/collections/ascendingattributes/${itemFile}`;

        try {
          let data = (await import(filePath, {
            with: { type: "json" },
          })) as object;

          if ("default" in data) {
            data = data.default as object;
          }

          const valid = Ascending.GeneralAscending.safeParse(data);
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
          item.general.localeCompare(name, undefined, {
            sensitivity: "base",
          }) === 0
      );

      if (found) {
        if (DEBUG) {
          console.log(`Found ascending attribute: ${found.general}`);
          console.log(`Number of levels: ${found.ascending.length}`);
          if (maxLevel) {
            console.log(`Filtering levels up to: ${maxLevel}`);
          }
        }

        // Create a map to store summarized buffs
        const buffMap = new Map<string, SummarizedBuff>();

        // Process each level of the found item
        for (const level of found.ascending) {
          // Skip levels that are higher than the max level if specified
          if (maxLevel && !isLevelLessThanOrEqual(level.level, maxLevel)) {
            if (DEBUG) {
              console.log(
                `Skipping level ${level.level} as it's higher than ${maxLevel}`
              );
            }
            continue;
          }

          if (DEBUG) {
            console.log(
              `Processing level: ${level.level} with ${level.buff.length} buffs`
            );
          }

          // Map the buffs for this level
          const levelBuffMap = mapBuffs(level.buff, found.general, level.level);

          // Merge into the main buff map
          for (const [key, value] of levelBuffMap.entries()) {
            if (!buffMap.has(key)) {
              // Create a new entry with the values from the level map
              buffMap.set(key, {
                attribute: value.attribute,
                class: value.class,
                condition: value.condition,
                totalValue: value.totalValue,
                unit: value.unit,
                sources: [...value.sources],
              });
            } else {
              // Update existing entry
              const existingBuff = buffMap.get(key);
              if (existingBuff) {
                existingBuff.totalValue += value.totalValue;
                existingBuff.sources.push(...value.sources);
              }
            }
          }
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
            dataType: "Ascending Attributes",
            name: found.general,
            maxLevel: maxLevel || "All levels",
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
          console.log(`No ascending attribute found with name: ${name}`);
          console.log(
            `Available names: ${allItems.map((item) => item.general).join(", ")}`
          );
        }

        // Return 404 if the requested item wasn't found
        return new Response(
          JSON.stringify({
            error: {
              status: 404,
              code: "RESOURCE_NOT_FOUND",
              message: `The requested Ascending Attribute '${name}' was not found in the collection`,
              details: {
                resourceType: "Ascending Attribute",
                requestedId: name,
                availableIds: allItems.map((item) => item.general),
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
            name: item.general,
            id: item.id,
            levels: item.ascending.map((level) => level.level),
          })),
          count: allItems.length,
          dataType: "Ascending Attributes",
          validLevels: Constants.AscendingLevel.options,
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
    console.error("Error processing ascending attributes:", error);
    return new Response(
      JSON.stringify({
        error: {
          status: 500,
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process ascending attributes",
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
