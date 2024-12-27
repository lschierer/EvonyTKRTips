import {
  Tabulator,
  AccessorModule,
  ColumnCalcsModule,
  DataTreeModule,
  EditModule,
  FilterModule,
  FormatModule,
  MutatorModule,
  ReactiveDataModule,
  ResponsiveLayoutModule,
  ResizeColumnsModule,
  SortModule,
} from "tabulator-tables";
Tabulator.registerModule([
  AccessorModule,
  ColumnCalcsModule,
  DataTreeModule,
  EditModule,
  FilterModule,
  FormatModule,
  MutatorModule,
  ReactiveDataModule,
  ResponsiveLayoutModule,
  ResizeColumnsModule,
  SortModule,
]);
import { General, GeneralType } from "@schemas/generals";
import * as constants from "@schemas/constants";

import { type StoreValue, subscribeKeys } from "nanostores";

import * as stores from "./store";

import * as d3 from "d3";

const DEBUG = true;

export type TableData = {
  primary: General;
  secondary: General;
};

export const definePairs = () => {
  const generals = stores.generals.get();
  const pairs = new Array<TableData>();

  if (generals.length == 0) {
    return new Array<TableData>();
  } else {
    const permutations = d3.cross(generals, generals).filter((pair) => {
      return pair[0].id.localeCompare(pair[1].id);
    });
    if (DEBUG) {
      console.log(
        `identified ${permutations.length} pairs, some of which conflict.`
      );
    }
    permutations.map((pair) => {
      const td: TableData = {
        primary: pair[0],
        secondary: pair[1],
      };
      /*if (DEBUG) {
        console.log(
          `pusing pair ${td.primary.id}/${td.secondary.id}: ${JSON.stringify(td)}`
        );
        }*/
      pairs.push(td);
    });
  }
  if (DEBUG) {
    return pairs.filter((predicate) => {
      return !predicate.primary.id.localeCompare("Aethelflaed");
    });
  } else {
    return pairs;
  }
};

const overallToughness = "Overall Toughness";
const overallAttack = "Overall Attack";

let subscribed = false;

export const defineTable = () => {
  const tableData: TableData[] = definePairs();
  stores.generals.listen((value, oldvalue) => {
    if (DEBUG) {
      console.log(`stores.listen from defineTable called`);
    }
    const data = value.map((datum) => {
      const td = definePairs();
      table.replaceData(td);
    });
  });
  const table = new Tabulator("#generals-table", {
    data: tableData,
    reactiveData: true,
    layout: "fitDataFill",
    columns: [
      {
        title: "Primary",
        field: "primary.id",
        width: "20vw",
        sorter: "string",
        resizable: true,
      },
      {
        title: "Secondary",
        field: "secondary.id",
        width: "20vw",
        sorter: "string",
        resizable: true,
      },
      {
        title: overallAttack,
        headerWordWrap: true,
        field: "overallAttack",
        sorter: "number",
        mutator: overallAttackMutator,
        resizable: true,
      },

      {
        title: overallToughness,
        headerWordWrap: true,
        field: "overallToughness",
        mutator: overallToughnessMutator,
        visible: true,
        resizable: true,
      },
      {
        title: "Details",
        field: "details",
        visible: false,
        columns: [
          {
            title: "basic attributes",
            field: "primary.basic_attributes",
            visible: false,
            columns: [
              {
                title: "attack",
                field: "basic_attributes.attack",
                visible: false,
                mutator: attackMutator,
                mutateLink: ["overallAttack"],
              },
              {
                title: "defense",
                field: "basic_attributes.defense",
                visible: false,
                mutator: defenseMutator,
                mutateLink: ["overallToughness"],
              },
              {
                title: "leadership",
                field: "basic_attributes.leadership",
                visible: false,
                mutator: leadershipMutator,
                mutateLink: ["overallToughness"],
              },
              {
                title: "politics",
                field: "basic_attributes.politics",
                visible: false,
                mutator: politicsMutator,
              },
            ],
          },
          {
            title: "level",
            field: "primary.level",
            visible: false,
            mutateLink: ["overallAttack", "overallToughness"],
          },
        ],
      },
    ],
  });
  table.on("dataProcessed", function () {
    if (DEBUG) {
      console.log(`dataProcessed event`);
    }
    if (!subscribed) {
      subscribed = true;

      subscribeKeys(
        stores.selectedValues,
        ["level", "ascending", "stars"],
        (value, oldValue?, changed?: string[]) => {
          const rows: TableData[] = new Array<TableData>();
          if (changed && changed.includes("level")) {
            if (DEBUG) {
              console.log(`level is ${value.level}`);
            }
            rows.push(
              ...table.getData().map((row: TableData) => {
                const td: TableData = {
                  primary: {
                    ascending: row.primary.ascending,
                    basic_attributes: row.primary.basic_attributes,
                    book: row.primary.book,
                    id: row.primary.id,
                    specialities: row.primary.specialities,
                    stars: row.primary.stars,
                    type: row.primary.type,
                    level: value.level,
                  },
                  secondary: row.secondary,
                };
                return td;
              })
            );
          } else if (
            changed &&
            (changed.includes("ascending") || changed.includes("stars"))
          ) {
            rows.push(
              ...table.getData().map((row: TableData) => {
                const td: TableData = {
                  primary: {
                    ascending: value.ascending,
                    basic_attributes: row.primary.basic_attributes,
                    book: row.primary.book,
                    id: row.primary.id,
                    specialities: row.primary.specialities,
                    stars: value.stars,
                    type: row.primary.type,
                    level: row.primary.level,
                  },
                  secondary: row.secondary,
                };
                return td;
              })
            );
          } else {
            if (DEBUG) {
              console.log(`initial set with value but no changed`);
            }
            rows.push(
              ...table.getData().map((row: TableData) => {
                const td: TableData = {
                  primary: {
                    ascending: value.ascending,
                    basic_attributes: row.primary.basic_attributes,
                    book: row.primary.book,
                    id: row.primary.id,
                    specialities: row.primary.specialities,
                    stars: value.stars,
                    type: row.primary.type,
                    level: value.level,
                  },
                  secondary: row.secondary,
                };
                return td;
              })
            );
          }
          if (rows.length > 0) {
            table.replaceData(rows);
          } else {
            if (DEBUG) {
              console.log(`rows has no size`);
            }
          }
        }
      );
    }
  });
  return table;
};

