import { readFileSync } from "fs";
import path from "path";

import { Circomkit } from "circomkit";

const configFilePath = path.join(__dirname, "../circomkit.json");
const config = JSON.parse(readFileSync(configFilePath, "utf-8"));

// eslint-disable-next-line import/prefer-default-export
export const circomkit = new Circomkit({
  ...config,
  verbose: false,
});
