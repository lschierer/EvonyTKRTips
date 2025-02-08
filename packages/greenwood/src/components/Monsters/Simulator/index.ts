import { LitElement, html, unsafeCSS, css } from "lit";

import "./BuffTable.ts";
import "./MarchTable.ts";
import "./MonsterOrder.ts";

import SpectrumCSStabs from "@spectrum-css/tabs/index.css" with { type: "css" };
import "iconify-icon";

export default class MonsterSimulator extends LitElement {
  static override styles = [
    unsafeCSS(SpectrumCSStabs),
    css`
      div.spectrum-Tabs {
        background-color: var(--spectrum-green-background-color-default);
      }
    `,
  ];
  override render() {
    return html`
      <div>
        <div class="spectrum-Tabs  spectrum-Tabs--horizontal">
          <div
            tabindex="0"
            class="spectrum-Tabs-item is-selected"
            id="tab-item-1"
          >
            <iconify-icon
              icon="ion:folder-open-outline"
              focusable="false"
              aria-hidden="true"
              role="img"
              class="spectrum-Icon spectrum-Icon--sizeM "
            ></iconify-icon>
            <span class="spectrum-Tabs-itemLabel"> Tab 1 </span>
            <div
              class="spectrum-Tabs-selectionIndicator"
              style="inline-size:100%;"
            ></div>
          </div>

          <div tabindex="0" class="spectrum-Tabs-item " id="tab-item-2">
            <iconify-icon
              icon="ion:folder-open-outline"
              focusable="false"
              aria-hidden="true"
              role="img"
              class="spectrum-Icon spectrum-Icon--sizeM "
            ></iconify-icon>
            <span class="spectrum-Tabs-itemLabel"> Tab 2 </span>
          </div>
        </div>

        <div class="tab-1-content">
          <buff-table></buff-table>
          <march-table></march-table>
          <monster-order></monster-order>
        </div>
      </div>
    `;
  }
}
customElements.define("monster-simulator", MonsterSimulator);
