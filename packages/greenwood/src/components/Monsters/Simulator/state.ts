import { signal, Signal } from "@lit-labs/signals";
import { SignalArray } from "signal-utils/array";

import { z } from "zod";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("components/Monsters/Simulator/state.ts");

const BuffTypes = z.enum([
  "Basic",
  "March",
  "Monster",
  "Misc",
  "Rally",
  "Flat",
]);
type BuffTypes = z.infer<typeof BuffTypes>;

import * as constants from "../../../schemas/constants.ts";

export const BuffTableRowUnit = z.object({
  attack: z.number().min(0).default(0),
  defense: z.number().min(0).default(0),
  hp: z.number().min(0).default(0),
});
export type BuffTableRowUnit = z.infer<typeof BuffTableRowUnit>;

export const BuffTableRow = z.object({
  ground: BuffTableRowUnit,
  archer: BuffTableRowUnit,
  mounted: BuffTableRowUnit,
  siege: BuffTableRowUnit,
});
export type BuffTableRow = z.infer<typeof BuffTableRow>;

export class SimulatorBuff extends Object {
  accessor troopType: Signal.State<constants.ClassEnum> = signal(
    constants.ClassEnum.Enum["Mounted Troops"]
  );

  accessor AttackBuffs: Signal.State<number> = signal(0);
  accessor DefenseBuffs: Signal.State<number> = signal(0);
  accessor HPBuffs: Signal.State<number> = signal(0);

  accessor AttackDebuff: Signal.State<number> = signal(0);
  accessor DefenseDebuff: Signal.State<number> = signal(0);

  accessor myRowIndex: Signal.State<number> = signal(0);

  public getAsTableData = new Signal.Computed(() => {
    const index = this.myRowIndex.get();
    if (index < BuffTypes.options.length) {
      const attack = this.AttackBuffs.get();
      const defense = this.DefenseBuffs.get();
      const hp = this.HPBuffs.get();
      return {
        attack,
        defense,
        hp,
      } as BuffTableRowUnit;
    } else if (index == 6) {
      return {
        attack: this.AttackDebuff.get(),
        defense: this.DefenseDebuff.get(),
        hp: 0,
      };
    } else {
      const attack = this.AttackBuffs.get();
      const defense = this.DefenseBuffs.get();
      const hp = this.HPBuffs.get();
      return {
        attack,
        defense,
        hp,
      } as BuffTableRowUnit;
    }
  });
}

class SimulatorState extends Object {
  accessor solo: Signal.State<boolean> = signal(false);

  accessor troopTier: Signal.State<number> = signal(1);

  accessor troopType: Signal.State<constants.ClassEnum> = signal(
    constants.ClassEnum.Enum["Mounted Troops"]
  );

  accessor marchSize: Signal.State<number> = signal(0);

  accessor mountedBuffs: SimulatorBuff[];
  accessor groundBuffs: SimulatorBuff[];
  accessor archerBuffs: SimulatorBuff[];
  accessor siegeBuffs: SimulatorBuff[];

  public getAsTableData = new Signal.Computed(() => {
    const data = new Array<BuffTableRow>();
    for (let index = 0; index < 9; index++) {
      const ground = this.groundBuffs[index].getAsTableData.get();
      const mounted = this.mountedBuffs[index].getAsTableData.get();
      const archer = this.archerBuffs[index].getAsTableData.get();
      const siege = this.siegeBuffs[index].getAsTableData.get();

      data.push({
        ground,
        mounted,
        archer,
        siege,
      });
    }
    return data;
  });

  public TotalAtack = new Signal.Computed(() => {
    let attack = 0;

    const stop = this.solo.get() ? 4 : 5;
    for (let i = 0; i < stop; i++) {
      attack += this.troopType
        .get()
        .localeCompare(constants.ClassEnum.Enum["Ground Troops"])
        ? this.troopType
            .get()
            .localeCompare(constants.ClassEnum.Enum["Mounted Troops"])
          ? this.troopType
              .get()
              .localeCompare(constants.ClassEnum.Enum["Ranged Troops"])
            ? this.troopType
                .get()
                .localeCompare(constants.ClassEnum.Enum["Siege Machines"])
              ? 0
              : this.siegeBuffs[i].AttackBuffs.get()
            : this.archerBuffs[i].AttackBuffs.get()
          : this.mountedBuffs[i].AttackBuffs.get()
        : this.groundBuffs[i].AttackBuffs.get();
    }
    //TODO: right now the 1 is static below. It should be variable based on the
    // alliance boss modifier.
    return 1 + attack;
  });

  public FlatAttack = new Signal.Computed(() => {
    return this.troopType
      .get()
      .localeCompare(constants.ClassEnum.Enum["Ground Troops"])
      ? this.troopType
          .get()
          .localeCompare(constants.ClassEnum.Enum["Mounted Troops"])
        ? this.troopType
            .get()
            .localeCompare(constants.ClassEnum.Enum["Ranged Troops"])
          ? this.troopType
              .get()
              .localeCompare(constants.ClassEnum.Enum["Siege Machines"])
            ? 0
            : this.siegeBuffs[5].AttackBuffs.get()
          : this.archerBuffs[5].AttackBuffs.get()
        : this.mountedBuffs[5].AttackBuffs.get()
      : this.groundBuffs[5].AttackBuffs.get();
  });

