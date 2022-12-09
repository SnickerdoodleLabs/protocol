import "reflect-metadata";

import * as crypto from "crypto";

import {
  Bucket,
  GetBucketSignedUrlConfig,
  GetSignedUrlConfig,
  Storage,
  ServiceAccount,
} from "@google-cloud/storage";
import { AxiosAjaxUtils, CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import {
  AjaxError,
  EVMPrivateKey,
  IDataWalletBackup,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ok, okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import * as td from "testdouble";

// from google.oauth2 import service_account
// import { Service_Account } from "google.oauth2";
import { GoogleCloudStorage } from "@persistence/cloud";
import { IPersistenceConfigProvider } from "@persistence/IPersistenceConfigProvider";

class GoogleCloudMocks {
  public _configProvider: IPersistenceConfigProvider;
  public _cryptoUtils: CryptoUtils;
  public insightPlatformRepo: IInsightPlatformRepository;

  public constructor() {
    this._configProvider = td.object<IPersistenceConfigProvider>();
    this._cryptoUtils = td.object<CryptoUtils>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
  }
  public factory(): GoogleCloudStorage {
    return new GoogleCloudStorage(
      this._configProvider,
      this._cryptoUtils,
      this.insightPlatformRepo,
    );
  }
}

describe("Google Cloud Storage Tests", () => {
  test("Connect to the bucket", async () => {
    const storage = new Storage({
      keyFilename: "src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });
    const fileOptions: GetSignedUrlConfig = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
    // const bucketOptions: GetBucketSignedUrlConfig = {
    //   version: "v4",
    //   action: "read",
    //   expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    // };
    const signedUrl = await storage
      .bucket("ceramic-replacement-bucket")
      .file("0x05E1587afCf321A17a76553BC04C865fbe63AF72/version1")
      .getSignedUrl(fileOptions);

    const ajaxUtils = new AxiosAjaxUtils();
    console.log("signedUrl[0]: ", signedUrl[0]);

    storage.bucket("ceramic-replacement-bucket").getFiles(
      { prefix: "0x427fF45755aBF7c3023d9f091909A0CF5Ef35742/" },
      // .getFiles(
      //   { prefix: req.body.fileName + "/" },
      async function (err, files) {
        console.log("Files: ", files?.length);
        if (err) {
          console.error("err: ", err);
        } else {
          if (err) {
            // console.error("err: ", err);
            // res.send(err);
          } else {
            // console.error("files: ", files);
            // res.send(files);
          }
          // res.send(files);
        }
      },
    );
  });
});
