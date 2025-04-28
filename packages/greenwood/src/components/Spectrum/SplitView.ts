import "@spectrum-web-components/split-view/sp-split-view.js";

if (document.querySelector(".spectrum-SideNav")) {
  await fetch("/styles/sidebar.css")
    .then((res) => res.text())
    .then(async (css) => {
      const sheet = new CSSStyleSheet();
      await sheet.replace(css).then(() => {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
      });
    });
}