  public TotalDefense = new Signal.Computed(() => {
    let defense = 0;
    const stop = this.solo.get() ? 4 : 5;
    for (let i = 0; i < stop; i++) {
      defense += this.troopType
        .get()
        .localeCompare(constants.ClassEnum.Enum["Ground Troops"])
        ? this.troopType
            .get()
            .localeCompare(constants.ClassEnum.Enum["Mounted Troops"])
          ? this.troopType
              .get()
              .localeCompare(constants.ClassEnum.Enum["Ranged Troops"])
            ? this.troopType
                .get()
                .localeCompare(constants.ClassEnum.Enum["Siege Machines"])
              ? 0
              : this.siegeBuffs[i].DefenseBuffs.get()
            : this.archerBuffs[i].DefenseBuffs.get()
          : this.mountedBuffs[i].DefenseBuffs.get()
        : this.groundBuffs[i].DefenseBuffs.get();
    }

    return defense;
  });

  public FlatDefense = new Signal.Computed(() => {
    return this.troopType
      .get()
      .localeCompare(constants.ClassEnum.Enum["Ground Troops"])
      ? this.troopType
          .get()
          .localeCompare(constants.ClassEnum.Enum["Mounted Troops"])
        ? this.troopType
            .get()
            .localeCompare(constants.ClassEnum.Enum["Ranged Troops"])
          ? this.troopType
              .get()
              .localeCompare(constants.ClassEnum.Enum["Siege Machines"])
            ? 0
            : this.siegeBuffs[5].DefenseBuffs.get()
          : this.archerBuffs[5].DefenseBuffs.get()
        : this.mountedBuffs[5].DefenseBuffs.get()
      : this.groundBuffs[5].DefenseBuffs.get();
  });

  public TotalHP = new Signal.Computed(() => {
    let hp = 0;
    const stop = this.solo.get() ? 4 : 5;
    for (let i = 0; i < stop; i++) {
      hp = this.troopType
        .get()
        .localeCompare(constants.ClassEnum.Enum["Ground Troops"])
        ? this.troopType
            .get()
            .localeCompare(constants.ClassEnum.Enum["Mounted Troops"])
          ? this.troopType
              .get()
              .localeCompare(constants.ClassEnum.Enum["Ranged Troops"])
            ? this.troopType
                .get()
                .localeCompare(constants.ClassEnum.Enum["Siege Machines"])
              ? 0
              : this.siegeBuffs[i].HPBuffs.get()
            : this.archerBuffs[i].HPBuffs.get()
          : this.mountedBuffs[i].HPBuffs.get()
        : this.groundBuffs[i].HPBuffs.get();
    }
    return hp;
  });

  public FlatHP = new Signal.Computed(() => {
    return this.troopType
      .get()
      .localeCompare(constants.ClassEnum.Enum["Ground Troops"])
      ? this.troopType
          .get()
          .localeCompare(constants.ClassEnum.Enum["Mounted Troops"])
        ? this.troopType
            .get()
            .localeCompare(constants.ClassEnum.Enum["Ranged Troops"])
          ? this.troopType
              .get()
              .localeCompare(constants.ClassEnum.Enum["Siege Machines"])
            ? 0
            : this.siegeBuffs[5].HPBuffs.get()
          : this.archerBuffs[5].HPBuffs.get()
        : this.mountedBuffs[5].HPBuffs.get()
      : this.groundBuffs[5].HPBuffs.get();
  });

  public setAttackBuff = (
    troopType: constants.ClassEnum,
    index: number,
    value: number
  ) => {
    const key = BuffTypes.options[index];
    if (DEBUG) {
      console.log(
        `setAttackBuff for troop type ${troopType} with key ${key} and value ${value}`
      );
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Mounted Troops"])) {
      if (index < this.mountedBuffs.length) {
        if (index != 6) {
          this.mountedBuffs[index].AttackBuffs.set(value);
        }
      }
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Ground Troops"])) {
      if (index < this.groundBuffs.length) {
        if (index != 6) {
          this.groundBuffs[index].AttackBuffs.set(value);
        }
      }
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Ranged Troops"])) {
      if (index < this.archerBuffs.length) {
        if (index != 6) {
          this.archerBuffs[index].AttackBuffs.set(value);
        }
      }
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Siege Machines"])) {
      if (index < this.siegeBuffs.length) {
        if (index != 6) {
          this.siegeBuffs[index].AttackBuffs.set(value);
        }
      }
    }
  };

