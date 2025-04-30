import { LitElement, html, css, nothing, type CSSResultArray } from "lit";
import { customElement } from "lit/decorators.js";

import { SignalWatcher } from "@lit-labs/signals";

import { Constants as constants } from "@evonytkrtips/schemas";

import SpectrumCSSTable from "@spectrum-css/table/index.css" with { type: "css" };

import "iconify-icon";

import * as reference from "./reference.ts";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

@customElement("reference-tables")
export default class ReferenceTables extends SignalWatcher(LitElement) {
  static override get styles() {
    return [SpectrumCSSTable, css``] as CSSResultArray;
  }

  protected renderBaseAttack = () => {
    return html`
      <table
        class="spectrum-Table spectrum-Table--sizeM spectrum-Table--compact"
      >
        <tbody class="spectrum-Table-body">
          <tr class="spectrum-Table-row">
            <th class="spectrum-Table-headCell">
              <span class="spectrum-Table-columnTitle"> </span>
            </th>
            ${constants.TroopClass.options.map((co) => {
              if (co.localeCompare(constants.TroopClass.Enum.All)) {
                return html`
                  <th class="spectrum-Table-headCell">
                    <span class="spectrum-Table-columnTitle">
                      ${co.substring(0, co.indexOf(" "))}
                    </span>
                  </th>
                `;
              } else return nothing;
            })}
          </tr>
          ${Array.from({ length: 16 }, (_, i) => i + 1).map((index) => {
            return html`
              <tr class="spectrum-Table-row">
                <th class="spectrum-Table-headCell">
                  <span class="spectrum-Table-columnTitle"> T${index} </span>
                </th>
                ${constants.TroopClass.options.map((co) => {
                  if (co.localeCompare(constants.TroopClass.Enum.All)) {
                    return html`
                      <td class="spectrum-Table-cell">
                        ${!co.localeCompare(
                          constants.TroopClass.Enum["Ground Troops"]
                        )
                          ? reference.GroundStats[index - 1].attack
                          : !co.localeCompare(
                                constants.TroopClass.Enum["Mounted Troops"]
                              )
                            ? reference.MountedStats[index - 1].attack
                            : !co.localeCompare(
                                  constants.TroopClass.Enum["Ranged Troops"]
                                )
                              ? reference.ArcherStats[index - 1].attack
                              : reference.SiegeStats[index - 1].attack}
                      </td>
                    `;
                  } else return nothing;
                })}
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  };

  protected renderBaseDefense = () => {
    return html`
      <table
        class="spectrum-Table spectrum-Table--sizeM spectrum-Table--compact"
      >
        <tbody class="spectrum-Table-body">
          <tr class="spectrum-Table-row">
            <th class="spectrum-Table-headCell">
              <span class="spectrum-Table-columnTitle"> </span>
            </th>
            ${constants.TroopClass.options.map((co) => {
              if (co.localeCompare(constants.TroopClass.Enum.All)) {
                return html`
                  <th class="spectrum-Table-headCell">
                    <span class="spectrum-Table-columnTitle">
                      ${co.substring(0, co.indexOf(" "))}
                    </span>
                  </th>
                `;
              } else return nothing;
            })}
          </tr>
          ${Array.from({ length: 16 }, (_, i) => i + 1).map((index) => {
            return html`
              <tr class="spectrum-Table-row">
                <th class="spectrum-Table-headCell">
                  <span class="spectrum-Table-columnTitle"> T${index} </span>
                </th>
                ${constants.TroopClass.options.map((co) => {
                  if (co.localeCompare(constants.TroopClass.Enum.All)) {
                    return html`
                      <td class="spectrum-Table-cell">
                        ${!co.localeCompare(
                          constants.TroopClass.Enum["Ground Troops"]
                        )
                          ? reference.GroundStats[index - 1].defense
                          : !co.localeCompare(
                                constants.TroopClass.Enum["Mounted Troops"]
                              )
                            ? reference.MountedStats[index - 1].defense
                            : !co.localeCompare(
                                  constants.TroopClass.Enum["Ranged Troops"]
                                )
                              ? reference.ArcherStats[index - 1].defense
                              : reference.SiegeStats[index - 1].defense}
                      </td>
                    `;
                  } else return nothing;
                })}
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  };

  protected renderBaseHP = () => {
    return html`
      <table
        class="spectrum-Table spectrum-Table--sizeM spectrum-Table--compact"
      >
        <tbody class="spectrum-Table-body">
          <tr class="spectrum-Table-row">
            <th class="spectrum-Table-headCell">
              <span class="spectrum-Table-columnTitle"> </span>
            </th>
            ${constants.TroopClass.options.map((co) => {
              if (co.localeCompare(constants.TroopClass.Enum.All)) {
                return html`
                  <th class="spectrum-Table-headCell">
                    <span class="spectrum-Table-columnTitle">
                      ${co.substring(0, co.indexOf(" "))}
                    </span>
                  </th>
                `;
              } else return nothing;
            })}
          </tr>
          ${Array.from({ length: 16 }, (_, i) => i + 1).map((index) => {
            return html`
              <tr class="spectrum-Table-row">
                <th class="spectrum-Table-headCell">
                  <span class="spectrum-Table-columnTitle"> T${index} </span>
                </th>
                ${constants.TroopClass.options.map((co) => {
                  if (co.localeCompare(constants.TroopClass.Enum.All)) {
                    return html`
                      <td class="spectrum-Table-cell">
                        ${!co.localeCompare(
                          constants.TroopClass.Enum["Ground Troops"]
                        )
                          ? reference.GroundStats[index - 1].hp
                          : !co.localeCompare(
                                constants.TroopClass.Enum["Mounted Troops"]
                              )
                            ? reference.MountedStats[index - 1].hp
                            : !co.localeCompare(
                                  constants.TroopClass.Enum["Ranged Troops"]
                                )
                              ? reference.ArcherStats[index - 1].hp
                              : reference.SiegeStats[index - 1].hp}
                      </td>
                    `;
                  } else return nothing;
                })}
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  };

  protected override render() {
    if (DEBUG) {
      console.log(`starting render for ReferenceTables`);
    }
    return html`
      <div>
        ${this.renderBaseAttack()} ${this.renderBaseDefense()}
        ${this.renderBaseHP()}
      </div>
    `;
  }
}
