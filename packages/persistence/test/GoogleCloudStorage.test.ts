import "reflect-metadata";
import { readFileSync, writeFileSync, promises as fsPromises } from "fs";
// import * as path from "path";
import { dirname } from "path";
// import { querystring } from "querystring";
import { Stream } from "stream";
import { fileURLToPath } from "url";

import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import { AxiosAjaxUtils } from "@snickerdoodlelabs/common-utils";
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

    const allFiles = await storage
      .bucket("ceramic-replacement-bucket")
      .getFiles({
        autoPaginate: true,
        versions: true,
        prefix: "test/",
      });
    console.log("allFiles: ", allFiles);

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

    // const usedURL = null;
    // const signedURL = await storage
    //   .bucket("ceramic-replacement-bucket")
    //   .file("kjzl6cwe1jw147v87ik1jkkhit8o20z8o3gdua5n65g3gyc6umsfmz80vphpl6k")
    //   .getSignedUrl(options, async function (err, url) {
    //     if (err) {
    //       console.error("err: ", err);
    //     } else {
    // console.log("url: ", url);
    // console.log("You can use this URL with any user agent, for example:");
    // console.log(
    //   "curl -X PUT -H 'Content-Type: application/octet-stream' " +
    //     `--upload-file my-file '${url}'`,
    // );
    // console.log("Generated PUT signed URL:");
    // console.log(url);
    // const curlTest = new Curl();
    // const terminate = curlTest.close.bind(curlTest);

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
    //   }
    // });

    // const passthroughStream = new Stream.PassThrough();
    // passthroughStream.write(JSON.stringify("Andrew was here"));
    // passthroughStream.end();
    // passthroughStream.pipe(file.createWriteStream()).on("finish", () => {});
  });
});
