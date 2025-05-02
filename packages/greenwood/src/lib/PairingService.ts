import conflict_collection from "@evonytkrtips/assets/collections/generalConflictGroups";
import general_collection from "@evonytkrtips/assets/collections/generals";
import { GeneralConflictGroups, Generals } from "@evonytkrtips/schemas";

import debugFunction from "./debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

const allGroups: GeneralConflictGroups.ConflictGroup[] = [];
const allGenerals: Map<string, Generals.General> = new Map<
  string,
  Generals.General
>();

for (const filename of conflict_collection) {
  let data = (await import(
    `@evonytkrtips/assets/collections/generalConflictGroups/${filename}`,
    {
      with: { type: "json" },
    }
  )) as object;
  if ("default" in data) {
    data = data.default as object;
  }

  const parsed = GeneralConflictGroups.ConflictGroup.safeParse(data);
  if (parsed.success) {
    allGroups.push(parsed.data);
  } else {
    console.warn(
      `Invalid conflict group in ${filename}: \n${parsed.error.message}`
    );
  }
}

// Now build the lookup map and the test function
function buildConflictMap(
  groups: GeneralConflictGroups.ConflictGroup[]
): Map<string, Set<string>> {
  // Step 1: Build two maps
  // Map 1: General name -> Array of UUIDs (conflict groups the general belongs to or conflicts with)
  const generalToUUIDs = new Map<string, Set<string>>();

  // Map 2: UUID -> Array of general names (members of that conflict group)
  const uuidToMembers = new Map<string, string[]>();

  // First pass: populate the maps
  for (const group of groups) {
    const { name, members, others } = group;

    // Store the mapping from UUID to its members
    uuidToMembers.set(name, [...members]);

    // For each member, add this group's UUID to their list
    for (const member of members) {
      const uuids = generalToUUIDs.get(member) ?? new Set<string>();
      uuids.add(name); // Add the current group's UUID
      generalToUUIDs.set(member, uuids);
    }

    // For each "other" UUID, add it to the members' lists
    if (others) {
      for (const member of members) {
        const uuids = generalToUUIDs.get(member) ?? new Set<string>();
        for (const otherUUID of others) {
          uuids.add(otherUUID); // Add the other group's UUID
        }
        generalToUUIDs.set(member, uuids);
      }
    }
  }

  // Step 2: Build the final conflict map
  const conflictMap = new Map<string, Set<string>>();

  // For each general, find all the generals they conflict with
  for (const [general, uuids] of generalToUUIDs.entries()) {
    const conflicts = new Set<string>();

    // For each UUID this general is associated with
    for (const uuid of uuids) {
      // Get all members of that conflict group
      const members = uuidToMembers.get(uuid);
      if (members) {
        // Add all members except the general itself
        for (const member of members) {
          if (member !== general) {
            conflicts.add(member);
          }
        }
      }
    }

    conflictMap.set(general, conflicts);
  }

  return conflictMap;
}

function createPairChecker(groups: GeneralConflictGroups.ConflictGroup[]) {
  const conflictMap = buildConflictMap(groups);

  return function canPair(a: string, b: string): boolean {
    return !(conflictMap.get(a)?.has(b) || conflictMap.get(b)?.has(a));
  };
}

export const canPair = createPairChecker(allGroups);

export const generateValidPairs = async (): Promise<
  [Generals.General, Generals.General][]
> => {
  const result: [Generals.General, Generals.General][] = [];

  for (const a of general_collection) {
    const an = a.slice(-5);
    for (const b of general_collection) {
      const bn = b.slice(-5);
      if (a !== b && canPair(an, bn)) {
        let ag: Generals.General | undefined = undefined;
        if (!allGenerals.has(an)) {
          const ad = (await import(
            `@evonytkrtips/assets/collections/generals/${a}`,
            { with: { type: "json" } }
          )) as object;
          const av = Generals.General.safeParse(ad);
          if (av.success) {
            allGenerals.set(an, av.data);
            ag = av.data;
          } else if (DEBUG) {
            console.error(`error parsing ${a}: ${av.error.message}`);
          }
        } else {
          ag = allGenerals.get(an);
        }

        let bg: Generals.General | undefined = undefined;
        if (!allGenerals.has(bn)) {
          const bd = (await import(
            `@evonytkrtips/assets/collections/generals/${b}`,
            { with: { type: "json" } }
          )) as object;
          const bv = Generals.General.safeParse(bd);
          if (bv.success) {
            allGenerals.set(bn, bv.data);
            bg = bv.data;
          } else if (DEBUG) {
            console.error(`error parsing ${b}: ${bv.error.message}`);
          }
        } else {
          bg = allGenerals.get(bn);
        }

        if (ag && bg) {
          result.push([ag, bg]);
        } else if (DEBUG) {
          if (!ag) {
            console.error(`ag ${an} is null despite both if and else`);
          }
          if (!bg) {
            console.error(`bg ${bn} is null despite both if and else`);
          }
        }
      }
    }
  }

  return result;
};
