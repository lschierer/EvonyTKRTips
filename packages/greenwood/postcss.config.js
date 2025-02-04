import postcssImport from "postcss-import";
import postcssExtend from "postcss-extend";
import nesting from "postcss-nesting";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";

export default {
  plugins: [postcssImport(), postcssExtend(), nesting(), autoprefixer, cssnano],
};