  public setDefenseBuff = (
    troopType: constants.ClassEnum,
    index: number,
    value: number
  ) => {
    const key = BuffTypes.options[index];
    if (DEBUG) {
      console.log(
        `setDefenseBuff for troop type ${troopType} with key ${key} and value ${value}`
      );
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Mounted Troops"])) {
      if (index < this.mountedBuffs.length) {
        if (index != 6) {
          this.mountedBuffs[index].DefenseBuffs.set(value);
        }
      }
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Ground Troops"])) {
      if (index < this.groundBuffs.length) {
        if (index != 6) {
          this.groundBuffs[index].DefenseBuffs.set(value);
        }
      }
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Ranged Troops"])) {
      if (index < this.archerBuffs.length) {
        if (index != 6) {
          this.archerBuffs[index].DefenseBuffs.set(value);
        }
      }
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Siege Machines"])) {
      if (index < this.siegeBuffs.length) {
        if (index != 6) {
          this.siegeBuffs[index].DefenseBuffs.set(value);
        }
      }
    }
  };

  public setHPBuff = (
    troopType: constants.ClassEnum,
    index: number,
    value: number
  ) => {
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Mounted Troops"])) {
      if (index < this.mountedBuffs.length) {
        if (index != 6) {
          this.mountedBuffs[index].HPBuffs.set(value);
        }
      }
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Ground Troops"])) {
      if (index < this.groundBuffs.length) {
        if (index != 6) {
          this.groundBuffs[index].HPBuffs.set(value);
        }
      }
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Ranged Troops"])) {
      if (index < this.archerBuffs.length) {
        if (index != 6) {
          this.archerBuffs[index].HPBuffs.set(value);
        }
      }
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Siege Machines"])) {
      if (index < this.siegeBuffs.length) {
        if (index != 6) {
          this.siegeBuffs[index].HPBuffs.set(value);
        }
      }
    }
  };

  public setAttackDebuff = (troopType: constants.ClassEnum, value: number) => {
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Mounted Troops"])) {
      this.mountedBuffs[6].AttackDebuff.set(value);
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Ground Troops"])) {
      this.groundBuffs[6].AttackDebuff.set(value);
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Ranged Troops"])) {
      this.archerBuffs[6].AttackDebuff.set(value);
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Siege Machines"])) {
      this.siegeBuffs[6].AttackDebuff.set(value);
    }
  };

  public getAttackDebuff = (troopType: constants.ClassEnum) => {
    return troopType.localeCompare(constants.ClassEnum.Enum["Mounted Troops"])
      ? troopType.localeCompare(constants.ClassEnum.Enum["Ground Troops"])
        ? troopType.localeCompare(constants.ClassEnum.Enum["Ranged Troops"])
          ? troopType.localeCompare(constants.ClassEnum.Enum["Siege Machines"])
            ? -1
            : this.siegeBuffs[6].AttackDebuff.get()
          : this.archerBuffs[6].AttackDebuff.get()
        : this.groundBuffs[6].AttackDebuff.get()
      : this.mountedBuffs[6].AttackDebuff.get();
  };

  public getDefenseDebuff = (troopType: constants.ClassEnum) => {
    return troopType.localeCompare(constants.ClassEnum.Enum["Mounted Troops"])
      ? troopType.localeCompare(constants.ClassEnum.Enum["Ground Troops"])
        ? troopType.localeCompare(constants.ClassEnum.Enum["Ranged Troops"])
          ? troopType.localeCompare(constants.ClassEnum.Enum["Siege Machines"])
            ? -1
            : this.siegeBuffs[6].DefenseDebuff.get()
          : this.archerBuffs[6].DefenseDebuff.get()
        : this.groundBuffs[6].DefenseDebuff.get()
      : this.mountedBuffs[6].DefenseDebuff.get();
  };

  public setDefenseDebuff = (troopType: constants.ClassEnum, value: number) => {
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Mounted Troops"])) {
      this.mountedBuffs[6].DefenseDebuff.set(value);
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Ground Troops"])) {
      this.groundBuffs[6].DefenseDebuff.set(value);
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Ranged Troops"])) {
      this.archerBuffs[6].DefenseDebuff.set(value);
    }
    if (!troopType.localeCompare(constants.ClassEnum.Enum["Siege Machines"])) {
      this.siegeBuffs[6].DefenseDebuff.set(value);
    }
  };

  constructor() {
    super();

    this.mountedBuffs = SignalArray.from(Array(9), (_, index) => {
      const r = new SimulatorBuff();
      r.myRowIndex.set(index);
      r.troopType.set(constants.ClassEnum.Enum["Mounted Troops"]);
      return r;
    });

    this.groundBuffs = SignalArray.from(Array(9), (_, index) => {
      const r = new SimulatorBuff();
      r.myRowIndex.set(index);
      r.troopType.set(constants.ClassEnum.Enum["Ground Troops"]);
      return r;
    });
    this.archerBuffs = SignalArray.from(Array(9), (_, index) => {
      const r = new SimulatorBuff();
      r.myRowIndex.set(index);
      r.troopType.set(constants.ClassEnum.Enum["Ranged Troops"]);
      return r;
    });
    this.siegeBuffs = SignalArray.from(Array(9), (_, index) => {
      const r = new SimulatorBuff();
      r.myRowIndex.set(index);
      r.troopType.set(constants.ClassEnum.Enum["Siege Machines"]);
      return r;
    });
  }
}

const state = new SimulatorState();

export default state;
