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
const container = document.getElementById("wall-table-container");
if (container) {
  const table: Table | null = container.querySelector("sp-table");
  if (table) {
    if (DEBUG) {
      console.log(`I found a wall generals table`);
    }
    try {
      // Parse the data from the container's data attribute
      const dataStr = container.getAttribute("data-items");
      if (dataStr) {
        // Parse the JSON data
        const rawData = JSON.parse(
          decodeURIComponent(dataStr)
        ) as Generals.WallGeneralTableData[];

        // Convert the data to Record<string, unknown>[] format
        // This is the format that sp-table expects
        const formattedData = Array.isArray(rawData)
          ? rawData.map((item) => {
              // Ensure each item is a plain object with the correct properties
              const r: Record<string, Generals.WallGeneralTableData> = {
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
          const g = item.general as Generals.WallGeneralTableData;
          
          // Add name cell
          const nameCell = document.createElement("sp-table-cell");
          nameCell.innerText = g.name;
          cells.push(nameCell);
          
          // Add Ground Troops cells
          const groundAttackCell = document.createElement("sp-table-cell");
          groundAttackCell.innerText = g.groundAttack.toString();
          cells.push(groundAttackCell);
          
          const groundDefenseCell = document.createElement("sp-table-cell");
          groundDefenseCell.innerText = g.groundDefense.toString();
          cells.push(groundDefenseCell);
          
          const groundHPCell = document.createElement("sp-table-cell");
          groundHPCell.innerText = g.groundHP.toString();
          cells.push(groundHPCell);
          
          const groundAttackDebuffCell = document.createElement("sp-table-cell");
          groundAttackDebuffCell.innerText = g.groundAttackDebuff.toString();
          cells.push(groundAttackDebuffCell);
          
          const groundDefenseDebuffCell = document.createElement("sp-table-cell");
          groundDefenseDebuffCell.innerText = g.groundDefenseDebuff.toString();
          cells.push(groundDefenseDebuffCell);
          
          const groundHPDebuffCell = document.createElement("sp-table-cell");
          groundHPDebuffCell.innerText = g.groundHPDebuff.toString();
          cells.push(groundHPDebuffCell);
          
          // Add Mounted Troops cells
          const mountedAttackCell = document.createElement("sp-table-cell");
          mountedAttackCell.innerText = g.mountedAttack.toString();
          cells.push(mountedAttackCell);
          
          const mountedDefenseCell = document.createElement("sp-table-cell");
          mountedDefenseCell.innerText = g.mountedDefense.toString();
          cells.push(mountedDefenseCell);
          
          const mountedHPCell = document.createElement("sp-table-cell");
          mountedHPCell.innerText = g.mountedHP.toString();
          cells.push(mountedHPCell);
          
          const mountedAttackDebuffCell = document.createElement("sp-table-cell");
          mountedAttackDebuffCell.innerText = g.mountedAttackDebuff.toString();
          cells.push(mountedAttackDebuffCell);
          
          const mountedDefenseDebuffCell = document.createElement("sp-table-cell");
          mountedDefenseDebuffCell.innerText = g.mountedDefenseDebuff.toString();
          cells.push(mountedDefenseDebuffCell);
          
          const mountedHPDebuffCell = document.createElement("sp-table-cell");
          mountedHPDebuffCell.innerText = g.mountedHPDebuff.toString();
          cells.push(mountedHPDebuffCell);
          
          // Add Ranged Troops cells
          const rangedAttackCell = document.createElement("sp-table-cell");
          rangedAttackCell.innerText = g.rangedAttack.toString();
          cells.push(rangedAttackCell);
          
          const rangedDefenseCell = document.createElement("sp-table-cell");
          rangedDefenseCell.innerText = g.rangedDefense.toString();
          cells.push(rangedDefenseCell);
          
          const rangedHPCell = document.createElement("sp-table-cell");
          rangedHPCell.innerText = g.rangedHP.toString();
          cells.push(rangedHPCell);
          
          const rangedAttackDebuffCell = document.createElement("sp-table-cell");
          rangedAttackDebuffCell.innerText = g.rangedAttackDebuff.toString();
          cells.push(rangedAttackDebuffCell);
          
          const rangedDefenseDebuffCell = document.createElement("sp-table-cell");
          rangedDefenseDebuffCell.innerText = g.rangedDefenseDebuff.toString();
          cells.push(rangedDefenseDebuffCell);
          
          const rangedHPDebuffCell = document.createElement("sp-table-cell");
          rangedHPDebuffCell.innerText = g.rangedHPDebuff.toString();
          cells.push(rangedHPDebuffCell);
          
          // Add Siege Machines cells
          const siegeAttackCell = document.createElement("sp-table-cell");
          siegeAttackCell.innerText = g.siegeAttack.toString();
          cells.push(siegeAttackCell);
          
          const siegeDefenseCell = document.createElement("sp-table-cell");
          siegeDefenseCell.innerText = g.siegeDefense.toString();
          cells.push(siegeDefenseCell);
          
          const siegeHPCell = document.createElement("sp-table-cell");
          siegeHPCell.innerText = g.siegeHP.toString();
          cells.push(siegeHPCell);
          
          const siegeAttackDebuffCell = document.createElement("sp-table-cell");
          siegeAttackDebuffCell.innerText = g.siegeAttackDebuff.toString();
          cells.push(siegeAttackDebuffCell);
          
          const siegeDefenseDebuffCell = document.createElement("sp-table-cell");
          siegeDefenseDebuffCell.innerText = g.siegeDefenseDebuff.toString();
          cells.push(siegeDefenseDebuffCell);
          
          const siegeHPDebuffCell = document.createElement("sp-table-cell");
          siegeHPDebuffCell.innerText = g.siegeHPDebuff.toString();
          cells.push(siegeHPDebuffCell);
          
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
            const ga = a.general as Generals.WallGeneralTableData;
            const gb = b.general as Generals.WallGeneralTableData;
            const valueA = ga[sortKey as keyof typeof ga] as string | number;
            const valueB = gb[sortKey as keyof typeof gb] as string | number;

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
          console.log("Wall generals table initialized with", formattedData.length, "items");
        }
      } else {
        console.error("No data-items attribute found on table container");
      }
    } catch (error) {
      console.error("Error initializing wall generals table:", error);
    }
  }
}
