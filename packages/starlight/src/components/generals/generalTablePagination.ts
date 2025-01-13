import { customElement, property, state } from "lit/decorators.js";
import { html, LitElement, unsafeCSS, css } from "lit";
import { classMap } from "lit/directives/class-map.js";

import SpectrumCSSActionButton from "@spectrum-css/actionbutton/dist/index.css?inline";
import SpectrumCSSButton from "@spectrum-css/button/dist/index.css?inline";
import SpectrumCSSPagination from "@spectrum-css/pagination/dist/index.css?inline";

import "iconify-icon";

@customElement("pagination-controller")
export class PaginationController extends LitElement {
  @property({ type: Boolean, reflect: true })
  public hasNextPage: boolean = false;

  @property({ type: Number })
  public pageCount: number = 0;

  @property({ type: Number })
  public pageIndex: number = 0;

  @property({ type: Boolean, reflect: true })
  public hasPreviousPage: boolean = false;

  @property()
  //@ts-expect-error
  public nextPage: () => void;

  @property()
  //@ts-expect-error
  public previousPage: () => void;

  @property()
  //@ts-expect-error
  public firstPage: () => void;

  @property()
  //@ts-expect-error
  public lastPage: () => void;

  @property({ type: Number })
  public pageSize: number = 10;

  @property()
  //@ts-expect-error
  public setPageSize: (pageSize: number) => void;

  static override styles = [
    unsafeCSS(SpectrumCSSActionButton),
    unsafeCSS(SpectrumCSSButton),
    unsafeCSS(SpectrumCSSPagination),
    css`
      div.spectrum-ActionButton {
        border: 0;
      }
    `,
  ];

  protected override render() {
    const beforePreviousButton =
      this.pageIndex - 1 > 0
        ? html`
            <button
              aria-controls=""
              aria-pressed="false"
              class=" spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet "
              id="1"
              data-testid="1"
              role="button"
              style=""
              @click="${() => this.firstPage()}"
            >
              <span class="spectrum-ActionButton-label">1</span>
            </button>
            <div
              class=" spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet "
              id="3"
              data-testid="3"
            >
              <span class="spectrum-ActionButton-label">...</span>
            </div>
          `
        : html``;
    const previousButton = this.hasPreviousPage
      ? html`
          <button
            aria-controls=""
            aria-pressed="false"
            class=" spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet "
            id="${this.pageIndex - 1}"
            data-testid="${this.pageIndex - 1}"
            role="button"
            style=""
            @click="${() => this.previousPage()}"
          >
            <span class="spectrum-ActionButton-label">${this.pageIndex}</span>
          </button>
        `
      : html``;

    const nextButton = this.hasNextPage
      ? html`
          <button
            aria-controls=""
            aria-pressed="false"
            class=" spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet "
            id="${this.pageIndex + 1}"
            data-testid="${this.pageIndex + 1}"
            role="button"
            style=""
            @click="${() => this.nextPage()}"
          >
            <span class="spectrum-ActionButton-label"
              >${this.pageIndex + 2}</span
            >
          </button>
        `
      : html``;

    const afterNext =
      this.pageIndex + 1 < this.pageCount
        ? html`
            <div
              class=" spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet "
              id="3"
              data-testid="3"
            >
              <span class="spectrum-ActionButton-label">...</span>
            </div>

            <button
              aria-controls=""
              aria-pressed="false"
              class=" spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet "
              id="${this.pageCount}"
              data-testid="${this.pageCount}"
              role="button"
              style=""
              @click="${() => this.lastPage()}"
            >
              <span class="spectrum-ActionButton-label">${this.pageCount}</span>
            </button>
          `
        : html``;

    return html`
      <!-- Simple, clean template preview for non-testing grid views -->
      <div data-html-preview="" style="background-color:false;padding:12px;">
        <nav class=" spectrum-Pagination spectrum-Pagination--listing ">
          <button
            class=" spectrum-Button spectrum-Button--outline spectrum-Button--primary spectrum-Button--sizeM spectrum-Pagination-prevButton "
            id="button-uyhp5"
            style=""
            ?disabled=${!this.hasPreviousPage}
          >
            <span class="spectrum-Button-label">Prev</span>
          </button>

          ${beforePreviousButton} ${previousButton}

          <button
            aria-controls=""
            aria-pressed="true"
            class=" spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet is-selected "
            id="${this.pageIndex}"
            data-testid="${this.pageIndex}"
            role="button"
            style=""
          >
            <span class="spectrum-ActionButton-label"
              >${this.pageIndex + 1}</span
            >
          </button>

          ${nextButton} ${afterNext}

          <button
            ?disabled=${!this.hasNextPage}
            class=" spectrum-Button spectrum-Button--outline spectrum-Button--primary spectrum-Button--sizeM spectrum-Pagination-nextButton "
            id="button-vu0xq"
            style=""
            @click="${() => this.nextPage()}"
          >
            <span class="spectrum-Button-label">Next</span>
          </button>
        </nav>
      </div>
    `;
  }
}
