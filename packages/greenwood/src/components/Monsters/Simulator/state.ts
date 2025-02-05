import { signal, type Signal } from "@lit-labs/signals";
import { SignalObject } from 'signal-utils/object';

import { z } from "zod";

import * as constants from "../../../schemas/constants.ts";

export const SimulatorBuff = z.object({
  attack: z.number().min(0).default(0),
  defense: z.number().min(0).default(0),
  hp: z.number().min(0).default(0),
});
export type SimulatorBuff = z.infer<typeof SimulatorBuff>;

export const SimulatorBuffGroup = z.object({
  ground: SimulatorBuff,
  archer: SimulatorBuff,
  mounted: SimulatorBuff,
  siege: SimulatorBuff,
});
export type SimulatorBuffGroup = z.infer<typeof SimulatorBuffGroup>;

export const SimulatorDebuff = SimulatorBuff.pick({
  attack: true,
  defense: true,
});
export type SimulatorDebuff = z.infer<typeof SimulatorDebuff>;

class SimulatorState {
  accessor solo: Signal.State<boolean> = signal(false);

  accessor troopTier: Signal.State<number> = signal(1);

  accessor troopType: Signal.State<constants.ClassEnum> = signal(
    constants.ClassEnum.Enum["Mounted Troops"]
  );

  accessor marchSize: Signal.State<number> = signal(0);

  private _BuffData = createData();

  }
}

const state = new SimulatorState();

export default state;

const createData = () => {
  const data = [];
  for (let i = 0; i < 4; i++) {
    data.push(new SignalObject({
      ground: {
        attack: 0,
        defense: 0,
        hp: 0,
      },
      archer: {
        attack: 0,
        defense: 0,
        hp: 0,
      },
      mounted: {
        attack: 0,
        defense: 0,
        hp: 0,
      },
      siege: {
        attack: 0,
        defense: 0,
        hp: 0,
      },
    }));
  }
  data.push(new SignalObject({
    ground: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    archer: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    mounted: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    siege: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
  }));
  data.push(new SignalObject({
    ground: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    archer: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    mounted: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    siege: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
  }));
  data.push(new SignalObject({
    ground: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    archer: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    mounted: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    siege: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
  }));
  data.push(new SignalObject({
    ground: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    archer: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    mounted: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    siege: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
  }));
  data.push(new SignalObject({
    ground: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    archer: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    mounted: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    siege: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
  }));
  return data;
};
