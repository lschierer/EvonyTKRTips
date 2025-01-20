import * as constants from "@schemas/constants";

import rallySpotBaseMarch from "@lib/rallySpot";

import { GeneralPair } from "@schemas/generals";

import * as stores from "../store";

import debugFunction from "@lib/debug";
const DEBUG = debugFunction("components/generals/generics/EvAnsScore.ts");

type EvansTroopAttribute = Record<
  constants.BuffActivation,
  Record<constants.GeneralType, number>
>;

const ArbitraryBase = 3218900;
/*
 * Evony Answers SpreadSheet
 * EM.Power Ratings, Mounted
 * Column S
 * (row 891 for the first PVM Mounted General)
 */
/*
   AttackAttribute = defaults to 6670 // Cell D975 is the T14 Attribute.
   MountedKeepBasePercentage = 1180.0% //Cell T703
   MountedBuffFromSubs = defaults to 0 //Cell T704
   GeneralGearBuffs = defaults to 650.1 //Cell T760
   Dragon/BeastBuffs = defaults to 197.2 //Cell T762
   FlexibleSkillBookBuffs = defaults to 20% //Cell T769 & T774
   StandardSkillBookBuffs = defaults to 45%  //Cell T770 & T775

   TotalMountedPercentageBuffs =  (defaults to 2092.3%)//Cell T780 becomes L883
     MountedKeepBasePercentage (defaults to 1180.0%) +
     MountedBuffFromSubs (defaults to 0) +
     GeneralGearBuffs (defaults to 80 + 50 +26.3 +29 +26.3 + 28 +20 +30 +20 +35 +30 +30 +35 +28.3 +29 +27.2 +26 +20 +15 +50 +15 = 650.1%)+
     Dragon/BeastBuffs (defaults to 197.2) +
     FlexibleSkillBookBuffs (defaults to 20) +
     StandardSkillBookBuffs (defaults to 45);

   FlatAttribute = //Cell T157 becomess M194
   TotalMountedFlatBuffs = //Cell T846 becomes M883
     MountedKeepBaseFlat = defaults to 200 //Cell T784
     GeneralGearBuffsFlat = defaults to 0 //Cells T786 to T838
     Dragon/BeastBuffsFlat = defaults to 0 //Cell T840
     FlexibleSkillBookBuffsFlat = defaults to 625 //Cells T842 and T844

     GeneralsAttackPercentage // Column L (Cell L891) (compute the same way the store does the BuffSet.Attack.total)

     TotalAttackPercentage = TotalMountedPercentageBuffs + GeneralsAttackPercentage; //Column M (cell M891)

     EvAnsMountedPvMAttackMultiplier = 2.81859 // Cell D885

     TotalMarchSize = defaults to arbitrary 4,318,900 //Cell P183
     /*
      * The Spreadsheet seems to be set up so that I create a custom PvP march partly *by hand*
      * and computes a march size from that PvP march.
      *

     // EvAns is doing something wierd with march size
     // total troops is the RallySpot at k40 * the march buff for the extra troops
     // then the extra troops plus an arbitrary user-entered number for the total troops.
     BaseTroops = 3,218,900 // Cell J883
       MountedT15s = defaults to 550000 // Cell I883

     RallySpotBaseMarch = defaults to 550000 // Cell P10 becomes I194

     MarchSizeBuff (compute as the store does MarchSizeIncrease.total)

     ExtraTroops = MarchSizeBuff*RallySpotBaseMarch

     //** EvAns is ignoring extra troops from armor & mayors
     //** For PvM it goes based on Rally Spot and General alone.
     //** for PvP it essentially has you *tell* it a march size for some aspects of the formula
     TotalTroops = // Column J Cell J891
       BaseTroops + ExtraTroops
   (
     (
       AttackAttribute * ( 1 + TotalAttackPercentage ) +
       TotalMountedFlatBuffs
     ) * TotalTroops
   ) * EvAnsMountedPvMAttackMultiplier / 1000000000

   several values must be recomputed because when the store creates a generalPairStat object,
   the store _itself_ is initializing BuffSet and MarchSizeIncrease (for example), and so cannot pass
   these objects into the generalPairStat object's constructor.  There is a chicken/egg problem I haven't
   solved.


 */
