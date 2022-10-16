// Keeping this file around as a reference in case someone ever wants to take a crack at
// making ts-node based tests work again

import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";

// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
import { compilerOptions } from "../../tsconfig.build.json";

const moduleNames = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: "<rootDir>/../..",
});

const config: Config.InitialOptions = {
  preset: "ts-jest/presets/default-esm",
  resolver: "ts-jest-resolver",
  extensionsToTreatAsEsm: [".ts"],
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
  transform: {
    "<regex_match_files>": [
      "ts-jest",
      {
        tsconfig: "test/tsconfig.json",
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [
    "<rootDir>/../../node_modules/(?!@snickerdoodlelabs/common-utils)/",
  ],
};

export default config;
