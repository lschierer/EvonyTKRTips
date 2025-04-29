import type { Buff } from "@evonytkrtips/schemas";

import debugFunction from "./debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

export interface SummarizedBuff {
  attribute: string;
  class?: string;
  condition?: string[];
  totalValue: number;
  unit: string;
  sources: {
    id: string;
    level: string;
    value: number;
  }[];
}

/**
 * Maps an array of buffs to a Map of SummarizedBuff objects
 * @param buffs Array of buffs to map
 * @param id Identifier for the source (general name, speciality name, etc.)
 * @param level Level identifier
 * @returns Map of summarized buffs keyed by attribute+class+condition+unit
 */
export const mapBuffs = (buffs: Buff.Buff[], id: string, level: string): Map<string, SummarizedBuff> => {
  if (DEBUG) {
    console.log(`mapBuffs called with ${buffs.length} buffs for ${id} level ${level}`);
  }
  
  const buffMap = new Map<string, SummarizedBuff>();
  
  for (const buff of buffs) {
    // Create a unique key for this buff combination
    const conditionKey = buff.condition ? 
      buff.condition.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join(",") : 
      "";
    const key = `${buff.attribute}|${buff.class || ""}|${conditionKey}|${buff.value.unit}`;

    if (DEBUG) {
      console.log(`Processing buff: ${buff.attribute}, value: ${buff.value.number}, key: ${key}`);
    }

    if (!buffMap.has(key)) {
      buffMap.set(key, {
        attribute: buff.attribute,
        class: buff.class,
        condition: buff.condition,
        totalValue: 0,
        unit: buff.value.unit,
        sources: [],
      });
    }

    const summary = buffMap.get(key)!;
    summary.totalValue += buff.value.number;
    summary.sources.push({
      id: id,
      level: level,
      value: buff.value.number,
    });
  }
  
  if (DEBUG) {
    console.log(`mapBuffs returning map with ${buffMap.size} entries`);
  }
  
  return buffMap;
};

/**
 * Converts a Map of SummarizedBuff objects to a sorted array
 * @param buffMap Map of summarized buffs
 * @returns Sorted array of SummarizedBuff objects
 */
export const summarizeBuffs = (buffMap: Map<string, SummarizedBuff>): SummarizedBuff[] => {
  if (DEBUG) {
    console.log(`summarizeBuffs called with map of size ${buffMap.size}`);
  }
  
  const result = Array.from(buffMap.values()).sort((a, b) => {
    // Sort by attribute first
    const attrCompare = a.attribute.localeCompare(b.attribute, undefined, { sensitivity: 'base' });
    if (attrCompare !== 0) return attrCompare;

    // Then by class
    const classA = a.class || "";
    const classB = b.class || "";
    const classCompare = classA.localeCompare(classB, undefined, { sensitivity: 'base' });
    if (classCompare !== 0) return classCompare;

    // Then by condition
    const condA = a.condition ? a.condition.join(",") : "";
    const condB = b.condition ? b.condition.join(",") : "";
    return condA.localeCompare(condB, undefined, { sensitivity: 'base' });
  });
  
  if (DEBUG) {
    console.log(`summarizeBuffs returning array with ${result.length} items`);
  }
  
  return result;
};
