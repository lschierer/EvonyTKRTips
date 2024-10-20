import globalTailwind from "@styles/base.css?inline";

import "@gracile/gracile/hydration";

console.log("Global client scripts here!");
enum Color {
  light,
  dark,
  auto,
}

enum Scale {
  medium,
  large,
}

/* --- functions --- */
const getPreferredColorScheme = (): Color => {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? Color.light
    : Color.dark;
};

export const updateTheme = async (
  color: Color,
  scale: Scale = Scale.medium
) => {
  const base = window.document.querySelector("html.spectrum");

  console.log(`updateTheme running`);

  if (color == Color.light) {
    // Whenever the user explicitly chooses light mode
    localStorage.theme = "light";
  } else if (color == Color.dark) {
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
      if (scale == Scale.medium) {
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
      if (scale == Scale.medium) {
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

baseAdoptedStyles.replaceSync(globalTailwind);

document.adoptedStyleSheets = [baseAdoptedStyles];

updateTheme(Color.light, Scale.medium);
