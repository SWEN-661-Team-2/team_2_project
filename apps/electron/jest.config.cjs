module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "<rootDir>/tests/ipc.integration.test.js",
    "<rootDir>/tests/Toolbar.test.js",
    "<rootDir>/tests/Main.test.jsx",
  ],
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "json"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["<rootDir>/tests/**/*.(test|spec).(js|jsx)"],
  collectCoverageFrom: [
    "renderer/src/components/**/*.{js,jsx}",
    "!renderer/src/main.{js,jsx}",
    "!**/*.d.ts",
  ],
  coverageReporters: ["text", "html", "lcov"],
};
