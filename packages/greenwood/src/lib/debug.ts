const DEBUG: boolean = false;
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (DEBUG) {
  console.log(`DEBUG enabled for ${new URL(import.meta.url).pathname}`);
}

const fileDebug: Record<string, boolean> = {
  "/assets/collections/art/collection.ts": false,
  "/assets/collections/ascendingAttributes/collection.ts": false,
  "/assets/collections/blazons/collection.ts": false,
  "/assets/collections/buff/collection.ts": false,
  "/assets/collections/covenants/collection.ts": false,
  "/assets/collections/generalConflictGroups/collection.ts": false,
  "/assets/collections/generals/collection.ts": false,
  "/assets/collections/index.ts": false,
  "/assets/collections/skillBooks/collection.ts": false,
  "/assets/collections/specialities/collection.ts": false,
  "/components/CardGrid.ts": false,
  "/components/GlobalFooter.ts": false,
  "/components/Monsters/Simulator/BuffTable.ts": false,
  "/components/Monsters/Simulator/MarchTable.ts": false,
  "/components/Monsters/Simulator/MonsterOrder.ts": false,
  "/components/Monsters/Simulator/ReferenceTables.ts": false,
  "/components/Monsters/Simulator/index.ts": false,
  "/components/Monsters/Simulator/reference.ts": false,
  "/components/Monsters/Simulator/state.ts": false,
  "/components/SplashCards.ts": false,
  "/components/TopHeader.ts": false,
  "/components/generals/GeneralsList.ts": true,
  "/components/generals/pairing/debugStores.ts": false,
  "/components/generals/pairing/generalPairing.ts": false,
  "/components/generals/pairing/pairingstores.ts": false,
  "/components/generals/pairing/selector.ts": false,
  "/components/generals/tools/GeneralStats.ts": false,
  "/components/sidebar.ts": false,
  "/components/theme.ts": false,
  "/layouts/general.ts": false,
  "/layouts/standard.ts": false,
  "/lib/collections/ascendingAttributes.ts": false,
  "/lib/collections/generals.ts": false,
  "/lib/collections/skillBooks.ts": false,
  "/lib/collections/specialities.ts": false,
  "/lib/debug.ts": false,
  "/lib/greenwoodPages.ts": false,
  "/lib/state/toolsState.ts": false,
  "/lib/topLevelSections.ts": false,
  "/pages/Generals/Pair Picking.ts": false,
  "/pages/Generals/details.ts": true,
  "/pages/Generals/pair-picking.ts": false,
  "/pages/Monsters/Simulator.ts": false,
  "/pages/api/collections/generals.ts": false,
  "/pages/api/collections/skillbooks.ts": false,
  "/plugins/collections/generals.ts": true,
  "/schemas/art.ts": false,
  "/schemas/ascending.ts": false,
  "/schemas/blazons.ts": false,
  "/schemas/buff.ts": false,
  "/schemas/cardMetaData.ts": false,
  "/schemas/constants.ts": false,
  "/schemas/covenants.ts": false,
  "/schemas/generalConflictGroups.ts": false,
  "/schemas/generals.ts": false,
  "/schemas/skillBooks.ts": false,
  "/schemas/specialities.ts": false,
  "/schemas/table.ts": false,
};

function isAbsolutePath(path: string): boolean {
  // Check for Unix-style absolute paths (starts with `/`)
  if (path.startsWith("/")) return true;

  // Check for Windows-style absolute paths (e.g., `C:\Users\Example`)
  if (/^[a-zA-Z]:[\\/]/.test(path)) return true;

  // Check for absolute URLs
  try {
    new URL(path);
    return true;
  } catch {
    return false;
  }
}

const debugFunction = (myName: string): boolean => {
  if (isAbsolutePath(myName)) {
    let root = "";

    const rootStack = new URL(import.meta.url).pathname.split("/");
    root = rootStack.slice(0, -2).join("/");

    myName = myName.replace(root, "");
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (DEBUG) {
      console.log(`new name is ${myName}, root was ${root}`);
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (DEBUG) {
      console.log(`got path ${myName}`);
    }
  }
  return fileDebug[myName];
};

export default debugFunction;
