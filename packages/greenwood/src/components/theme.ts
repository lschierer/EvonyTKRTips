import debugFunction from "@lib/debug.ts";
const DEBUG = debugFunction("components/theme.ts");

export default class ThemeComponent extends HTMLElement {
  protected connectedCallback() {
    const storedTheme =
      typeof localStorage !== "undefined" &&
      localStorage.getItem("greenwood-theme");

    const theme =
      storedTheme ||
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");

    if (DEBUG) {
      console.log(
        `ThemeComponent thinks theme is ${theme}, storedTheme is ${storedTheme}`
      );
    }

    document.querySelectorAll("html").forEach((htmlTag) => {
      if (!theme.localeCompare("light") || !theme.localeCompare("dark")) {
        const scale = "medium";
        if (!htmlTag.classList.contains("spectrum")) {
          htmlTag.classList.add("spectrum");
        }
        if (!htmlTag.classList.contains(theme)) {
          if (!theme.localeCompare("light")) {
            htmlTag.classList.add("spectrum--light");
            htmlTag.classList.remove("spectrum--dark");
          } else {
            htmlTag.classList.remove("spectrum--light");
            htmlTag.classList.add("spectrum--dark");
          }
        }
        if (!htmlTag.classList.contains(scale)) {
          htmlTag.classList.add(scale);
        }
      }
    });
  }
}
customElements.define("theme-component", ThemeComponent);
