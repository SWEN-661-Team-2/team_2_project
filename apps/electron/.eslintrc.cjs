// path: apps/electron/.eslintrc.cjs
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["react"],
  extends: ["eslint:recommended", "plugin:react/recommended"],
  settings: {
    react: { version: "detect" },
  },
  rules: {
    // React 17+ JSX transform
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "renderer-dist/",
    "coverage/",
    "**/*.min.js",
  ],
};