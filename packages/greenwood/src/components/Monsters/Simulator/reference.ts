import { z } from "zod";

import { Constants as constants } from "@evonytkrtips/schemas";

import simulatorState from "./state.ts";

export const AllianceBossModifiers =
  "../../../assets/modifierFiles/TroopAllianceBossModifiers.csv";
export const WorldBossModifiers =
  "../../../assets/modifierFiles/WorldBossModifiers.csv";
export const PanModifiers = "../../../assets/modifierFiles/PanModifiers.csv";
export const StandardModifiers =
  "../../../assets/modifierFiles/TroopMonsterModifiers.csv";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("components/Monsters/Simulator/reference.ts");

const BaseStat = z.object({
  tier: z.number().min(0).max(16),
  troopType: constants.ClassEnum,
  attack: z.number(),
  defense: z.number(),
  hp: z.number(),
});
type BaseStat = z.infer<typeof BaseStat>;

const BaseStats = z.array(BaseStat).length(16);
type BaseStats = z.infer<typeof BaseStats>;

const AllianceBossNumbers = [704, 705, 706];
const WorldBossNumbers = [186, 187, 188, 189];

export const getModifier = async () => {
  const bossNumber: number = simulatorState.orderNumber.get();
  if (DEBUG) {
    console.log(`getModifier shows orderNumber of ${bossNumber}`);
  }
  let data: string = "";

  if (AllianceBossNumbers.includes(bossNumber)) {
    //use the AllianceBoss Modifier csv file
    if (DEBUG) {
      console.log(`I will load the Alliance Boss Data`);
    }
    const url = new URL(AllianceBossModifiers, import.meta.url);
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`
      );
    }
    data = await response.text();
  } else if (WorldBossNumbers.includes(bossNumber)) {
    // use WorldBossModifiers.csv
    if (DEBUG) {
      console.log(`I will load the World Boss Data`);
    }
    const url = new URL(WorldBossModifiers, import.meta.url);
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`
      );
    }
    data = await response.text();
  } else if (
    (bossNumber > 555 && bossNumber < 571) ||
    (bossNumber > 1150 && bossNumber < 1154) ||
    (bossNumber > 1519 && bossNumber < 1535)
  ) {
    //use the Pans file
    if (DEBUG) {
      console.log(`I will load the Pans Data`);
    }
    const url = new URL(PanModifiers, import.meta.url);
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`
      );
    }
    data = await response.text();
  } else {
    //use the standard Troop Modifiers file
    if (DEBUG) {
      console.log(`I will load the Standard Boss Data`);
    }
    const url = new URL(StandardModifiers, import.meta.url);
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`
      );
    }
    data = await response.text();
  }
  const modifiers = data
    .split("\n")
    .map((row) => row.split(","))
    .map((r) => {
      r = r.filter((c) => {
        if (c) {
          if (c.length > 0) {
            return true;
          }
        }
        return false;
      });
      return r;
    })
    .filter((row) => {
      if (row.length > 0) {
        return true;
      }
      return false;
    });
  if (DEBUG) {
    console.log(
      `modifiers is \n${JSON.stringify(modifiers)}`,
      `\nmodifiers[0] is \n${JSON.stringify(modifiers[0])}`
    );
  }
  const index = modifiers[0].findIndex((s) => {
    return !s.localeCompare(`T${simulatorState.troopTier.get()}`);
  });
  if (DEBUG) {
    console.log(`found index ${index}`);
  }
  if (index >= 0) {
    const modifierRow = modifiers.find((m) => {
      return simulatorState.troopType.get().startsWith(m[0]);
    });
    if (modifierRow) {
      simulatorState.modifier.set(+modifierRow[index]);
    }
  }
};

export const GroundStats: BaseStats = [
  {
    tier: 1,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 100,
    defense: 300,
    hp: 600,
  },
  {
    tier: 2,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 140,
    defense: 410,
    hp: 810,
  },
  {
    tier: 3,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 190,
    defense: 550,
    hp: 1090,
  },
  {
    tier: 4,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 260,
    defense: 740,
    hp: 1470,
  },
  {
    tier: 5,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 350,
    defense: 1000,
    hp: 1980,
  },
  {
    tier: 6,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 470,
    defense: 1350,
    hp: 2670,
  },
  {
    tier: 7,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 630,
    defense: 1820,
    hp: 3600,
  },
  {
    tier: 8,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 850,
    defense: 2460,
    hp: 4860,
  },
  {
    tier: 9,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 1150,
    defense: 3320,
    hp: 6560,
  },
  {
    tier: 10,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 1550,
    defense: 4480,
    hp: 8860,
  },
  {
    tier: 11,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 1940,
    defense: 5600,
    hp: 11080,
  },
  {
    tier: 12,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 2425,
    defense: 7000,
    hp: 13850,
  },
  {
    tier: 13,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 2910,
    defense: 8400,
    hp: 16620,
  },
  {
    tier: 14,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 3570,
    defense: 10330,
    hp: 20440,
  },
  {
    tier: 15,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 4230,
    defense: 11760,
    hp: 24260,
  },
  {
    tier: 16,
    troopType: constants.ClassEnum.Enum["Ground Troops"],
    attack: 4920,
    defense: 13670,
    hp: 28240,
  },
];

