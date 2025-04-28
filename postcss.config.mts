import autoprefixer from "autoprefixer";
import "postcss-import";
import "postcss-nesting";
import "postcss-extend";
import "cssnano";

export default {
  plugins: {
    "postcss-import": {},
    "postcss-extend": {},
    "postcss-nesting": {},
    autoprefixer: {},
  },
};
