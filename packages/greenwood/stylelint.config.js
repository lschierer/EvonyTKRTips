export default {
  extends: "stylelint-config-standard",
  customSyntax: "postcss-lit",
  ignoreFiles: ["**/node_modules/**"],
  rules: {
    "selector-class-pattern": null,
  },
};
