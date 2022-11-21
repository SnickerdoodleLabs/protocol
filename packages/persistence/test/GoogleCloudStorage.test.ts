import "reflect-metadata";
// import { readFileSync, writeFileSync, promises as fsPromises } from "fs";
// import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";

describe("Google Cloud Storage Tests", () => {
  test("Connect to the bucket", async () => {
    const options: GetSignedUrlConfig = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: "text/plain",
    };
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const storage = new Storage({
      keyFilename: "src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });

    const [files] = await storage
      .bucket("ceramic-replacement-bucket")
      .getFiles();

    const corsVals = await storage
      .bucket("ceramic-replacement-bucket")
      .setCorsConfiguration([
        {
          maxAgeSeconds: 3600,
          method: ["PUT", "GET", "HEAD", "DELETE", "POST", "OPTIONS"],
          origin: ["*"],
          responseHeader: [
            "Content-Type",
            "Access-Control-Allow-Origin",
            "x-goog-resumable",
          ],
        },
      ]);

    console.log("Cors: ", corsVals);

    const signedURL = await storage
      .bucket("ceramic-replacement-bucket")
      .file("testing123.txt")
      .getSignedUrl(options, function (err, url) {
        if (err) {
          console.error("err");
          console.error(err);
        } else {
          console.log("url");
          console.log(url);
        }

        console.log("Files: ", files.length);
        console.log("signedURL: ", signedURL);
        console.log("bucket is connected!");
      });
  });
});
