import { readFileSync } from "fs";
import path from "path";

import { Circomkit } from "circomkit";

// const configFilePath = path.join(__dirname, "../circomkit.json");
// const config = JSON.parse(readFileSync(configFilePath, "utf-8"));

// eslint-disable-next-line import/prefer-default-export
export const circomkit = new Circomkit({
  protocol: "groth16",
  prime: "bn128",
  version: "2.1.5",
  circuits: "./circuits.json",
  dirPtau: "./ptau",
  dirCircuits: "./",
  dirInputs: "./inputs",
  dirBuild: "./build",
  optimization: 2,
  inspect: true,
  include: [
    "../../node_modules/circomlib/circuits",
    "../../node_modules/@zk-kit/circuits/circom",
  ],
  groth16numContributions: 1,
  groth16askForEntropy: false,
  logLevel: "INFO",
  verbose: true,
});
