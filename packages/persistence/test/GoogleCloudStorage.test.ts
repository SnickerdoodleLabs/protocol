import "reflect-metadata";

import * as crypto from "crypto";

import {
  Bucket,
  GetBucketSignedUrlConfig,
  GetSignedUrlConfig,
  Storage,
  ServiceAccount,
} from "@google-cloud/storage";
import {
  AxiosAjaxUtils,
  CryptoUtils,
  IAxiosAjaxUtils,
} from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import {
  IDataWalletBackup,
  URLString,
  AjaxError,
  EVMPrivateKey,
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
  public ajaxAxiosUtils: AxiosAjaxUtils;

  public constructor() {
    this._configProvider = td.object<IPersistenceConfigProvider>();
    this._cryptoUtils = td.object<CryptoUtils>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.ajaxAxiosUtils = td.object<AxiosAjaxUtils>();
  }
  public factory(): GoogleCloudStorage {
    return new GoogleCloudStorage(
      this._configProvider,
      this._cryptoUtils,
      this.insightPlatformRepo,
      this.ajaxAxiosUtils,
    );
  }
}

describe("Google Cloud Storage Tests", () => {
  test("Connect to the bucket", async () => {
    const storage = new Storage({
      keyFilename: "../test-harness/src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });
    storage
      .bucket("ceramic-replacement-bucket")
      .deleteFiles({ prefix: "0xBb5127297267eB5711bA9088d974FdA6c891b29E/" });
  });
});
