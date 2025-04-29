const DEBUG: boolean = false;
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (DEBUG) {
  console.log(`DEBUG enabled for ${new URL(import.meta.url).pathname}`);
}

const fileDebug: Record<string, boolean> = {
  "/components/CardGrid.ts": false,
  "/components/Monsters/Simulator/BuffTable.ts": false,
  "/components/Monsters/Simulator/MarchTable.ts": false,
  "/components/Monsters/Simulator/MonsterOrder.ts": false,
  "/components/Monsters/Simulator/ReferenceTables.ts": false,
  "/components/Monsters/Simulator/index.ts": false,
  "/components/Monsters/Simulator/reference.ts": false,
  "/components/Monsters/Simulator/state.ts": false,
  "/components/SideBar.ts": false,
  "/components/Spectrum/Base.ts": false,
  "/components/Spectrum/SplitView.ts": false,
  "/components/Spectrum/scale-medium.ts": false,
  "/components/Spectrum/theme-dark.ts": false,
  "/components/Spectrum/theme-light.ts": false,
  "/components/SplashCards.ts": false,
  "/components/ascendingattributes/DetailsDisplay.ts": false,
  "/components/common/BaseDetailsDisplay.ts": false,
  "/components/common/DetailsDisplay.ts": false,
  "/components/covenants/DetailsDisplay.ts": false,
  "/components/generals/DetailsDisplay.ts": false,
  "/components/generals/GeneralsList.ts": false,
  "/components/generals/pairing/debugStores.ts": false,
  "/components/generals/pairing/generalPairing.ts": false,
  "/components/generals/pairing/pairingstores.ts": false,
  "/components/generals/pairing/selector.ts": false,
  "/components/generals/tools/GeneralStats.ts": false,
  "/components/skillbooks/DetailsDisplay.ts": false,
  "/components/specialities/DetailsDisplay.ts": false,
  "/components/theme.ts": false,
  "/layouts/general.ts": false,
  "/lib/BuffSummary.ts": false,
  "/lib/collections/ascendingAttributes.ts": false,
  "/lib/collections/generals.ts": false,
  "/lib/collections/skillBooks.ts": false,
  "/lib/collections/specialities.ts": false,
  "/lib/debug.ts": false,
  "/lib/greenwoodPages.ts": false,
  "/lib/state/collections.ts": false,
  "/lib/state/toolsState.ts": false,
  "/lib/topLevelSections.ts": false,
  "/pages/Generals/Pair Picking.ts": false,
  "/pages/Generals/details.ts": false,
  "/pages/Generals/pair-picking.ts": false,
  "/pages/Monsters/Simulator.ts": false,
  "/pages/Reference/Specialities/index.ts": false,
  "/pages/api/collections/ascending.ts": false,
  "/pages/api/collections/covenants.ts": false,
  "/pages/api/collections/generals.ts": false,
  "/pages/api/collections/skillbooks.ts": false,
  "/pages/api/collections/specialities.ts": false,
  "/plugins/collections/ascendingAttributes.ts": false,
  "/plugins/collections/specialities.ts": false,
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
