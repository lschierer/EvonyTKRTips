import path from "path";
import postcssImport from "postcss-import";
import postcssExtend from "postcss-extend";
import nesting from "postcss-nesting";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    postcssImport({
      path: [
        path.resolve(new URL(import.meta.url).pathname, "..", "node_modules"),
      ],
    }),
    postcssExtend(),
    nesting(),
    autoprefixer,
    // Add other PostCSS plugins here if needed
  ],
};
