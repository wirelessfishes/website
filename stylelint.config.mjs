/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-order"],
  rules: {
    "order/properties-alphabetical-order": true,

    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "declaration-empty-line-before": null,
    "no-descending-specificity": null,
    "font-family-no-missing-generic-family-keyword": null,
    "length-zero-no-unit": null,
    "rule-empty-line-before": null,
    "comment-empty-line-before": null,
  },
};
