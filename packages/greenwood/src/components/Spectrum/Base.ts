if (!customElements.get("sp-theme")) {
  await import("@spectrum-web-components/theme/sp-theme.js");
  await import("@spectrum-web-components/theme/src/themes.js");
  await import("@spectrum-web-components/split-view/sp-split-view.js");
}
import "iconify-icon";

import { z } from "zod";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
if (DEBUG) {
  console.log(`DEBUG enabled for ${new URL(import.meta.url).pathname}`);
}

const Theme = z.union([z.literal("light"), z.literal("dark")]);
type Theme = z.infer<typeof Theme>;

export const ThemeSelection = z.union([Theme, z.literal("auto")]);
type ThemeSelection = z.infer<typeof ThemeSelection>;

export const ChangeTheme = (themeValue: ThemeSelection) => {
  if (!themeValue.localeCompare("light") || !themeValue.localeCompare("dark")) {
    // Store the theme preference in localStorage
    localStorage.setItem("theme-preference", themeValue);

    const scale = "medium";
    document.querySelectorAll("sp-theme").forEach((sptheme) => {
      void Promise.all([
        import(new URL(`./theme-${themeValue}.ts`, import.meta.url).pathname),
        import(new URL(`./scale-${scale}.ts`, import.meta.url).pathname),
      ]).then(() => {
        sptheme.color = themeValue as Theme;
        sptheme.scale = scale;
      });
    });
    document.querySelectorAll("html").forEach((html) => {
      if (!html.classList.contains("spectrum")) {
        html.classList.add("spectrum");
      }
      if (!html.classList.contains(themeValue)) {
        if (!themeValue.localeCompare("light")) {
          html.classList.add("spectrum--light");
          html.classList.add("light");
          html.classList.remove("dark");
          html.classList.remove("spectrum--dark");
        } else {
          html.classList.remove("spectrum--light");
          html.classList.remove("light");
          html.classList.add("dark");
          html.classList.add("spectrum--dark");
        }
      }
      if (!html.classList.contains(scale)) {
        html.classList.add(scale);
      }
      if (!html.classList.contains(`spectrum--${scale}`)) {
        html.classList.add(`spectrum--${scale}`);
      }
      if (!html.classList.contains("spectrum-Typography")) {
        html.classList.add("spectrum-Typography");
      }
    });
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const autoTheme = prefersDark ? "dark" : "light";
    // When auto is selected, store that preference
    localStorage.setItem("theme-preference", "auto");
    ChangeTheme(autoTheme);
  }
};

export function getTheme(): ThemeSelection {
  // First try to get from localStorage
  const storedTheme = localStorage.getItem("theme-preference");
  if (storedTheme && ThemeSelection.safeParse(storedTheme).success) {
    return storedTheme as ThemeSelection;
  }

  // If no valid localStorage value, check OS preference
  if (typeof window !== "undefined") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  }

  // Fallback to light if all else fails
  return "light";
}

export default class ThemeComponent extends HTMLElement {
  private storedTheme: Theme = "light";

  private ThemeProvider = () => {
    const storedTheme =
      typeof localStorage !== "undefined" &&
      localStorage.getItem("hpfansite-theme");
    const theme =
      storedTheme ||
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");
    document.documentElement.dataset.theme =
      theme === "light" ? "light" : "dark";
  };
  connectedCallback() {
    if (DEBUG) {
      console.log(`connectedCallback for ThemeComponent`);
    }
    this.ThemeProvider();
    ChangeTheme(this.storedTheme);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        const newTheme = e.matches ? "dark" : "light";
        ChangeTheme(newTheme);
      });
  }
}
if (!customElements.get("theme-provider")) {
  customElements.define("theme-provider", ThemeComponent);
}
