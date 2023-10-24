import "reflect-metadata";

import { Storage } from "@google-cloud/storage";
import { IAxiosAjaxUtils, ILogUtils } from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import { ICryptoUtils } from "@snickerdoodlelabs/node-utils";
import * as td from "testdouble";

import { GoogleCloudStorage } from "@persistence/cloud";
import { IPersistenceConfigProvider } from "@persistence/IPersistenceConfigProvider";

class GoogleCloudMocks {
  public _configProvider: IPersistenceConfigProvider;
  public _cryptoUtils: ICryptoUtils;
  public insightPlatformRepo: IInsightPlatformRepository;
  public ajaxAxiosUtils: IAxiosAjaxUtils;
  public logUtils: ILogUtils;

  public constructor() {
    this._configProvider = td.object<IPersistenceConfigProvider>();
    this._cryptoUtils = td.object<ICryptoUtils>();
    this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
    this.ajaxAxiosUtils = td.object<IAxiosAjaxUtils>();
    this.logUtils = td.object<ILogUtils>();
  }
  public factory(): GoogleCloudStorage {
    return new GoogleCloudStorage(
      this._configProvider,
      this._cryptoUtils,
      this.insightPlatformRepo,
      this.ajaxAxiosUtils,
      this.logUtils,
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