export const EvAnsAttack = (p: GeneralPair) => {
  if (DEBUG) {
    console.log(`computing EvAns Attack for ${p.primary.id}/${p.secondary.id}`);
  }

  const useCase = stores.generalUseCase.value;

  const PairType = stores.generalSpecalist.value;

  const TotalFlatBuffs = AttackFlatBuffs[useCase][PairType];
  const TotalPercentageBuffs = AttackPercentageBuffs[useCase][PairType];
  const Multiplier = AttackMultiplier[useCase][PairType] / 1000000000;

  const MarchSizeBuff = p.MarchSizeIncrease ? p.MarchSizeIncrease.total : 0;
  const BaseTroops = +rallySpotBaseMarch.options[40];
  const ExtraTroops = (BaseTroops * MarchSizeBuff) / 100; //Excel converts percentages to display properly for him. I can't.
  const TotalTroops = ExtraTroops + ArbitraryBase;
  const GeneralsTotalAttackPercentage = p.BuffSet
    ? p.BuffSet.attack.total
      ? p.BuffSet.attack.total
      : 0
    : 0;

  const TotalAttackPercentage =
    (TotalPercentageBuffs + GeneralsTotalAttackPercentage) / 100; // Same thing here, convert this to a percentage.

  const scoresetAttack = +(
    (AttackAttribute[useCase][PairType] * (1 + TotalAttackPercentage) +
      TotalFlatBuffs) *
    TotalTroops *
    Multiplier
  ).toFixed(1);

  if (DEBUG) {
    console.log(
      `EvAns Attack for ${p.primary.id}/${p.secondary.id}: ${scoresetAttack}`
    );
  }
  return scoresetAttack;
};

const AttackAttribute: EvansTroopAttribute = {
  [constants.BuffActivation.Enum.PvM]: {
    [constants.GeneralType.Enum.mounted_specialist]: 6670,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Attacking]: {
    [constants.GeneralType.Enum.mounted_specialist]: 5452, //Cell D196 is an average of T11 to T14
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Reinforcing]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Wall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Mayor]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Overall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
};

const AttackFlatBuffs: EvansTroopAttribute = {
  [constants.BuffActivation.Enum.PvM]: {
    [constants.GeneralType.Enum.mounted_specialist]: 825,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Attacking]: {
    [constants.GeneralType.Enum.mounted_specialist]: 975.0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Reinforcing]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Wall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Mayor]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Overall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
};

const AttackPercentageBuffs: EvansTroopAttribute = {
  [constants.BuffActivation.Enum.PvM]: {
    [constants.GeneralType.Enum.mounted_specialist]: 2092.3,
    [constants.GeneralType.Enum.ground_specialist]: 1630.6,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Attacking]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Reinforcing]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Wall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Mayor]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Overall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
};

const AttackMultiplier: EvansTroopAttribute = {
  [constants.BuffActivation.Enum.PvM]: {
    [constants.GeneralType.Enum.mounted_specialist]: 2.81859,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Attacking]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Reinforcing]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Wall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Mayor]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Overall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
};

export const EvAnsDefense = (p: GeneralPair) => {
  if (DEBUG) {
    console.log(
      `computing Defense Attack for ${p.primary.id}/${p.secondary.id}`
    );
  }

  const useCase = stores.generalUseCase.value;

  const PairType = stores.generalSpecalist.value;

  const TotalFlatBuffs = DefenseFlatBuffs[useCase][PairType];
  const TotalPercentageBuffs = DefensePercentageBuffs[useCase][PairType];
  const Multiplier = DefenseMultiplier[useCase][PairType] / 1000000000;

  const MarchSizeBuff = p.MarchSizeIncrease ? p.MarchSizeIncrease.total : 0;
  const BaseTroops = +rallySpotBaseMarch.options[40];
  const ExtraTroops = (BaseTroops * MarchSizeBuff) / 100; //Excel converts percentages to display properly for him. I can't.
  const TotalTroops = ExtraTroops + ArbitraryBase;
  const GeneralsTotalDefensePercentage = p.BuffSet
    ? p.BuffSet.defense.total
      ? p.BuffSet.defense.total
      : 0
    : 0;

  const TotalPercentage =
    (TotalPercentageBuffs + GeneralsTotalDefensePercentage) / 100; // Same thing here, convert this to a percentage.

  const scoreset = +(
    (DefenseAttribute[useCase][PairType] * (1 + TotalPercentage) +
      TotalFlatBuffs) *
    TotalTroops *
    Multiplier
  ).toFixed(1);

  if (DEBUG) {
    console.log(
      `EvAns Defense for ${p.primary.id}/${p.secondary.id}: ${scoreset}`
    );
  }
  return scoreset;
};

