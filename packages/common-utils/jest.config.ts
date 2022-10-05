// import type { Config } from "@jest/types";
// import { pathsToModuleNameMapper } from "ts-jest";

// // In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// // which contains the path mapping (ie the `compilerOptions.paths` option):
// import { compilerOptions } from "../../tsconfig.build.json";

// const moduleNames = pathsToModuleNameMapper(compilerOptions.paths, {
//   prefix: "<rootDir>/../..",
// });

// const config: Config.InitialOptions = {
//   preset: "ts-jest/presets/default-esm-legacy",
//   resolver: "ts-jest-resolver",
//   extensionsToTreatAsEsm: [".ts"],
//   testEnvironment: "node",
//   // Ignore lib folder, use this or root property include paths but not both https://medium.com/swlh/jest-with-typescript-446ea996cc68
//   modulePathIgnorePatterns: ["<rootDir>/dist/"],

//   // This does not seem to support blacklisting any folder which means we can't enable parent directory and disable child
//   // We should be using peer directories for coverage and non-coverage tests.
//   collectCoverageFrom: [
//     // Enabling following means we can't disable src/tests from coverage report
//     // "<rootDir>/src/**/*.ts",

//     // Add other allowed folders to the list below.
//     "<rootDir>/src/implementations/**/*.ts",
//     "!<rootDir>/src/implementations/**/index.ts",

//     // Disabled because we don't want it to end up in coverage report,
//     // "<rootDir>/src/tests/**/*.ts",
//   ],
//   moduleNameMapper: moduleNames,
//   transform: {
//     "<regex_match_files>": [
//       "ts-jest",
//       {
//         tsconfig: "test/tsconfig.json",
//         useESM: true,
//       },
//     ],
//   },
// };

// export default config;

// const config: Config.InitialOptions = {
// module.exports = {
//   testEnvironment: "node",
//   // Ignore lib folder, use this or root property include paths but not both https://medium.com/swlh/jest-with-typescript-446ea996cc68
//   //modulePathIgnorePatterns: ["<rootDir>/dist/"],

//   testMatch: ["<rootDir>/dist/test/**/*.test.js"],

//   // This does not seem to support blacklisting any folder which means we can't enable parent directory and disable child
//   // We should be using peer directories for coverage and non-coverage tests.
//   collectCoverageFrom: [
//     // Enabling following means we can't disable src/tests from coverage report
//     // "<rootDir>/src/**/*.ts",

//     // Add other allowed folders to the list below.
//     // "<rootDir>/src/**/*.ts",
//     // "!<rootDir>/src/**/index.ts",

//     // Disabled because we don't want it to end up in coverage report,
//     // "<rootDir>/src/tests/**/*.ts",
//   ],
//   // moduleNameMapper: moduleNames,
// };

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
