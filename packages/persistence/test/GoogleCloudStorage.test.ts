import "reflect-metadata";

import { readFileSync, writeFileSync, promises as fsPromises } from "fs";
import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { Storage } from "@google-cloud/storage";

describe("Google Cloud Storage Tests", () => {
  test("Connect to the bucket", async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const storage = new Storage({
      keyFilename: "src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });

    const [files] = await storage
      .bucket("ceramic-replacement-bucket")
      .getFiles();
    console.log("Files: ", files.length);

    const data = "this is a test";

    // const [files] = await storage
    //   .bucket("ceramic-replacement-bucket")
    //   .getFiles();

    await fsPromises.writeFile("testing123.txt", data, {
      flag: "w",
    });

    storage.bucket("ceramic-replacement-bucket").upload("testing.txt");

    console.log("bucket is connected!");
  });
});
