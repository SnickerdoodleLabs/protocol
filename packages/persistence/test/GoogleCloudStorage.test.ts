import "reflect-metadata";
import { readFileSync, writeFileSync, promises as fsPromises } from "fs";
// import * as path from "path";
import { dirname } from "path";
// import { querystring } from "querystring";
import { Stream } from "stream";
import { fileURLToPath } from "url";

import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import axios, { AxiosRequestConfig, AxiosPromise } from "axios";
import { request, Request } from "express";
import { fromSafePromise } from "neverthrow/dist";
import fetch, { fileFromSync } from "node-fetch";
import { Curl } from "node-libcurl";

import { GoogleCloudStorage } from "@persistence/cloud/GoogleCloudStorage";

describe("Google Cloud Storage Tests", () => {
  test("Connect to the bucket", async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    console.log("__dirname: ", __dirname);
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
          method: ["POST"],
          origin: ["*"],
          responseHeader: [
            "Content-Type",
            "Access-Control-Allow-Origin",
            "x-goog-resumable",
          ],
        },
      ]);

    // const [files2] = await storage
    //   .bucket("ceramic-replacement-bucket")
    //   .getFiles({
    //     versions: true,
    //   });

    // // console.log("Files2: ", files2);
    // files2.forEach((asdf) => {
    //   // console.log(asdf.name, asdf.generation);
    // });

    // const allFiles = await storage
    //   .bucket("ceramic-replacement-bucket")
    //   .getFiles({
    //     autoPaginate: true,
    //     versions: true,
    //     prefix:
    //       "kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k",
    //   });

    // const allFiles2 = await storage
    //   .bucket("ceramic-replacement-bucket")
    //   .getFiles({
    //     autoPaginate: true,
    //     versions: true,
    //     prefix:
    //       "ceramic-replacement-bucket/kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k",
    //   })

    const options: GetSignedUrlConfig = {
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: "application/octet-stream",
    };

    const readOptions: GetSignedUrlConfig = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
    const url = await storage
      .bucket("ceramic-replacement-bucket")
      .file("kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k")
      .getSignedUrl(options);

    console.log("url: ", url[0]);

    await storage.bucket("ceramic-replacement-bucket").setCorsConfiguration([
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

    const usedURL = null;
    const signedURL = await storage
      .bucket("ceramic-replacement-bucket")
      .file("kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k")
      .getSignedUrl(options, async function (err, url) {
        if (err) {
          console.error("err: ", err);
        } else {
          console.log("url: ", url);
          console.log("You can use this URL with any user agent, for example:");
          console.log(
            "curl -X PUT -H 'Content-Type: application/octet-stream' " +
              `--upload-file my-file '${url}'`,
          );
          console.log("Generated PUT signed URL:");
          console.log(url);
          const curlTest = new Curl();
          const terminate = curlTest.close.bind(curlTest);

          // if (url !== undefined) {
          //   curlTest.setOpt(Curl.option.URL, url);
          // }
          // curlTest.setOpt(Curl.option.PUT, true);
          // curlTest.setOpt(
          //   Curl.option.POSTFIELDS,
          //   new URLSearchParams([
          //     ["Content-Type", "application/octet-stream"],
          //   ]).toString(),
          // );
          // curlTest.setOpt(Curl.option.HTTPPOST, [
          //   { name: "credentials", file: "src/credentials.json" },
          // ]);

          // curlTest.on("end", function (statusCode, data, headers) {
          //   console.info(data);
          //   this.close();
          // });

          // curlTest.on("error", terminate);
          // console.log("END ");
          // curlTest.perform();

          // const passthroughStream = new Stream.PassThrough();
          // passthroughStream.write(JSON.stringify("Andrew was here"));
          // passthroughStream.end();
          // passthroughStream
          //   .pipe(url.createWriteStream())
          //   .on("finish", () => {});
        }
      });

    const file = await storage
      .bucket("ceramic-replacement-bucket")
      .file("kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k");

    const ansURL = await storage
      .bucket("ceramic-replacement-bucket")
      .file("kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k")
      .getSignedUrl(options);

    // const passthroughStream = new Stream.PassThrough();
    // passthroughStream.write(JSON.stringify("Andrew was here"));
    // passthroughStream.end();
    // passthroughStream.pipe(file.createWriteStream()).on("finish", () => {});

    console.log("asdf: ");

    // const response = await axios.put(
    //   "https://storage.googleapis.com/ceramic-replacement-bucket/kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k",
    //   "",
    //   {
    //     params: {
    //       "X-Goog-Algorithm": "GOOG4-RSA-SHA256",
    //       "X-Goog-Credential":
    //         "ceramic-replacement@snickerdoodle-insight-stackdev.iam.gserviceaccount.com/20221129/auto/storage/goog4_request",
    //       "X-Goog-Date": "20221129T024315Z",
    //       "X-Goog-Expires": "901",
    //       "X-Goog-SignedHeaders": "content-type;host",
    //       "X-Goog-Signature":
    //         "117771c48829917a5c05b8016ae8d90b5110eadd9324126bcdf90e49bb2363de393f205de4f59faa3ab80cb6ed5ec48fafd6fab00be46753a37ace71fb9fce5914881ce68b7655945a2816754e0739ad207fd8dd8c4c3ca7991736c8b5b497691997f69550485442b74ac54b7e32788bc9da9a5b88a777952f813742730eeaa8132d5a3a30ee4539a3d6c8c1947f70978874acbe6fb4b9fa2fdd5dc211f029ed54929b93ac71a8a27ca446c127204ba4ff085266dea96e85ce4b69dff89185f5d88897a0d02d79daf61fa05c5cdfd7090c719559e004a6517ef38e45980378d9bf29b0b61c469d8d0ffab78490df9a5786d2d97a4c889fe70a84d7b5915b77e9",
    //     },
    //     headers: {
    //       "Content-Type": "application/octet-stream",
    //     },
    //   },
    // );

    const res = fetch(
      "https://storage.googleapis.com/ceramic-replacement-bucket/kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=ceramic-replacement%40snickerdoodle-insight-stackdev.iam.gserviceaccount.com%2F20221129%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221129T024315Z&X-Goog-Expires=901&X-Goog-SignedHeaders=content-type%3Bhost&X-Goog-Signature=117771c48829917a5c05b8016ae8d90b5110eadd9324126bcdf90e49bb2363de393f205de4f59faa3ab80cb6ed5ec48fafd6fab00be46753a37ace71fb9fce5914881ce68b7655945a2816754e0739ad207fd8dd8c4c3ca7991736c8b5b497691997f69550485442b74ac54b7e32788bc9da9a5b88a777952f813742730eeaa8132d5a3a30ee4539a3d6c8c1947f70978874acbe6fb4b9fa2fdd5dc211f029ed54929b93ac71a8a27ca446c127204ba4ff085266dea96e85ce4b69dff89185f5d88897a0d02d79daf61fa05c5cdfd7090c719559e004a6517ef38e45980378d9bf29b0b61c469d8d0ffab78490df9a5786d2d97a4c889fe70a84d7b5915b77e9",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: fileFromSync("src/upload.txt"),
      },
    ).then((response) => console.log("Check this 1: ", response.body));

    // const body = (await res).text();
    // console.log("body: ", body);

    // const de = (await res).json();
    // console.log("body: ", de);

    console.log("ALL DONE! ");
  });
});
