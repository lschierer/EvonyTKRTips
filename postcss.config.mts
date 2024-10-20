import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import * as postcssimport from "postcss-import";
import nesting from "tailwindcss/nesting";

export default {
  plugins: {
    postcssimport: {},
    nesting: {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