const DefenseAttribute: EvansTroopAttribute = {
  [constants.BuffActivation.Enum.PvM]: {
    [constants.GeneralType.Enum.mounted_specialist]: 4400,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Attacking]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Reinforcing]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Wall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Mayor]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Overall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
};

const DefenseFlatBuffs: EvansTroopAttribute = {
  [constants.BuffActivation.Enum.PvM]: {
    [constants.GeneralType.Enum.mounted_specialist]: 2242,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Attacking]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Reinforcing]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Wall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Mayor]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Overall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
};

const DefensePercentageBuffs: EvansTroopAttribute = {
  [constants.BuffActivation.Enum.PvM]: {
    [constants.GeneralType.Enum.mounted_specialist]: 1408.7,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Attacking]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Reinforcing]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Wall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Mayor]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Overall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
};

const DefenseMultiplier: EvansTroopAttribute = {
  [constants.BuffActivation.Enum.PvM]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0.04546,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Attacking]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Reinforcing]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Wall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Mayor]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Overall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
};

export const EvAnsHP = (p: GeneralPair) => {
  if (DEBUG) {
    console.log(`computing HP Attack for ${p.primary.id}/${p.secondary.id}`);
  }

  const useCase = stores.generalUseCase.value;

  const PairType = stores.generalSpecalist.value;

  const TotalFlatBuffs = HPFlatBuffs[useCase][PairType];
  const TotalPercentageBuffs = HPPercentageBuffs[useCase][PairType];
  const Multiplier = HPMultiplier[useCase][PairType] / 1000000000;

  const MarchSizeBuff = p.MarchSizeIncrease ? p.MarchSizeIncrease.total : 0;
  const BaseTroops = +rallySpotBaseMarch.options[40];
  const ExtraTroops = (BaseTroops * MarchSizeBuff) / 100; //Excel converts percentages to display properly for him. I can't.
  const TotalTroops = ExtraTroops + ArbitraryBase;
  const GeneralsTotalPercentage = p.BuffSet
    ? p.BuffSet.hp.total
      ? p.BuffSet.hp.total
      : 0
    : 0;

  const TotalPercentage =
    (TotalPercentageBuffs + GeneralsTotalPercentage) / 100; // Same thing here, convert this to a percentage.

  const scoreset = +(
    (HPAttribute[useCase][PairType] * (1 + TotalPercentage) + TotalFlatBuffs) *
    TotalTroops *
    Multiplier
  ).toFixed(1);

  if (DEBUG) {
    console.log(`EvAns HP for ${p.primary.id}/${p.secondary.id}: ${scoreset}`);
  }
  return scoreset;
};
const HPAttribute: EvansTroopAttribute = {
  [constants.BuffActivation.Enum.PvM]: {
    [constants.GeneralType.Enum.mounted_specialist]: 12050,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Attacking]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Reinforcing]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Wall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Mayor]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Overall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
};

const HPFlatBuffs: EvansTroopAttribute = {
  [constants.BuffActivation.Enum.PvM]: {
    [constants.GeneralType.Enum.mounted_specialist]: 5696.0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Attacking]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Reinforcing]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Wall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Mayor]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Overall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
};

const HPPercentageBuffs: EvansTroopAttribute = {
  [constants.BuffActivation.Enum.PvM]: {
    [constants.GeneralType.Enum.mounted_specialist]: 2333.4,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Attacking]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Reinforcing]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Wall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Mayor]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Overall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
};

const HPMultiplier: EvansTroopAttribute = {
  [constants.BuffActivation.Enum.PvM]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0.08299,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Attacking]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Reinforcing]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Wall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Mayor]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
  [constants.BuffActivation.Enum.Overall]: {
    [constants.GeneralType.Enum.mounted_specialist]: 0,
    [constants.GeneralType.Enum.ground_specialist]: 0,
    [constants.GeneralType.Enum.ranged_specialist]: 0,
    [constants.GeneralType.Enum.siege_specialist]: 0,
    [constants.GeneralType.Enum.mayor]: 0,
    [constants.GeneralType.Enum.wall]: 0,
  },
};
