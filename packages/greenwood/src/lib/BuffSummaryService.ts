import {
  Ascending,
  Specialities,
  SkillBooks,
  Constants,
  Generals,
  Buff,
} from "@evonytkrtips/schemas";
import ascendingCollection from "@evonytkrtips/assets/collections/ascendingattributes";
import specialitiesCollection from "@evonytkrtips/assets/collections/specialities";
import skillbooksCollection from "@evonytkrtips/assets/collections/skillBooks";

import { mapBuffs, summarizeBuffs } from "./BuffSummary.ts";

import debugFunction from "./debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

/**
 * Determines if a level is less than or equal to the max level for ascending attributes
 */
function isAscendingLevelLessThanOrEqual(
  level: string,
  maxLevel: string
): boolean {
  const levelOptions = Constants.AscendingLevel.options;
  const levelIndex = (levelOptions as string[]).indexOf(level);
  const maxLevelIndex = (levelOptions as string[]).indexOf(maxLevel);

  if (levelIndex === -1 || maxLevelIndex === -1) {
    return false;
  }

  return levelIndex <= maxLevelIndex;
}

/**
 * Determines if a level is less than or equal to the max level for specialities
 */
function isSpecialityLevelLessThanOrEqual(
  level: string,
  maxLevel: string
): boolean {
  const levelOptions = Constants.SpecialityLevelName.options;
  const levelIndex = (levelOptions as string[]).indexOf(level);
  const maxLevelIndex = (levelOptions as string[]).indexOf(maxLevel);

  if (levelIndex === -1 || maxLevelIndex === -1) {
    return false;
  }

  return levelIndex <= maxLevelIndex;
}

/**
 * Load all ascending attribute data
 */
