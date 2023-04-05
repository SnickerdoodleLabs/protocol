import "reflect-metadata";

import { Storage } from "@google-cloud/storage";
import { AxiosAjaxUtils, CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import * as td from "testdouble";

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
