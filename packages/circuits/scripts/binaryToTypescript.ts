import fs from "fs";

if (process.argv.length !== 5) {
  console.log(
    "Usage: npx binaryToTypescript.js <binary file> <typescript file> <exportName>",
  );
}

console.log("Converting binary file to typescript");

const buf = fs.readFileSync(process.argv[2]);

//const uint8array = new Uint8Array(buf.buffer);

//console.log(buf.toString("base64"));

const base64Str = buf.toString("base64");

// Going to output a TS file.
const fileContent = `const wasmBinary = "${base64Str}";
export const ${process.argv[4]} = new Uint8Array(Buffer.from(wasmBinary, "base64").buffer);`;

fs.writeFileSync(process.argv[3], fileContent);