async function loadAscendingData(): Promise<Ascending.GeneralAscending[]> {
  const allItems: Ascending.GeneralAscending[] = [];

  await Promise.all(
    ascendingCollection.map(async (itemFile) => {
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

  return allItems;
}

/**
 * Load all speciality data
 */
async function loadSpecialityData(): Promise<Specialities.Speciality[]> {
  const allItems: Specialities.Speciality[] = [];

  await Promise.all(
    specialitiesCollection.map(async (itemFile) => {
      const filePath = `@evonytkrtips/assets/collections/specialities/${itemFile}`;

      try {
        let data = (await import(filePath, {
          with: { type: "json" },
        })) as object;

        if ("default" in data) {
          data = data.default as object;
        }

        const valid = Specialities.Speciality.safeParse(data);
        if (valid.success) {
          allItems.push(valid.data);
        }
      } catch (error) {
        console.error(`Error loading ${itemFile}:`, error);
      }
    })
  );

  return allItems;
}

/**
 * Load all skillbook data
 */
async function loadSkillbookData(): Promise<SkillBooks.SkillBook[]> {
  const allItems: SkillBooks.SkillBook[] = [];

  await Promise.all(
    skillbooksCollection.map(async (itemFile) => {
      const filePath = `@evonytkrtips/assets/collections/skillBooks/${itemFile}`;

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

  return allItems;
}

/**
 * Get summary for an ascending attribute
 */
export async function getAscendingSummary(
  name: string,
  maxLevel?: string
): Promise<Buff.BuffSummaryResponse> {
  if (DEBUG) {
    console.log(
      `Getting ascending summary for ${name}, level: ${maxLevel || "all"}`
    );
  }

  // Validate level parameter if provided
  if (
    maxLevel &&
    !(Constants.AscendingLevel.options as string[]).includes(maxLevel)
  ) {
    return {
      summary: [],
      count: 0,
      dataType: "Ascending Attributes",
      error: {
        status: 400,
        code: "INVALID_PARAMETER",
        message: `Invalid level parameter: ${maxLevel}`,
        details: {
          validLevels: Constants.AscendingLevel.options,
        },
      },
    };
  }

  const allItems = await loadAscendingData();

  const found = allItems.find(
    (item) =>
      item.general.localeCompare(name, undefined, { sensitivity: "base" }) === 0
  );

  if (!found) {
    return {
      summary: [],
      count: 0,
      dataType: "Ascending Attributes",
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
    };
  }

  // Create a map to store summarized buffs
  const buffMap = new Map<string, Buff.SummarizedBuff>();

  // Process each level of the found item
  for (const level of found.ascending) {
    // Skip levels that are higher than the max level if specified
    if (maxLevel && !isAscendingLevelLessThanOrEqual(level.level, maxLevel)) {
      continue;
    }

    // Map the buffs for this level
    const levelBuffMap = mapBuffs(level.buff, found.general, level.level);

    // Merge into the main buff map
    for (const [key, value] of levelBuffMap.entries()) {
      if (!buffMap.has(key)) {
        buffMap.set(key, {
          attribute: value.attribute,
          class: value.class,
          condition: value.condition,
          totalValue: value.totalValue,
          unit: value.unit,
          sources: [...value.sources],
        });
      } else {
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

  return {
    summary: summarizedBuffs,
    count: summarizedBuffs.length,
    dataType: "Ascending Attributes",
    name: found.general,
    maxLevel: maxLevel || "All levels",
  };
}

/**
 * Get summary for a speciality
 */
export async function getSpecialitySummary(
  name: string,
  maxLevel?: string
): Promise<Buff.BuffSummaryResponse> {
  if (DEBUG) {
    console.log(
      `Getting speciality summary for ${name}, level: ${maxLevel || "all"}`
    );
  }

  // Validate level parameter if provided
  if (
    maxLevel &&
    !(Constants.SpecialityLevelName.options as string[]).includes(maxLevel)
  ) {
    return {
      summary: [],
      count: 0,
      dataType: "Specialities",
      error: {
        status: 400,
        code: "INVALID_PARAMETER",
        message: `Invalid level parameter: ${maxLevel}`,
        details: {
          validLevels: Constants.SpecialityLevelName.options,
        },
      },
    };
  }

  const allItems = await loadSpecialityData();

  const found = allItems.find(
    (item) =>
      item.name.localeCompare(name, undefined, { sensitivity: "base" }) === 0
  );

  if (!found) {
    return {
      summary: [],
      count: 0,
      dataType: "Specialities",
      error: {
        status: 404,
        code: "RESOURCE_NOT_FOUND",
        message: `The requested Speciality '${name}' was not found in the collection`,
        details: {
          resourceType: "Speciality",
          requestedId: name,
          availableIds: allItems.map((item) => item.name),
        },
      },
    };
  }

  // Create a map to store summarized buffs
  const buffMap = new Map<string, Buff.SummarizedBuff>();

  // Process each level of the found item
  for (const level of found.levels) {
    // Skip levels that are higher than the max level if specified
    if (maxLevel && !isSpecialityLevelLessThanOrEqual(level.level, maxLevel)) {
      continue;
    }

    // Map the buffs for this level
    const levelBuffMap = mapBuffs(level.buff, found.name, level.level);

    // Merge into the main buff map
    for (const [key, value] of levelBuffMap.entries()) {
      if (!buffMap.has(key)) {
        buffMap.set(key, {
          attribute: value.attribute,
          class: value.class,
          condition: value.condition,
          totalValue: value.totalValue,
          unit: value.unit,
          sources: [...value.sources],
        });
      } else {
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

  return {
    summary: summarizedBuffs,
    count: summarizedBuffs.length,
    dataType: "Specialities",
    name: found.name,
    maxLevel: maxLevel || "All levels",
  };
}

/**
 * Get summary for a skillbook
 */
export async function getSkillbookSummary(
  name: string
): Promise<Buff.BuffSummaryResponse> {
  if (DEBUG) {
    console.log(`Getting skillbook summary for ${name}`);
  }

  const allItems = await loadSkillbookData();

  const found = allItems.find(
    (item) =>
      item.name.localeCompare(name, undefined, { sensitivity: "base" }) === 0
  );

  if (!found) {
    return {
      summary: [],
      count: 0,
      dataType: "Skill Books",
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
    };
  }

  // Create a map to store summarized buffs
  const buffMap = new Map<string, Buff.SummarizedBuff>();

  // Handle both single buff and array of buffs
  const buffs = Array.isArray(found.buff) ? found.buff : [found.buff];

  // Map the buffs for this skillbook
  const levelStr = found.level !== undefined ? found.level.toString() : "N/A";
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

  return {
    summary: summarizedBuffs,
    count: summarizedBuffs.length,
    dataType: "Skill Books",
    name: found.name,
  };
}

/**
 * Merge multiple buff summaries into a single summary
 */
export function mergeBuffSummaries(
  summaries: Buff.BuffSummaryResponse[]
): Buff.BuffSummaryResponse {
  // Create a map to store merged buffs
  const buffMap = new Map<string, Buff.SummarizedBuff>();

  // Process each summary
  for (const summary of summaries) {
    /*eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
    if (summary.error || !summary.summary) {
      continue; // Skip summaries with errors
    }

    // Process each buff in the summary
    for (const buff of summary.summary) {
      // Create a unique key for this buff combination
      const conditionKey = buff.condition
        ? buff.condition
            .sort((a, b) =>
              a.localeCompare(b, undefined, { sensitivity: "base" })
            )
            .join(",")
        : "";
      const key = `${buff.attribute}|${buff.class || ""}|${conditionKey}|${buff.unit}`;

      if (!buffMap.has(key)) {
        buffMap.set(key, {
          attribute: buff.attribute,
          class: buff.class,
          condition: buff.condition,
          totalValue: 0,
          unit: buff.unit,
          sources: [],
        });
      }

      const existingBuff = buffMap.get(key);
      if (existingBuff) {
        existingBuff.totalValue += buff.totalValue;
        existingBuff.sources.push(...buff.sources);
      }
    }
  }

  // Convert map to array and sort
  const mergedBuffs = summarizeBuffs(buffMap);

  return {
    summary: mergedBuffs,
    count: mergedBuffs.length,
    dataType: "Combined Buffs",
  };
}
