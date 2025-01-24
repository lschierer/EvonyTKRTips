import debugFunction from "../lib/debug.ts";
const DEBUG = debugFunction("components/theme.ts");

import "@spectrum-web-components/theme/sp-theme.js";
import "@spectrum-web-components/theme/src/themes.js";

export default class ThemeComponent extends HTMLElement {
  /**
   * Utility function to calculate the current theme setting.
   * Look for a local storage value.
   * Fall back to system setting.
   * Fall back to light mode.
   */
  private calculateSettingAsThemeString(
    localStorageTheme: string | null,
    systemSettingDark: MediaQueryList
  ) {
    if (localStorageTheme !== null) {
      return localStorageTheme;
    }

    if (systemSettingDark.matches) {
      return "dark";
    }

    return "light";
  }

  /**
   * Utility function to update the button text and aria-label.
   */
  private updateButton(buttonEl: HTMLElement, isDark: boolean) {
    const newCta = isDark ? "Change to light theme" : "Change to dark theme";
    // use an aria-label if you are omitting text on the button
    // and using a sun/moon icon, for example
    buttonEl.setAttribute("aria-label", newCta);
    buttonEl.innerHTML = isDark
      ? `<iconify-icon icon="ion:sunny-outline" role="img"
                      class="spectrum-Icon spectrum-Icon--sizeM spectrum-ActionButton-icon"></iconify-icon><span class="spectrum-ActionButton-label"> Change to Light</span>`
      : `<iconify-icon icon="ion:moon-outline" role="img"
                      class="spectrum-Icon spectrum-Icon--sizeM spectrum-ActionButton-icon"></iconify-icon><span class="spectrum-ActionButton-label"> Change to Dark</span>`;
  }

  /**
   * Utility function to update the theme setting on the html tag
   */
  private updateThemeOnHtmlEl(theme: string, scale = "medium") {
    const htmlTag = document.querySelector("html");
    if (htmlTag) {
      htmlTag.setAttribute("data-theme", theme);
      if (!htmlTag.classList.contains("spectrum")) {
        htmlTag.classList.add("spectrum");
      }
      if (!htmlTag.classList.contains(theme)) {
        if (!theme.localeCompare("light")) {
          htmlTag.classList.add("spectrum--light");
          htmlTag.classList.remove("spectrum--dark");
          htmlTag.setAttribute("data-theme", "light");
        } else {
          htmlTag.classList.remove("spectrum--light");
          htmlTag.classList.add("spectrum--dark");
          htmlTag.setAttribute("data-theme", "dark");
        }
      }
      if (!htmlTag.classList.contains("scale")) {
        htmlTag.classList.add(scale);
      }
    }
    document.querySelectorAll("sp-theme").forEach((spThemeTag) => {
      if (!theme.localeCompare("light")) {
        spThemeTag.color = "light";
      } else if (!theme.localeCompare("dark")) {
        spThemeTag.color = "dark";
      } else {
        if (DEBUG) {
          console.warn(`unknown value for theme: ${theme}`);
        }
      }
      spThemeTag.scale = "medium";
    });
  }

  protected async connectedCallback() {
    const localStorageTheme = localStorage.getItem("theme");
    const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

    let currentThemeSetting = this.calculateSettingAsThemeString(
      localStorageTheme,
      systemSettingDark
    );

    await customElements.whenDefined("top-header").then(() => {
      const themeSelectorDiv = document.querySelector(".themeSelector");
      if (themeSelectorDiv) {
        if (DEBUG) {
          console.log(`themeSelectorDiv found`);
        }
        themeSelectorDiv.innerHTML = `
          <button
            class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet"
            type="button"
            id="data-theme-toggle"
            aria-label="Change to light theme"
            >
            <iconify-icon icon="tdesign:laptop" ></iconify-icon>
          </button>
        `;
        const button = document.querySelector("#data-theme-toggle");
        if (button) {
          if (DEBUG) {
            console.log(`button found, update it.`);
          }
          this.updateButton(
            button as HTMLElement,
            currentThemeSetting === "dark"
          );
          button.addEventListener("click", () => {
            const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

            localStorage.setItem("theme", newTheme);
            this.updateButton(button as HTMLElement, newTheme === "dark");
            this.updateThemeOnHtmlEl(newTheme);

            currentThemeSetting = newTheme;
          });
        }
      } else {
        console.log(`themeSelectorDiv not found`);
      }
    });

    this.updateThemeOnHtmlEl(currentThemeSetting);
  }
}
customElements.define("theme-component", ThemeComponent);
