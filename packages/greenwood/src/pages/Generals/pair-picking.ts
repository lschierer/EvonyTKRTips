function getBody() {
  return `
    <script type="module" src="../../components/generalsSectionElements/tabulator-element.ts"></script>
    <p>picking pairs</p>
    <tabulator-element></tabulator-element>
  `;
}

function getFrontmatter() {
  return {
    title: "Evaluating Relative Strength of Pairs",
    author: "Luke Schierer",
    layout: "standard",
  };
}

export { getFrontmatter, getBody };
