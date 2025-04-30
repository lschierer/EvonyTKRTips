import { type Table } from "@spectrum-web-components/table";
import { type Generals } from "@evonytkrtips/schemas";
if (!customElements.get("sp-table")) {
  await import("@spectrum-web-components/table/sp-table.js");
}
if (!customElements.get("sp-table-body")) {
  await import("@spectrum-web-components/table/sp-table-body.js");
}
if (!customElements.get("sp-table-cell")) {
  await import("@spectrum-web-components/table/sp-table-cell.js");
}
if (!customElements.get("sp-table-checkbox-cell")) {
  await import("@spectrum-web-components/table/sp-table-checkbox-cell.js");
}
if (!customElements.get("sp-table-head")) {
  await import("@spectrum-web-components/table/sp-table-head.js");
}
if (!customElements.get("sp-table-head-cell")) {
  await import("@spectrum-web-components/table/sp-table-head-cell.js");
}
if (!customElements.get("sp-table-row")) {
  await import("@spectrum-web-components/table/sp-table-row.js");
}

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

// Initialize the virtualized table
const container = document.getElementById("table-container");
if (container) {
  const table: Table | null = container.querySelector("sp-table");
  if (table) {
    if (DEBUG) {
      console.log(`I found a table`);
    }
    try {
      // Parse the data from the container's data attribute
      const dataStr = container.getAttribute("data-items");
      if (dataStr) {
        // Parse the JSON data
        const rawData = JSON.parse(
          decodeURIComponent(dataStr)
        ) as Generals.GeneralTableData[];

        // Convert the data to Record<string, unknown>[] format
        // This is the format that sp-table expects
        const formattedData = Array.isArray(rawData)
          ? rawData.map((item) => {
              // Ensure each item is a plain object with the correct properties
              const r: Record<string, Generals.GeneralTableData> = {
                general: item,
              };
              return r;
            })
          : [];

        console.log("Formatted data:", formattedData.length, "items");

        // Set the items property on the table
        table.items = formattedData;

        // Define the renderItem function
        table.renderItem = (item: Record<string, unknown>, index: number) => {
          // Create cells for each column
          console.log(`rendering item at index ${index}`);
          const cells = new Array<HTMLElement>();
          const g = item.general as Generals.GeneralTableData;
          for (const key of Object.keys(g)) {
            const c = document.createElement("sp-table-cell");
            c.innerText = g[key as keyof typeof g] as string;
            cells.push(c);
          }
          return cells;
        };

        // Set up sorting
        table.addEventListener("sorted", (event: Event) => {
          const ce = event as CustomEvent;
          const detail = ce.detail as object;
          let sortDirection: string = "asc";
          let sortKey: number | string = 0;
          if ("sortDirection" in detail) {
            sortDirection = detail.sortDirection as string;
          }
          if ("sortKey" in detail) {
            sortKey = detail.sortKey as string;
          }

          const sortedItems = [...table.items].sort((a, b) => {
            const valueA = a[sortKey] as string;
            const valueB = b[sortKey] as string;

            if (typeof valueA === "number" && typeof valueB === "number") {
              return sortDirection === "asc"
                ? valueA - valueB
                : valueB - valueA;
            } else {
              const first = String(valueA || "");
              const second = String(valueB || "");
              return sortDirection === "asc"
                ? first.localeCompare(second)
                : second.localeCompare(first);
            }
          });
          table.items = sortedItems;
        });

        console.log("Table initialized with", formattedData.length, "items");
      } else {
        console.error("No data-items attribute found on table container");
      }
    } catch (error) {
      console.error("Error initializing table:", error);
    }
  }
}
