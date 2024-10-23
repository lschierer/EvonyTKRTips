import base from "./base.css?inline";

console.log(`import.meta.env.DEV  is ${import.meta.env.DEV}`);
import "@gracile/gracile/hydration";

import { Color, Scale } from "@schemas/generics";

console.log("Global client scripts here!");

const light: Color = "light";
const dark: Color = "dark";

/* --- functions --- */
const getPreferredColorScheme = (): Color => {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? light
    : dark;
};

export const updateTheme = async (color: Color, scale: Scale = "medium") => {
  const base = window.document.querySelector("html.spectrum");

  console.log(`updateTheme running`);

  if (!color.localeCompare(light)) {
    // Whenever the user explicitly chooses light mode
    localStorage.theme = light;
  } else if (!color.localeCompare(dark)) {
    // Whenever the user explicitly chooses dark mode
    localStorage.theme = "dark";
  } else {
    // Whenever the user explicitly chooses to respect the OS preference
    localStorage.removeItem("theme");
    updateTheme(getPreferredColorScheme(), scale);
    return;
  }

  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    if (base) {
      if (!scale.localeCompare("medium")) {
        base.className = ["spectrum", "spetrum--medium", "spectrum--dark"].join(
          " "
        );
      } else {
        console.error("unsupported value for scale");
      }
    }
  } else {
    document.documentElement.classList.remove("dark");
    if (base) {
      if (!scale.localeCompare("medium")) {
        base.className = [
          "spectrum",
          "spetrum--medium",
          "spectrum--light",
        ].join(" ");
      } else {
        console.error("unsupported value for scale");
      }
    }
  }
};

/* --- end functions --- */

const baseAdoptedStyles = new CSSStyleSheet();

baseAdoptedStyles.replaceSync(base);

document.adoptedStyleSheets = [baseAdoptedStyles];

updateTheme("light", "medium");
