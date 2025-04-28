import "@spectrum-web-components/theme/theme-light.js";
import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
if (DEBUG) {
  console.log("Dark theme loaded");
}