//https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
export const attackMutator = (value: number = 0, data: TableData) => {
  if (data) {
    const level = data.primary.level ? data.primary.level : 1;

    const increment = data.primary.basic_attributes.attack.increment;
    const base = data.primary.basic_attributes.attack.base;
    const ascending = data.primary.ascending;
    const AES_adjustment = ascending
      ? constants.BasicAESAdjustment[data.primary.stars]
      : 0;

    let step = base + AES_adjustment + (level - 1) * increment;
    /*
     * unfortunately each general has a totally random amount that each star
     * from 1 to 5 (the non ascending stars) grants to each of the basic attributes.
     * this makes it impossible to reliably account for the fact that you cannot
     * cultivate to an amount higher than your actual basic attribute is currently.
     * I am faking it by assuming you always get an increment of 70, which seems
     * to be the max possible, at each star, or 500 at star 5, which ever is
     * *lesser* (so as not to exceed the 500 max).
     */
    const basicStarAdjustment =
      level < 23
        ? level < 18
          ? level < 14
            ? level < 10
              ? level < 5
                ? 0
                : 70
              : 140
            : 210
          : 280
        : 500;
    const cultivation =
      step < basicStarAdjustment
        ? basicStarAdjustment
        : step > 500
          ? 500
          : step;

    if (DEBUG) {
      console.log(
        `${data.primary.id}:
          base: ${base},
          step: ${step},
          level: ${level},
          increment: ${increment},
          ascending: ${ascending},
          AES_adjustment: ${AES_adjustment},
          basicStarAdjustment: ${basicStarAdjustment}
          cultivation: ${cultivation},
          `
      );
      step = step + cultivation;
    }
    if (step < 900) {
      step = step * 0.1;
    } else {
      step = 90 + (step - 900) * 0.2;
    }
    return step;
  } else {
    return 1;
  }
};

export const defenseMutator = (value: number, data: TableData) => {
  if (data) {
    const level = data.primary.level ? data.primary.level : 1;

    const increment = data.primary.basic_attributes.defense.increment;
    const base = data.primary.basic_attributes.defense.base;
    const ascending = data.primary.ascending;
    const AES_adjustment = ascending
      ? constants.BasicAESAdjustment[data.primary.stars]
      : 0;

    let step = base + AES_adjustment + (level - 1) * increment;
    /*
     * unfortunately each general has a totally random amount that each star
     * from 1 to 5 (the non ascending stars) grants to each of the basic attributes.
     * this makes it impossible to reliably account for the fact that you cannot
     * cultivate to an amount higher than your actual basic attribute is currently.
     * I am faking it by assuming you always get an increment of 70, which seems
     * to be the max possible, at each star, or 500 at star 5, which ever is
     * *lesser* (so as not to exceed the 500 max).
     */
    const basicStarAdjustment =
      level < 23
        ? level < 18
          ? level < 14
            ? level < 10
              ? level < 5
                ? 0
                : 70
              : 140
            : 210
          : 280
        : 500;
    const cultivation =
      step < basicStarAdjustment
        ? basicStarAdjustment
        : step > 500
          ? 500
          : step;

    if (DEBUG) {
      console.log(
        `${data.primary.id}:
          base: ${base},
          step: ${step},
          level: ${level},
          increment: ${increment},
          ascending: ${ascending},
          AES_adjustment: ${AES_adjustment},
          basicStarAdjustment: ${basicStarAdjustment}
          cultivation: ${cultivation},
          `
      );
      step = step + cultivation;
    }
    if (step < 900) {
      step = step * 0.1;
    } else {
      step = 90 + (step - 900) * 0.2;
    }
    return step;
  } else {
    return 1;
  }
};

