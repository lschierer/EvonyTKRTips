import conflict_collection from "@evonytkrtips/assets/collections/generalConflictGroups";
import general_collection from "@evonytkrtips/assets/collections/generals";
import { Generals, GeneralConflictGroups } from "@evonytkrtips/schemas";

import debugFunction from "../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
console.log(`DEBUG for ${new URL(import.meta.url).pathname} is ${DEBUG}`);

// Cache
let conflictGroups: GeneralConflictGroups.ConflictGroup[] = [];
let generalMap: Map<string, Generals.General> = new Map();
let conflictMap: Map<string, Set<string>> = new Map();
const generalList: string[] = [];

let initialized = false;

const resolveConflictMembers = (
  groupName: string,
  groupMap: Map<string, GeneralConflictGroups.ConflictGroup>,
  memo: Map<string, Set<string>> = new Map()
): Set<string> => {
  if (memo.has(groupName)) {
    const r = memo.get(groupName);
    if (r) {
      return r;
    }
  }
  const group = groupMap.get(groupName);
  if (!group) return new Set();

  const resolved = new Set(group.members);

  if (group.others) {
    for (const otherName of group.others) {
      const otherGroup = groupMap.get(otherName);
      if (!otherGroup) continue;
      for (const name of otherGroup.members) {
        resolved.add(name);
      }
    }
  }

  memo.set(groupName, resolved);
  return resolved;
};

const buildConflictMap = (
  groups: GeneralConflictGroups.ConflictGroup[]
): Map<string, Set<string>> => {
  const groupMap = new Map<string, GeneralConflictGroups.ConflictGroup>();
  for (const group of groups) {
    groupMap.set(group.name, group); // assumes each group has a `name` field
  }

  const memo = new Map<string, Set<string>>();
  const conflictMap = new Map<string, Set<string>>();

  for (const group of groups) {
    const fullSet = resolveConflictMembers(group.name, groupMap, memo);
    if (DEBUG) {
      console.log(`fullSet is ${[...fullSet].join(", ")} for ${group.name}`);
    }
    for (const general of group.members) {
      const set = conflictMap.get(general) ?? new Set();
      for (const other of fullSet) {
        if (other !== general) set.add(other);
      }
      conflictMap.set(general, set);
    }
  }

  return conflictMap;
};

// Step 1: Preload everything
export async function initializePairingService(): Promise<void> {
  if (initialized) return;

  // Load and validate all conflict groups
  const groupPromises = conflict_collection.map(async (filename) => {
    console.log(`attempting import of confict file ${filename}`);
    let mod = (await import(
      `@evonytkrtips/assets/collections/generalConflictGroups/${filename}`,
      {
        with: { type: "json" },
      }
    )) as object;
    if ("default" in mod) {
      mod = mod.default as object;
    }
    const parsed = GeneralConflictGroups.ConflictGroup.safeParse(mod);
    if (parsed.success) return parsed.data;
    console.warn(`Skipping invalid conflict group: ${filename}`);
    return null;
  });

  conflictGroups = (await Promise.all(groupPromises)).filter(
    Boolean
  ) as GeneralConflictGroups.ConflictGroup[];

  // Load all general data once
  const generalPromises = general_collection.map(async (name) => {
    console.log(`attempting import of general file ${name}`);
    let mod = (await import(
      `@evonytkrtips/assets/collections/generals/${name}`,
      {
        with: { type: "json" },
      }
    )) as object;
    if ("default" in mod) {
      mod = mod.default as object;
    }
    const parsed = Generals.General.safeParse(mod);
    if (!parsed.success) {
      console.warn(`Skipping invalid general: ${name}`);
      return null;
    }

    const parsedName = parsed.data.name;
    generalList.push(parsedName);
    return [parsedName, parsed.data] as const;
  });

  const generalPairs = await Promise.all(generalPromises);
  generalMap = new Map(
    generalPairs.filter(Boolean) as [string, Generals.General][]
  );

  // Build conflict map
  conflictMap = buildConflictMap(conflictGroups);

  initialized = true;
}

// Step 2: Can-pair checker (fully sync after init)
export function canPair(a: string, b: string): boolean {
  if (a === b) return false;
  const cma = conflictMap.get(a);
  if (cma) {
    if (cma.has(b)) {
      return false;
    }
  }
  const cmb = conflictMap.get(b);
  if (cmb) {
    if (cmb.has(a)) {
      return false;
    }
  }

  return true;
}

// Step 3: Valid pair generator
export const generateValidPairs = async (): Promise<
  [Generals.General, Generals.General][]
> => {
  const result: [Generals.General, Generals.General][] = [];

  if (!generalList.length) {
    if (DEBUG) {
      console.log(`I need to initialize pairing service`);
    }
    await initializePairingService();
    if (DEBUG) {
      console.log(`after initialize, ${generalList.length} generals present`);
    }
  } else {
    console.log(
      `generateValidPairs starting with ${generalList.length} generals already present`
    );
  }

  for (const a of generalList) {
    for (const b of generalList) {
      if (a === b) continue;
      if (canPair(a, b)) {
        const ga = generalMap.get(a);
        const gb = generalMap.get(b);
        if (ga && gb) {
          result.push([ga, gb]);
        }
      }
    }
  }

  return result;
};
