import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/dist/test/**/*.test.js"],

  // This does not seem to support blacklisting any folder which means we can't enable parent directory and disable child
  // We should be using peer directories for coverage and non-coverage tests.
  collectCoverageFrom: [
    // Enabling following means we can't disable src/tests from coverage report
    // "<rootDir>/src/**/*.ts",

    // Add other allowed folders to the list below.
    "<rootDir>/src/implementations/**/*.ts",
    "!<rootDir>/src/implementations/**/index.ts",

    // Disabled because we don't want it to end up in coverage report,
    // "<rootDir>/src/tests/**/*.ts",
  ],
};

export default config;
