import "reflect-metadata";

import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import { AxiosAjaxUtils, CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import {
  AjaxError,
  IDataWalletBackup,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { ok, okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import * as td from "testdouble";

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
  // const dataWalletKey = EVMPrivateKey("dataWalletKey");
  // test("Connect to the bucket", async () => {
  //   const mocks = new GoogleCloudMocks();
  //   const queryService = mocks.factory();
  //   const result = await queryService.unlock(dataWalletKey);
  //   // Assert
  //   expect(result).toBeDefined();
  // });

  test("Connect to the bucket", async () => {
    const storage = new Storage({
      keyFilename: "src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });
    const readOptions: GetSignedUrlConfig = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const ajaxUtils = new AxiosAjaxUtils();
    const getUrl = await storage
      .bucket("ceramic-replacement-bucket")
      .file("0x6F23769C1148F43E4A9A821F55FE002105B21327/version1")
      .getSignedUrl(readOptions);
    console.log("getUrl[0]: ", getUrl[0]);
    const returnedval = ResultAsync.fromPromise(
      ajaxUtils.get(new URL(getUrl[0])).then((answer) => {
        console.log("answer: ", answer);
      }),
      (e) => new PersistenceError("blah"),
    );
    console.log("returnedval: ", returnedval);

    let val;

    return ResultAsync.fromPromise(
      storage
        .bucket("ceramic-replacement-bucket")
        .getFiles({ prefix: "0x6F23769C1148F43E4A9A821F55FE002105B21327/" }),
      (e) =>
        new PersistenceError(
          "unable to retrieve GCP file version from data wallet {addr}",
          e,
        ),
    ).map((allFiles) => {
      console.log("allFiles file: ", allFiles);
      const ajaxUtils = new AxiosAjaxUtils();
      const fileArray = allFiles[0];

      return ResultUtils.combine(
        fileArray.map((file) => {
          return ResultAsync.fromPromise(
            file.getSignedUrl(readOptions),
            (e) => new PersistenceError("Error pinning stream", e),
          ).andThen((vas) => {
            return okAsync(vas);
          });
        }),
      ).andThen((signedUrls) => {
        return ResultUtils.combine(
          signedUrls.map((signedUrl) => {
            return ResultAsync.fromPromise(
              ajaxUtils.get(new URL(signedUrl[0])).then((innerValue) => {
                return (innerValue["value"] as IDataWalletBackup);
              }),
              (e) => new AjaxError("unable let {addr}", e),
            ).andThen((qwe) => {
              return okAsync(qwe as IDataWalletBackup);
            });
          }),
        ).andThen((po) => {
          console.log("po: ", po);
          return okAsync(po);
        });
      });
    });
  });
});
