const fileDebug: Record<string, boolean> = {
  "assets/collections/art/collection.ts": false,
  "assets/collections/ascendingAttributes/collection.ts": false,
  "assets/collections/blazons/collection.ts": false,
  "assets/collections/buff/collection.ts": false,
  "assets/collections/covenants/collection.ts": false,
  "assets/collections/generalConflictGroups/collection.ts": false,
  "assets/collections/generals/collection.ts": false,
  "assets/collections/skillBooks/collection.ts": false,
  "assets/collections/specialities/collection.ts": false,
  "components/CardGrid.ts": false,
  "components/collections/generals.ts": false,
  "components/generals/pairing/pairingstores.ts": true,
  "/components/generals/pairing/selector.ts": true,
  "components/sidebar.ts": false,
  "components/theme.ts": false,
  "lib/collections/generals.ts": false,
  "lib/collections/skillBooks.ts": true,
  "lib/debug.ts": false,
  "lib/greenwoodpages.ts": false,
  "pages/Generals/details/index.ts": false,
  "pages/api/collections/generals.ts": false,
  "plugins/collections/generals.ts": true,
  "schemas/art.ts": false,
  "schemas/ascending.ts": false,
  "schemas/blazons.ts": false,
  "schemas/buff.ts": false,
  "schemas/constants.ts": false,
  "schemas/covenants.ts": false,
  "schemas/generalConflictGroups.ts": false,
  "schemas/generals.ts": false,
  "schemas/skillBooks.ts": false,
  "schemas/specialities.ts": false,
  "schemas/table.ts": false,
};

const debugFunction = (myName: string): boolean => {
  return fileDebug[myName];
};

export default debugFunction;
