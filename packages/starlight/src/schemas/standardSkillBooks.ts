import { z } from "zod";

import * as constants from "./constants";

import { SkillBook } from "./skillBooks";

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