export const ArcherStats: BaseStats = [
  {
    tier: 1,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 130,
    defense: 100,
    hp: 250,
  },
  {
    tier: 2,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 180,
    defense: 140,
    hp: 340,
  },
  {
    tier: 3,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 240,
    defense: 190,
    hp: 460,
  },
  {
    tier: 4,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 320,
    defense: 260,
    hp: 620,
  },
  {
    tier: 5,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 430,
    defense: 350,
    hp: 840,
  },
  {
    tier: 6,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 580,
    defense: 470,
    hp: 1130,
  },
  {
    tier: 7,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 780,
    defense: 630,
    hp: 1530,
  },
  {
    tier: 8,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 1050,
    defense: 850,
    hp: 2070,
  },
  {
    tier: 9,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 1420,
    defense: 1150,
    hp: 2790,
  },
  {
    tier: 10,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 1920,
    defense: 1550,
    hp: 3770,
  },
  {
    tier: 11,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 2400,
    defense: 1940,
    hp: 4720,
  },
  {
    tier: 12,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 3000,
    defense: 2425,
    hp: 5900,
  },
  {
    tier: 13,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 3450,
    defense: 2780,
    hp: 6780,
  },
  {
    tier: 14,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 4070,
    defense: 3280,
    hp: 8000,
  },
  {
    tier: 15,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 4690,
    defense: 3780,
    hp: 9220,
  },
  {
    tier: 16,
    troopType: constants.ClassEnum.Enum["Ranged Troops"],
    attack: 5460,
    defense: 4390,
    hp: 10730,
  },
];

export const MountedStats: BaseStats = [
  {
    tier: 1,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 220,
    defense: 100,
    hp: 400,
  },
  {
    tier: 2,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 300,
    defense: 140,
    hp: 540,
  },
  {
    tier: 3,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 410,
    defense: 190,
    hp: 730,
  },
  {
    tier: 4,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 550,
    defense: 260,
    hp: 990,
  },
  {
    tier: 5,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 740,
    defense: 350,
    hp: 1340,
  },
  {
    tier: 6,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 1000,
    defense: 470,
    hp: 1810,
  },
  {
    tier: 7,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 1350,
    defense: 630,
    hp: 2440,
  },
  {
    tier: 8,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 1820,
    defense: 850,
    hp: 3290,
  },
  {
    tier: 9,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 2460,
    defense: 1150,
    hp: 4440,
  },
  {
    tier: 10,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 3320,
    defense: 1550,
    hp: 5990,
  },
  {
    tier: 11,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 4150,
    defense: 1940,
    hp: 7490,
  },
  {
    tier: 12,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 5187,
    defense: 2425,
    hp: 9362,
  },
  {
    tier: 13,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 5800,
    defense: 2780,
    hp: 10480,
  },
  {
    tier: 14,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 6670,
    defense: 3280,
    hp: 12050,
  },
  {
    tier: 15,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 7540,
    defense: 3780,
    hp: 13620,
  },
  {
    tier: 16,
    troopType: constants.ClassEnum.Enum["Mounted Troops"],
    attack: 8780,
    defense: 4390,
    hp: 15850,
  },
];

export const SiegeStats: BaseStats = [
  {
    tier: 1,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 100,
    defense: 50,
    hp: 100,
  },
  {
    tier: 2,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 140,
    defense: 70,
    hp: 140,
  },
  {
    tier: 3,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 190,
    defense: 90,
    hp: 190,
  },
  {
    tier: 4,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 260,
    defense: 120,
    hp: 260,
  },
  {
    tier: 5,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 350,
    defense: 160,
    hp: 350,
  },
  {
    tier: 6,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 470,
    defense: 220,
    hp: 470,
  },
  {
    tier: 7,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 630,
    defense: 300,
    hp: 630,
  },
  {
    tier: 8,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 850,
    defense: 410,
    hp: 850,
  },
  {
    tier: 9,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 1150,
    defense: 550,
    hp: 1150,
  },
  {
    tier: 10,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 1550,
    defense: 740,
    hp: 1550,
  },
  {
    tier: 11,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 1940,
    defense: 930,
    hp: 1940,
  },
  {
    tier: 12,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 2425,
    defense: 1162,
    hp: 2425,
  },
  {
    tier: 13,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 2780,
    defense: 1300,
    hp: 2780,
  },
  {
    tier: 14,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 3280,
    defense: 1560,
    hp: 3280,
  },
  {
    tier: 15,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 3780,
    defense: 1790,
    hp: 3780,
  },
  {
    tier: 16,
    troopType: constants.ClassEnum.Enum["Siege Machines"],
    attack: 4400,
    defense: 2080,
    hp: 4400,
  },
];
