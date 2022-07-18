import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest/utils";

// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
import { compilerOptions } from "../../tsconfig.build.json";

const moduleNames = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: "<rootDir>/../..",
});

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Ignore lib folder, use this or root property include paths but not both https://medium.com/swlh/jest-with-typescript-446ea996cc68
  modulePathIgnorePatterns: ["<rootDir>/dist/"],

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
  moduleNameMapper: moduleNames,
  globals: {
    "ts-jest": {
      tsconfig: "test/tsconfig.json",
    },
    window: {},
    __DEBUG__: true,
  },
};

export default config;
