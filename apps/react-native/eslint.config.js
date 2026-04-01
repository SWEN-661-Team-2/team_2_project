// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", ".expo/*", "assets/*", "coverage/*"],
  },
  {
    files: ["**/__tests__/**/*", "**/*.test.*", "jest.setup.js", "e2e/**/*"],
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        device: "readonly",
        element: "readonly",
        by: "readonly",
      },
    },
  },
]);
