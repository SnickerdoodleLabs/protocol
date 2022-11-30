import "reflect-metadata";
import { readFileSync, writeFileSync, promises as fsPromises } from "fs";
// import * as path from "path";
import { dirname } from "path";
// import { querystring } from "querystring";
import { Stream } from "stream";
import { fileURLToPath } from "url";

import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import { CryptoUtils } from "@snickerdoodlelabs/common-utils";
import { IInsightPlatformRepository } from "@snickerdoodlelabs/insight-platform-api";
import { EVMPrivateKey } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
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
  const dataWalletKey = EVMPrivateKey("dataWalletKey");

  test("Connect to the bucket", async () => {
    const mocks = new GoogleCloudMocks();
    const queryService = mocks.factory();
    const result = await queryService.unlock(dataWalletKey);
    // Assert
    expect(result).toBeDefined();
  });
});
