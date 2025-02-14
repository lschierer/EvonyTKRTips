import { LitElement, html, css, type PropertyValues } from "lit";
import { createRef, ref, type Ref } from "lit/directives/ref.js";

import "./BuffTable.ts";
import "./MarchTable.ts";
import "./MonsterOrder.ts";

import SpectrumCSStabs from "@spectrum-css/tabs/index.css" with { type: "css" };
import "iconify-icon";

export default class MonsterSimulator extends LitElement {
  private tab1Ref: Ref<HTMLDivElement> = createRef();
  private tab2Ref: Ref<HTMLDivElement> = createRef();
  static override styles = [
    SpectrumCSStabs,
    css`
      div.spectrum-Tabs {
        background-color: var(--spectrum-green-background-color-default);
      }
    `,
  ];

  private changeTab = (event: Event, tab: string) => {
    this.renderRoot
      .querySelectorAll(".spectrum-Tabs-item")
      .forEach((tabItem) => {
        if (!tabItem.id.localeCompare(tab)) {
          tabItem.className = "spectrum-Tabs-item is-selected";
        } else {
          tabItem.className = "spectrum-Tabs-item";
        }
      });
    this.renderRoot.querySelectorAll(".tab-content").forEach((tabDiv) => {
      if (!tabDiv.id.localeCompare(tab)) {
        (tabDiv as HTMLElement).style.display = "";
      } else {
        (tabDiv as HTMLElement).style.display = "none";
      }
    });
  };

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    if (this.tab1Ref.value) {
      this.tab1Ref.value.addEventListener("click", (e) => {
        this.changeTab(e, "tab-item-1");
      });
    }
    if (this.tab2Ref.value) {
      this.tab2Ref.value.addEventListener("click", (e) => {
        this.changeTab(e, "tab-item-2");
      });
    }
  }

  private generateRandomNumber = () => {
    return Math.floor(Math.random() * 10);
  };
  override render() {
    return html`
      <div>
        <div class="spectrum-Tabs spectrum-Tabs--horizontal">
          <div
            tabindex="0"
            class="spectrum-Tabs-item is-selected"
            id="tab-item-1"
            ${ref(this.tab1Ref)}
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

          <div
            tabindex="0"
            class="spectrum-Tabs-item "
            id="tab-item-2"
            ${ref(this.tab2Ref)}
          >
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

        <div id="tab-item-1" class="tab-content ">
          <buff-table></buff-table>
          <march-table></march-table>
          <monster-order></monster-order>
        </div>
        <div id="tab-item-2" class="tab-content ">
          <span>div 2 content</span>
          <span>Peter's Random Number: ${this.generateRandomNumber()}</span>
        </div>
      </div>
    `;
  }
}
customElements.define("monster-simulator", MonsterSimulator);
