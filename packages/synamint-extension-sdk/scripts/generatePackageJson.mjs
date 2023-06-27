import * as fs from "fs";
import basePackageJson from "../package.base.json" assert { type: "json" };
import umdPackageJson from "../package.umd.json" assert { type: "json" };
import devPackageJson from "../package.dev.json" assert { type: "json" };

const MODE_ARGS = {
  umd: "--umd",
  dev: "--dev",
};
fs.writeFile(
  "package.json",
  JSON.stringify(
    {
      ...basePackageJson,
      ...(process.argv.includes(MODE_ARGS.umd)
        ? umdPackageJson
        : devPackageJson),
    },
    null,
    2,
  ),
  (err) => {
    if (err) console.log(err);
    else {
    }
  },
);
