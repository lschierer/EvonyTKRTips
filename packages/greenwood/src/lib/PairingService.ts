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
  const data = (await import(
    `@evonytkrtips/assets/collections/generalConflictGroups/${filename}`,
    {
      with: { type: "json" },
    }
  )) as object;

  const parsed = GeneralConflictGroups.ConflictGroup.safeParse(data);
  if (parsed.success) {
    allGroups.push(parsed.data);
  } else {
    console.warn(`Invalid conflict group in ${filename}`);
  }
}

// Now build the lookup map and the test function
function buildConflictMap(
  groups: GeneralConflictGroups.ConflictGroup[]
): Map<string, Set<string>> {
  const conflictMap = new Map<string, Set<string>>();

  for (const { members, others } of groups) {
    const union = new Set<string>();
    members.forEach((m) => union.add(m));
    if (others) {
      others.forEach((o) => union.add(o));
    }

    for (const general of members) {
      const conflicts = conflictMap.get(general) ?? new Set();
      for (const other of union) {
        if (other !== general) conflicts.add(other);
      }
      conflictMap.set(general, conflicts);
    }

    if (others) {
      for (const general of others) {
        const conflicts = conflictMap.get(general) ?? new Set();
        for (const member of members) {
          if (member !== general) conflicts.add(member);
        }
        conflictMap.set(general, conflicts);
      }
    }
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
