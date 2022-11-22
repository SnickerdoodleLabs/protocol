import "reflect-metadata";
// import { readFileSync, writeFileSync, promises as fsPromises } from "fs";
// import * as path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";

import { GoogleCloudStorage } from "@persistence/cloud/GoogleCloudStorage";

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

    const [files2] = await storage
      .bucket("ceramic-replacement-bucket")
      .getFiles({
        versions: true,
      });

    console.log("Files2: ", files2);
    files2.forEach((asdf) => {
      console.log(asdf.name, asdf.generation);
    });

    const allFiles = await storage
      .bucket("ceramic-replacement-bucket")
      .getFiles({
        autoPaginate: true,
        versions: true,
        prefix:
          "kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k",
      });

    const allFiles2 = await storage
      .bucket("ceramic-replacement-bucket")
      .getFiles({
        autoPaginate: true,
        versions: true,
        prefix:
          "ceramic-replacement-bucket/kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k",
      });

    const filesStream = await storage
      .bucket("ceramic-replacement-bucket")
      .getFilesStream();

    // _events: [Object: null prototype] {},
    // _eventsCount: 0,
    // _maxListeners: undefined,
    // metadata: [Object],
    // baseUrl: '/o',
    // parent: [Bucket],
    // id: 'kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k',
    // createMethod: undefined,
    // methods: [Object],
    // interceptors: [],
    // projectId: undefined,
    // create: undefined,
    // bucket: [Bucket],
    // storage: [Storage],
    // generation: 1669090291097922,
    // kmsKeyName: undefined,
    // userProject: undefined,
    // name: 'kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k',
    // acl: [Acl],
    // crc32cGenerator: [Function: CRC32C_DEFAULT_VALIDATOR_GENERATOR],
    // instanceRetryValue: true,
    // instancePreconditionOpts: undefined,
    // [Symbol(kCapture)]: false

    console.log("allFiles: ", allFiles);
    console.log("allFiles2: ", allFiles2);

    console.log("filesStream: ", filesStream);
  });
});