export const leadershipMutator = (value: number, data: TableData) => {
  if (data) {
    const level = data.primary.level ? data.primary.level : 1;

    const increment = data.primary.basic_attributes.leadership.increment;
    const base = data.primary.basic_attributes.leadership.base;
    const ascending = data.primary.ascending;
    const AES_adjustment = ascending
      ? constants.BasicAESAdjustment[data.primary.stars]
      : 0;

    let step = base + AES_adjustment + (level - 1) * increment;
    /*
     * unfortunately each general has a totally random amount that each star
     * from 1 to 5 (the non ascending stars) grants to each of the basic attributes.
     * this makes it impossible to reliably account for the fact that you cannot
     * cultivate to an amount higher than your actual basic attribute is currently.
     * I am faking it by assuming you always get an increment of 70, which seems
     * to be the max possible, at each star, or 500 at star 5, which ever is
     * *lesser* (so as not to exceed the 500 max).
     */
    const basicStarAdjustment =
      level < 23
        ? level < 18
          ? level < 14
            ? level < 10
              ? level < 5
                ? 0
                : 70
              : 140
            : 210
          : 280
        : 500;
    const cultivation =
      step < basicStarAdjustment
        ? basicStarAdjustment
        : step > 500
          ? 500
          : step;

    if (DEBUG) {
      console.log(
        `${data.primary.id}:
          base: ${base},
          step: ${step},
          level: ${level},
          increment: ${increment},
          ascending: ${ascending},
          AES_adjustment: ${AES_adjustment},
          basicStarAdjustment: ${basicStarAdjustment}
          cultivation: ${cultivation},
          `
      );
      step = step + cultivation;
    }
    if (step < 900) {
      step = step * 0.1;
    } else {
      step = 90 + (step - 900) * 0.2;
    }
    return step;
  } else {
    return 1;
  }
};

export const politicsMutator = (value: number, data: TableData) => {
  if (data) {
    const level = data.primary.level ? data.primary.level : 1;

    const increment = data.primary.basic_attributes.politics.increment;
    const base = data.primary.basic_attributes.politics.base;
    const ascending = data.primary.ascending;
    const AES_adjustment = ascending
      ? constants.BasicAESAdjustment[data.primary.stars]
      : 0;

    let step = base + AES_adjustment + (level - 1) * increment;
    /*
     * unfortunately each general has a totally random amount that each star
     * from 1 to 5 (the non ascending stars) grants to each of the basic attributes.
     * this makes it impossible to reliably account for the fact that you cannot
     * cultivate to an amount higher than your actual basic attribute is currently.
     * I am faking it by assuming you always get an increment of 70, which seems
     * to be the max possible, at each star, or 500 at star 5, which ever is
     * *lesser* (so as not to exceed the 500 max).
     */
    const basicStarAdjustment =
      level < 23
        ? level < 18
          ? level < 14
            ? level < 10
              ? level < 5
                ? 0
                : 70
              : 140
            : 210
          : 280
        : 500;
    const cultivation =
      step < basicStarAdjustment
        ? basicStarAdjustment
        : step > 500
          ? 500
          : step;

    if (DEBUG) {
      console.log(
        `${data.primary.id}:
          base: ${base},
          step: ${step},
          level: ${level},
          increment: ${increment},
          ascending: ${ascending},
          AES_adjustment: ${AES_adjustment},
          basicStarAdjustment: ${basicStarAdjustment}
          cultivation: ${cultivation},
          `
      );
      step = step + cultivation;
    }
    if (step < 900) {
      step = step * 0.1;
    } else {
      step = 90 + (step - 900) * 0.2;
    }
    return step;
  } else {
    return 1;
  }
};

export const overallToughnessMutator = (value: number, data: TableData) => {
  const level =
    stores.selectedValues.get().level != undefined
      ? (stores.selectedValues.get().level as number)
      : 1;
  const leadership = data ? data.primary.basic_attributes.leadership.base : 1;
  const defense = data ? data.primary.basic_attributes.defense.base : 1;

  const l = leadershipMutator(leadership, data);
  const d = defenseMutator(defense, data);

  return l + d;
};

export const overallAttackMutator = (value: number, data: TableData) => {
  const level =
    stores.selectedValues.get().level != undefined
      ? (stores.selectedValues.get().level as number)
      : 1;
  const attack = data ? data.primary.basic_attributes.attack.base : 1;
  const a = attackMutator(attack, data);

  return a;
};
