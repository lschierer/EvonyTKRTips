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

        if (DEBUG) {
          console.log("Formatted data:", formattedData.length, "items");
        }

        // Set the items property on the table
        table.items = formattedData;

        // Define the renderItem function
        /* @ts-expect-error wrong type definition */
        table.renderItem = (item: Record<string, unknown>, index: number) => {
          // Create cells for each column
          if (DEBUG) {
            console.log(`rendering item at index ${index}`);
          }

          const cells = new Array<HTMLElement>();
          const g = item.general as Generals.GeneralTableData;
          
          // Add name cell
          const nameCell = document.createElement("sp-table-cell");
          nameCell.innerText = g.name;
          cells.push(nameCell);
          
          // Add march capacity cell if it exists
          if (g.marchCapacity !== undefined) {
            const marchCapacityCell = document.createElement("sp-table-cell");
            marchCapacityCell.innerText = g.marchCapacity.toString();
            cells.push(marchCapacityCell);
          }
          
          // Add other cells
          const attackCell = document.createElement("sp-table-cell");
          attackCell.innerText = g.attack.toString();
          cells.push(attackCell);
          
          const defenseCell = document.createElement("sp-table-cell");
          defenseCell.innerText = g.defense.toString();
          cells.push(defenseCell);
          
          const hpCell = document.createElement("sp-table-cell");
          hpCell.innerText = g.hp.toString();
          cells.push(hpCell);
          
          const attackDebuffCell = document.createElement("sp-table-cell");
          attackDebuffCell.innerText = g.attackDebuff.toString();
          cells.push(attackDebuffCell);
          
          const defenseDebuffCell = document.createElement("sp-table-cell");
          defenseDebuffCell.innerText = g.defenseDebuff.toString();
          cells.push(defenseDebuffCell);
          
          const hpDebuffCell = document.createElement("sp-table-cell");
          hpDebuffCell.innerText = g.hpDebuff.toString();
          cells.push(hpDebuffCell);
          
          return cells;
        };

        // Set up sorting
        table.addEventListener("sorted", (event: Event) => {
          if (DEBUG) {
            console.log(`sorted event handler`);
          }
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
          if (DEBUG) {
            console.log(`sorting ${sortDirection} with key ${sortKey}`);
          }

          const sortedItems = [...table.items].sort((a, b) => {
            const ga = a.general as Generals.GeneralTableData;
            const gb = b.general as Generals.GeneralTableData;
            const valueA = ga[sortKey as keyof typeof ga] as string;
            const valueB = gb[sortKey as keyof typeof gb] as string;

            if (DEBUG) {
              console.log(`valueA is ${valueA}`);
              console.log(`valueB is ${valueB}`);
            }

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

        if (DEBUG) {
          console.log("Table initialized with", formattedData.length, "items");
        }
      } else {
        console.error("No data-items attribute found on table container");
      }
    } catch (error) {
      console.error("Error initializing table:", error);
    }
  }
}
