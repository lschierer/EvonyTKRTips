import debugFunction from "../lib/debug.ts";
const DEBUG = debugFunction("components/CardGrid.ts");

import { html, css, LitElement, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

import { type CardMetaData } from "@evonytkrtips/schemas";
type CardMeta = CardMetaData.CardMeta;

import "@spectrum-web-components/card/sp-card.js";
import "@spectrum-web-components/popover/sp-popover.js";

import "iconify-icon";

@customElement("card-grid")
export default class CardGrid extends LitElement {
  protected Items: CardMeta[] = new Array<CardMeta>();

  static override styles = [
    css`
      div.cardBox {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: 10rem;
        grid-auto-flow: row dense;
        grid-row-gap: 1rem;
        justify-content: center;
      }

      div.offsetter {
        width: 100%;
        grid-column-start: 3;
        grid-column-end: span 2;
        grid-row-end: span 1;
      }

      sp-card {
        width: 100%;
        height: 50%;
      }
      div.cardItem {
        margin: auto;
        grid-column-end: span 2;
        grid-row-end: span 2;
      }
    `,
  ];
  private renderItem = (item: CardMeta, index: number = 0) => {
    let imgTemplate = html``;
    if (item.imgSrc && item.imgSrc.length > 0) {
      imgTemplate = html`${imgTemplate}
        <img
          src="${item.imgSrc} alt=${item.alt ?? nothing}"
          slot="preview"
        /> `;
    }
    if (item.icon && item.icon.length > 0) {
      if (DEBUG) {
        console.log(`icon detected: ${item.icon}`);
      }
      imgTemplate = html`${imgTemplate}
        <iconify-icon
          icon="${item.icon}"
          slot="preview"
          width="3rem"
        ></iconify-icon> `;
    }

    return html`
      <div class="cardItem">
        <sp-card
          horizontal
          variant=${item.variant ?? "quiet"}
          heading="${item.heading}"
          subheading="${item.subheading ?? ""}"
          href="${item.target ?? nothing}"
          value="card-${index}"
        >
          ${imgTemplate}
          <div slot="description">${item.description}</div>
          <div slot="footer">${item.footer}</div>
        </sp-card>
      </div>
    `;
  };

  protected override render(): TemplateResult {
    if (this.Items.length > 0) {
      return html`
        <div class="cardBox">
          <div class="offsetter">${DEBUG ? this.Items.length : ""}</div>
          ${this.Items.map((i, index) => this.renderItem(i, index))}
        </div>
      `;
    }
    return html``;
  }
}
