const path = require("path");

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.resolve(__dirname, "./tsconfig.json"),
  },
  plugins: ["@typescript-eslint", "prettier"],
  env: {
    node: true,
    jest: true,
  },
  extends: [
    "airbnb-base",
    "plugin:import/typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],
  rules: {
    "func-names": ["error", "as-needed"],
    "no-underscore-dangle": "off",
    "max-classes-per-file": "off",
    "sort-imports": ["error", {
      "ignoreCase": true,
      "ignoreDeclarationSort": true,
    }],
    "import/extensions": "off",
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    "import/no-named-as-default": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-expressions": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/no-use-before-define": ["error", "nofunc"],
  },
  overrides: [
    {
      files: ["**/*.spec.ts"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/unbound-method": "off",
      },
    },
  ],
  ignorePatterns: ["**/*.js", "**/*.mjs", "dist/**", "**/*.json", "**/*.snap"],
};