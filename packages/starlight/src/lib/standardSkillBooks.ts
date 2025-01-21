import * as constants from "../schemas/constants";

import { type SkillBook } from "../schemas/skillBooks";

/*
 * when adding a new sset of skill books to this file
 * remember to add it to AllStandardSkillBooks
 * at the bottom
 *
 * AllStandardSkillBooks is the default export.
 */

export const Luck: SkillBook[] = [
  {
    name: "Luck",
    level: 1,
    buff: {
      attribute: constants.Attribute.Enum["Double Items Drop Rate"],
      value: {
        number: 5,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Luck",
    level: 2,
    buff: {
      attribute: constants.Attribute.Enum["Double Items Drop Rate"],
      value: {
        number: 10,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Luck",
    level: 3,
    buff: {
      attribute: constants.Attribute.Enum["Double Items Drop Rate"],
      value: {
        number: 15,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Luck",
    level: 4,
    buff: {
      attribute: constants.Attribute.Enum["Double Items Drop Rate"],
      value: {
        number: 18,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
];
export const MarchSize: SkillBook[] = [
  {
    name: "March Size Increase",
    level: 1,
    buff: {
      attribute: constants.Attribute.Enum["March Size Capacity"],
      value: {
        number: 3,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "March Size Increase",
    level: 2,
    buff: {
      attribute: constants.Attribute.Enum["March Size Capacity"],
      value: {
        number: 6,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "March Size Increase",
    level: 3,
    buff: {
      attribute: constants.Attribute.Enum["March Size Capacity"],
      value: {
        number: 9,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "March Size Increase",
    level: 4,
    buff: {
      attribute: constants.Attribute.Enum["March Size Capacity"],
      value: {
        number: 12,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
];

export const MountedTroopAttack: SkillBook[] = [
  {
    name: "Mounted Troop Attack",
    level: 1,
    buff: {
      attribute: constants.Attribute.Enum.Attack,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      value: {
        number: 10,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop Attack",
    level: 2,
    buff: {
      attribute: constants.Attribute.Enum.Attack,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      value: {
        number: 15,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop Attack",
    level: 3,
    buff: {
      attribute: constants.Attribute.Enum.Attack,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      value: {
        number: 20,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop Attack",
    level: 4,
    buff: {
      attribute: constants.Attribute.Enum.Attack,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      value: {
        number: 25,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
];

export const MountedAttackAgainstMonster: SkillBook[] = [
  {
    name: "Mounted Troop Attack Against Monster",
    level: 1,
    buff: {
      attribute: constants.Attribute.Enum.Attack,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      condition: [constants.BuffCondition.Enum["Against Monsters"]],
      value: {
        number: 15,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop Attack Against Monster",
    level: 2,
    buff: {
      attribute: constants.Attribute.Enum.Attack,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      condition: [constants.BuffCondition.Enum["Against Monsters"]],
      value: {
        number: 25,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop Attack Against Monster",
    level: 3,
    buff: {
      attribute: constants.Attribute.Enum.Attack,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      condition: [constants.BuffCondition.Enum["Against Monsters"]],
      value: {
        number: 35,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop Attack Against Monster",
    level: 4,
    buff: {
      attribute: constants.Attribute.Enum.Attack,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      condition: [constants.BuffCondition.Enum["Against Monsters"]],
      value: {
        number: 45,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
];

export const MountedTroopDefense: SkillBook[] = [
  {
    name: "Mounted Troop Defense",
    level: 1,
    buff: {
      attribute: constants.Attribute.Enum.Defense,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      value: {
        number: 10,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop Defense",
    level: 2,
    buff: {
      attribute: constants.Attribute.Enum.Defense,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      value: {
        number: 15,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop Defense",
    level: 3,
    buff: {
      attribute: constants.Attribute.Enum.Defense,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      value: {
        number: 20,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop Defense",
    level: 4,
    buff: {
      attribute: constants.Attribute.Enum.Defense,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      value: {
        number: 25,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
];

export const MountedDefenseAgainstMonster: SkillBook[] = [
  {
    name: "Mounted Troop Defense Against Monster",
    level: 1,
    buff: {
      attribute: constants.Attribute.Enum.Defense,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      condition: [constants.BuffCondition.Enum["Against Monsters"]],
      value: {
        number: 15,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop Defense Against Monster",
    level: 2,
    buff: {
      attribute: constants.Attribute.Enum.Defense,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      condition: [constants.BuffCondition.Enum["Against Monsters"]],
      value: {
        number: 25,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop Defense Against Monster",
    level: 3,
    buff: {
      attribute: constants.Attribute.Enum.Defense,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      condition: [constants.BuffCondition.Enum["Against Monsters"]],
      value: {
        number: 35,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop Defense Against Monster",
    level: 4,
    buff: {
      attribute: constants.Attribute.Enum.Defense,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      condition: [constants.BuffCondition.Enum["Against Monsters"]],
      value: {
        number: 45,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
];

export const MountedTroopHP: SkillBook[] = [
  {
    name: "Mounted Troop HP",
    level: 1,
    buff: {
      attribute: constants.Attribute.Enum.HP,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      value: {
        number: 10,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop HP",
    level: 2,
    buff: {
      attribute: constants.Attribute.Enum.HP,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      value: {
        number: 15,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop HP",
    level: 3,
    buff: {
      attribute: constants.Attribute.Enum.HP,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      value: {
        number: 20,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop HP",
    level: 4,
    buff: {
      attribute: constants.Attribute.Enum.HP,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      value: {
        number: 25,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
];

export const MountedHPAgainstMonster: SkillBook[] = [
  {
    name: "Mounted Troop HP Against Monster",
    level: 1,
    buff: {
      attribute: constants.Attribute.Enum.HP,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      condition: [constants.BuffCondition.Enum["Against Monsters"]],
      value: {
        number: 15,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop HP Against Monster",
    level: 2,
    buff: {
      attribute: constants.Attribute.Enum.HP,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      condition: [constants.BuffCondition.Enum["Against Monsters"]],
      value: {
        number: 25,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop HP Against Monster",
    level: 3,
    buff: {
      attribute: constants.Attribute.Enum.HP,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      condition: [constants.BuffCondition.Enum["Against Monsters"]],
      value: {
        number: 35,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
  {
    name: "Mounted Troop HP Against Monster",
    level: 4,
    buff: {
      attribute: constants.Attribute.Enum.HP,
      class: constants.ClassEnum.Enum["Mounted Troops"],
      condition: [constants.BuffCondition.Enum["Against Monsters"]],
      value: {
        number: 45,
        unit: constants.Unit.Enum.percentage,
      },
    },
  },
];

const AllStandardSkillBooks = [
  ...Luck,
  ...MarchSize,
  ...MountedTroopAttack,
  ...MountedAttackAgainstMonster,
  ...MountedTroopDefense,
  ...MountedDefenseAgainstMonster,
  ...MountedTroopHP,
  ...MountedHPAgainstMonster,
];

export default AllStandardSkillBooks;
