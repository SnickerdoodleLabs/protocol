import fs from "fs";

if (process.argv.length !== 5) {
  console.log(
    "Usage: npx jsonToTypescript.js <json file> <typescript file> <exportName>",
  );
}

console.log(
  "Converting json file to typescript. Note, it is legal TS but not formatted nicely.",
);

const json = fs.readFileSync(process.argv[2], "utf8");

// Going to output a TS file.
const fileContent = `export const ${process.argv[4]} =
  ${json};`;

fs.writeFileSync(process.argv[3], fileContent);
