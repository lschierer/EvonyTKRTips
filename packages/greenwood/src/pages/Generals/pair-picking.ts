async function getBody() {
  return `
    <script type="module" src="../../components/generalsSectionElements/tabulator-element.ts"></script>
    <p>picking pairs</p>
    <tabulator-element></tabulator-element>
  `;
}

async function getFrontmatter() {
  return {
    title: "Evaluating Relative Strength of Pairs",
    collection: "Generals",
    author: "Luke Schierer",
    layout: "generals",
  };
}

export { getFrontmatter, getBody };
