import { getContentByRoute } from "@greenwood/cli/src/data/client.js";
import { type Page } from "@greenwood/cli";
import "@spectrum-web-components/card/sp-card.js";

import DirectoryIndexStyles from "../styles/DirectoryIndex.css" with { type: "css" };

import debugFunction from "../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
console.log(`DEBUG for ${new URL(import.meta.url).pathname} is ${DEBUG}`);

export default class DirectoryIndex extends HTMLElement {
  private _directory = "";
  private _entries = new Array<Page>();
  private _recurse = false;
  private _observer: ResizeObserver | null = null;

  protected getAttributes = () => {
    if (DEBUG) {
      console.log(`I have attributes ${JSON.stringify(this.attributes)}`);
    }
    for (const attr of this.attributes) {
      if (DEBUG) {
        console.log(`evaluating attr ${attr.name} with value ${attr.value}`);
      }
      if (!attr.name.localeCompare("directory")) {
        if (DEBUG) {
          console.log(`setting directory attribute`);
        }
        this._directory = attr.value;
      }
      if (!attr.name.localeCompare("recurse")) {
        this._recurse = true;
      }
    }
    if (this._directory.includes("/")) {
      const stack = this._directory.split("/");
      this._directory = stack.map((s) => encodeURIComponent(s)).join("/");
    }
  };

  protected getEntries = async () => {
    if (DEBUG) {
      console.log(`DirectoryIndex getEntries for ${this._directory}`);
    }
    const entries = (
      (await getContentByRoute(
        this._directory.length > 0 ? this._directory : "/"
      )) as Array<Page | undefined>
    ).sort((a: Page | undefined, b: Page | undefined) => {
      if (a == undefined) {
        if (b == undefined) {
          return 0;
        } else {
          return -1;
        }
      } else if (b == undefined) {
        return 1;
      } else {
        const ordera = a.data
          ? Object.keys(a.data).includes("order")
            ? (a.data["order" as keyof typeof a.data] as number)
            : undefined
          : undefined;

        const orderb = b.data
          ? Object.keys(b.data).includes("order")
            ? (b.data["order" as keyof typeof b.data] as number)
            : undefined
          : undefined;

        if (ordera && orderb) {
          return ordera - orderb;
        } else if (ordera) {
          return -1;
        } else if (orderb) {
          return 1;
        } else {
          return a.title.localeCompare(b.title);
        }
      }
    });
    entries.map((entry) => {
      if (entry) {
        if (
          entry.route.localeCompare(this._directory) &&
          entry.route.startsWith(this._directory)
        ) {
          if (this._recurse) {
            this._entries.push(entry);
          } else {
            if (DEBUG) {
              console.log(`recurse set to false`);
            }
            const stack = entry.route.split("/");
            const routeStack = this._directory.split("/");
            if (DEBUG) {
              console.log(`entry ${entry.route} stack size ${stack.length}`);
            }
            if (stack.length <= routeStack.length + 1) {
              this._entries.push(entry);
            }
          }
        } else {
          if (DEBUG) {
            if (
              !entry.route.localeCompare(encodeURIComponent(this._directory))
            ) {
              console.log(
                `excluding matching route ${entry.route} the same as ${this._directory}`
              );
            } else {
              console.log(
                `excluding non-matching route ${entry.route} while comparing ${this._directory}`
              );
            }
          }
        }
      }
    });
  };

  renderEntries() {
    if (this._entries.length > 0) {
      if (DEBUG) {
        console.log(
          `DirectoryIndex connectedCallback sees ${this._entries.length} entries after getEntries() call`
        );
      }

      this.innerHTML = `
        <div class="directory-index-container">
            ${this._entries
              .map((entry, index) => {
                const imgTemplate = `
                  <iconify-icon
                    icon="lucide:book-up"
                    slot="preview"
                    width="3rem"
                    >
                  </iconify-icon>
                `;

                return `
                <div class="directory-card" data-index="${index}">
                  <a href="${entry.route}" class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">
                  <div class="spectrum-Card spectrum-Card--horizontal" role="figure">
                    <div class="spectrum-Card-preview">
                      ${imgTemplate}
                    </div>
                    <div class="spectrum-Card-body">
                      <div class="spectrum-Card-header">
                        <div class="spectrum-Card-title">
                          ${entry.title ? entry.title : entry.label}
                        </div>
                      </div>
                      <div class="spectrum-Card-content">
                        <div class="spectrum-Card-description">
                        ${
                          entry.data
                            ? Object.keys(entry.data).includes("description")
                              ? entry.data[
                                  "description" as keyof typeof entry.data
                                ]
                              : ""
                            : ""
                        }
                        </div>
                      </div>
                    </div>
                  </div>
                  </a>
                </div>
              `;
              })
              .join("")}
        </div>
      `;

      // Apply staggered layout after rendering
      this.applyStaggeredLayout();
    } else {
      if (DEBUG) {
        const template = `
          <span>No entries found for '${this._directory}'</span>
        `;
        this.innerHTML = template;
      } else {
        const template = `
          <!-- No Entries found for ${this._directory} -->
        `;
        this.innerHTML = template;
      }
    }
  }

