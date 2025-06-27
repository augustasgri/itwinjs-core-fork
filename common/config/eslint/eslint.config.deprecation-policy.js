const iTwinPlugin = require("@itwin/eslint-plugin");

module.exports = [
  {
    languageOptions: {
      sourceType: "module",
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "tsconfig.json",
        ecmaVersion: "latest",
        ecmaFeatures: {
          jsx: true,
          modules: true
        },
      },
    },
    plugins: {
      "@itwin": iTwinPlugin
    },
    files: ["**/*.ts"],
    rules: {
      "@itwin/require-version-in-deprecation": [
        "warn",
        {
          removeOldDates: true,
<<<<<<< HEAD
          addVersion: "5.14.3"
=======
          addVersion: "5.14.6"
>>>>>>> d6f0fbea9 (add deprecation dates using custom ESLint rule)
        }
      ]
    }
  }
]