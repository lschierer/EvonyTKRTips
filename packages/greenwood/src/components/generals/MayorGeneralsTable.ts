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

// Initialize the virtualized tables
const container = document.getElementById("mayor-table-container");
if (container) {
  // Parse the data from the container's data attribute
  const dataStr = container.getAttribute("data-items");
  if (dataStr) {
    try {
      // Parse the JSON data
      const rawData = JSON.parse(
        decodeURIComponent(dataStr)
      ) as Generals.MayorGeneralTableData[];

      // Convert the data to Record<string, unknown>[] format
      // This is the format that sp-table expects
      const formattedData = Array.isArray(rawData)
        ? rawData.map((item) => {
            // Ensure each item is a plain object with the correct properties
            const r: Record<string, Generals.MayorGeneralTableData> = {
              general: item,
            };
            return r;
          })
        : [];

      if (DEBUG) {
        console.log("Formatted data:", formattedData.length, "items");
      }

      // Initialize each table
      initializeTable("mayor-attack-table", formattedData, "attack");
      initializeTable("mayor-hp-table", formattedData, "hp");
      initializeTable("mayor-defense-table", formattedData, "defense");
    } catch (error) {
      console.error("Error parsing mayor generals data:", error);
    }
  } else {
    console.error("No data-items attribute found on table container");
  }
}

function initializeTable(tableId: string, formattedData: Record<string, unknown>[], tableType: string) {
  const table: Table | null = document.getElementById(tableId) as Table | null;
  if (table) {
    if (DEBUG) {
      console.log(`Initializing ${tableType} table`);
    }

    // Set the items property on the table
    table.items = formattedData;

    // Define the renderItem function based on table type
    /* @ts-expect-error wrong type definition */
    table.renderItem = (item: Record<string, unknown>, index: number) => {
      // Create cells for each column
      if (DEBUG) {
        console.log(`rendering item for ${tableType} table at index ${index}`);
      }

      const cells = new Array<HTMLElement>();
      const g = item.general as Generals.MayorGeneralTableData;
      
      // Add index cell (position in the current sort order)
      const indexCell = document.createElement("sp-table-cell");
      indexCell.innerText = (index + 1).toString();
      cells.push(indexCell);
      
      // Add name cell for all tables
      const nameCell = document.createElement("sp-table-cell");
      nameCell.innerText = g.name;
      cells.push(nameCell);
      
      if (tableType === "attack") {
        // Add Attack debuff cells
        const groundAttackDebuffCell = document.createElement("sp-table-cell");
        groundAttackDebuffCell.innerText = g.groundAttackDebuff.toString();
        cells.push(groundAttackDebuffCell);
        
        const mountedAttackDebuffCell = document.createElement("sp-table-cell");
        mountedAttackDebuffCell.innerText = g.mountedAttackDebuff.toString();
        cells.push(mountedAttackDebuffCell);
        
        const rangedAttackDebuffCell = document.createElement("sp-table-cell");
        rangedAttackDebuffCell.innerText = g.rangedAttackDebuff.toString();
        cells.push(rangedAttackDebuffCell);
        
        const siegeAttackDebuffCell = document.createElement("sp-table-cell");
        siegeAttackDebuffCell.innerText = g.siegeAttackDebuff.toString();
        cells.push(siegeAttackDebuffCell);
      } 
      else if (tableType === "hp") {
        // Add HP debuff cells
        const groundHPDebuffCell = document.createElement("sp-table-cell");
        groundHPDebuffCell.innerText = g.groundHPDebuff.toString();
        cells.push(groundHPDebuffCell);
        
        const mountedHPDebuffCell = document.createElement("sp-table-cell");
        mountedHPDebuffCell.innerText = g.mountedHPDebuff.toString();
        cells.push(mountedHPDebuffCell);
        
        const rangedHPDebuffCell = document.createElement("sp-table-cell");
        rangedHPDebuffCell.innerText = g.rangedHPDebuff.toString();
        cells.push(rangedHPDebuffCell);
        
        const siegeHPDebuffCell = document.createElement("sp-table-cell");
        siegeHPDebuffCell.innerText = g.siegeHPDebuff.toString();
        cells.push(siegeHPDebuffCell);
      }
      else if (tableType === "defense") {
        // Add Defense debuff cells
        const groundDefenseDebuffCell = document.createElement("sp-table-cell");
        groundDefenseDebuffCell.innerText = g.groundDefenseDebuff.toString();
        cells.push(groundDefenseDebuffCell);
        
        const mountedDefenseDebuffCell = document.createElement("sp-table-cell");
        mountedDefenseDebuffCell.innerText = g.mountedDefenseDebuff.toString();
        cells.push(mountedDefenseDebuffCell);
        
        const rangedDefenseDebuffCell = document.createElement("sp-table-cell");
        rangedDefenseDebuffCell.innerText = g.rangedDefenseDebuff.toString();
        cells.push(rangedDefenseDebuffCell);
        
        const siegeDefenseDebuffCell = document.createElement("sp-table-cell");
        siegeDefenseDebuffCell.innerText = g.siegeDefenseDebuff.toString();
        cells.push(siegeDefenseDebuffCell);
      }
      
      return cells;
    };

    // Set up sorting
    table.addEventListener("sorted", (event: Event) => {
      if (DEBUG) {
        console.log(`sorted event handler for ${tableType} table`);
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
        const ga = a.general as Generals.MayorGeneralTableData;
        const gb = b.general as Generals.MayorGeneralTableData;
        const valueA = ga[sortKey as keyof typeof ga] as string | number;
        const valueB = gb[sortKey as keyof typeof gb] as string | number;

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
      
      // Update the table with sorted items
      table.items = sortedItems;
      
      // Force a re-render to update the index numbers
      setTimeout(() => {
        // This will trigger a re-render with updated index numbers
        table.requestUpdate();
      }, 0);
    });

    if (DEBUG) {
      console.log(`${tableType} table initialized with`, formattedData.length, "items");
    }
  } else {
    console.error(`Table with ID ${tableId} not found`);
  }
}