  /**
   * Applies a staggered layout to the cards based on their actual column position
   */
  protected applyStaggeredLayout() {
    const container = this.querySelector(
      ".directory-index-container"
    ) as HTMLElement;
    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */
    if (!container) return;

    // Reset all cards to no offset
    const cards = container.querySelectorAll(".directory-card");
    cards.forEach((card) => {
      (card as HTMLElement).style.transform = "";
    });

    // Wait for layout to be calculated
    setTimeout(() => {
      // Get the container width and card width to calculate columns
      const containerWidth = container.clientWidth;
      const cardWidth =
        cards.length > 0 ? (cards[0] as HTMLElement).offsetWidth : 0;

      if (cardWidth === 0) return;

      // Calculate how many cards fit in a row
      const cardsPerRow = Math.max(1, Math.floor(containerWidth / cardWidth));

      if (DEBUG) {
        console.log(
          `Container width: ${containerWidth}, Card width: ${cardWidth}, Cards per row: ${cardsPerRow}`
        );
      }

      // Get the positions of all cards
      const cardPositions = Array.from(cards).map((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        return {
          card: card as HTMLElement,
          left: rect.left,
          top: rect.top,
        };
      });

      // Group cards by row based on their vertical position
      const rows: HTMLElement[][] = [];
      let currentRowTop = cardPositions[0]?.top;
      let currentRow: HTMLElement[] = [];

      cardPositions.forEach(({ card, top }) => {
        // If this card is on a new row (allowing for small differences due to rounding)
        if (Math.abs(top - currentRowTop) > 5) {
          rows.push(currentRow);
          currentRow = [card];
          currentRowTop = top;
        } else {
          currentRow.push(card);
        }
      });

      // Add the last row
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }

      if (DEBUG) {
        console.log(
          `Found ${rows.length} rows with cards per row: ${rows.map((r) => r.length).join(", ")}`
        );
      }

      // Process each row
      rows.forEach((rowCards) => {
        // Sort cards in this row by their horizontal position
        rowCards.sort((a, b) => {
          return (
            a.getBoundingClientRect().left - b.getBoundingClientRect().left
          );
        });

        // Apply transform based on column position within the row
        rowCards.forEach((card, columnIndex) => {
          const isEvenColumn = columnIndex % 2 === 1; // 0-indexed, so 1, 3, 5... are even columns

          if (isEvenColumn) {
            card.style.transform = "translateY(25px)";
            card.dataset.staggered = "true";
          } else {
            card.style.transform = "";
            card.dataset.staggered = "false";
          }
        });
      });
    }, 100); // Increased timeout to ensure layout is complete
  }

  /**
   * Sets up a resize observer to reapply the staggered layout when the window resizes
   */
  protected setupResizeObserver() {
    if (!this._observer) {
      this._observer = new ResizeObserver(() => {
        this.applyStaggeredLayout();
      });

      const container = this.querySelector(".directory-index-container");
      if (container) {
        this._observer.observe(container);
      }

      // Also listen for window resize events
      window.addEventListener("resize", this.handleResize);
    }
  }

  protected handleResize = () => {
    this.applyStaggeredLayout();
  };

  async connectedCallback() {
    if (DEBUG) {
      console.log(`DirectoryIndex component connected`);
    }
    document.adoptedStyleSheets.push(DirectoryIndexStyles);
    this.getAttributes();
    await this.getEntries();
    this.renderEntries();
    this.setupResizeObserver();
  }

  disconnectedCallback() {
    // Clean up the observer when the component is removed
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }

    window.removeEventListener("resize", this.handleResize);
  }
}
customElements.define("directory-index", DirectoryIndex);
