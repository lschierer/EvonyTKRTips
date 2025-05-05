import { customElement, property, state } from "lit/decorators.js";
import { LitElement, type CSSResultGroup } from "lit";
import { createRef, type Ref } from "lit/directives/ref.js";

import { VirtualizerController } from "@tanstack/lit-virtual";

import {
  getCoreRowModel,
  getSortedRowModel,
  TableController,
} from "@tanstack/lit-table";

import { SignalWatcher, html } from "@lit-labs/signals";

import { type Generals } from "@evonytkrtips/schemas";
import pairsTableColumnDeps from "../../lib/PairsTableColumns.ts";

export default class PairsTable extends SignalWatcher(LitElement) {
  private tableController = new TableController<Generals.PairTableData>(this);

  private tableContainerRef: Ref = createRef();

  private rowVirtualizerController: VirtualizerController<Element, Element>;

  @state()
  private data: Generals.PairTableData[] = new Array<Generals.PairTableData>();

  @property({ type: String })
  accessor encodedData: string = "";

  override connectedCallback() {
    this.rowVirtualizerController = new VirtualizerController(this, {
      count: this.data.length,
      getScrollElement: () => this.tableContainerRef.value ?? null,
      estimateSize: () => 33,
      overscan: 5,
    });
    super.connectedCallback();
  }

  protected override willUpdate(_changedProperties: PropertyValues): void {
    if (
      _changedProperties.has("encodedData") ||
      _changedProperties.has("encoded-data")
    ) {
      console.log(`change to encoded data detected`);
    }
  }

  protected override render(): unknown {
    const table = this.tableController.table({
      columns: pairsTableColumnDeps,
      data: this.data,
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
    });
    const { rows } = table.getRowModel();

    const virtualizer = this.rowVirtualizerController.getVirtualizer();
    return html`
      <link
        rel="stylesheet"
        src="/node_modules/@evonytkrtips/assets/dist/styles/ComparisonTable.css"
      />
    `;
  }
}
customElements.define("pairs-table", PairsTable);
