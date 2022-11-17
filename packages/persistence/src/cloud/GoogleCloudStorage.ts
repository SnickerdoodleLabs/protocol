// import { fs } from "fs";
// import { path } from "path";
import { readFileSync, writeFileSync, promises as fsPromises } from "fs";
import * as path from "path";
import { dirname } from "path";
import { Stream } from "stream";
import { fileURLToPath } from "url";
import { promisify } from "util";

import { Storage } from "@google-cloud/storage";
import { CryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  BackupIndex,
  BackupIndexEntry,
  CeramicStreamID,
  EVMPrivateKey,
  IDataWalletBackup,
  ModelTypes,
  PersistenceError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IPersistenceConfig } from "..";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";

@injectable()
export class GoogleCloudStorage implements ICloudStorage {
  protected _backups = new Map<string, IDataWalletBackup>();
  protected _lastRestore = 0;

  private _unlockPromise: Promise<EVMPrivateKey>;
  private _resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null =
    null;

  private storage?: Storage;
  private config?: IPersistenceConfig;

  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected _configProvider: IPersistenceConfigProvider,
    @inject(ICryptoUtilsType) protected _cryptoUtils: CryptoUtils,
  ) {
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });
  }

  private _init(): ResultAsync<
    {
      storage: Storage;
      config: IPersistenceConfig;
    },
    PersistenceError
  > {
    return this._configProvider.getConfig().andThen((config) => {
      this.config = config;
      //   console.log("config: ", config);
      this.storage = new Storage({
        keyFilename: "../persistence/src/credentials.json",
        projectId: "snickerdoodle-insight-stackdev",
      });

      //   console.log("storage: ", this.storage);
      return okAsync({
        storage: this.storage,
        config: config,
      });
    });
  }

  public clear(): ResultAsync<void, PersistenceError> {
    return okAsync(undefined);
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._resolveUnlock!(derivedKey);
    return okAsync(undefined);
  }

  /* Upload a new file */
  putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<CeramicStreamID, PersistenceError> {
    return this._init().andThen(({ storage, config }) => {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);

      //   console.log("Dirname 2: ", __dirname);

      const data = new IDataWalletBackup;
      fsPromises.writeFile("testing789.txt", data, {
        flag: "w",
      });

      this.storage = new Storage({
        keyFilename: "../persistence/src/credentials.json",
        projectId: "snickerdoodle-insight-stackdev",
      });

      const filePath = "testing789.txt";
      const dataWalletId = "walletNumber";
      const options = {
        destination: "develop/".concat(dataWalletId).concat("/version2"),
      };
      const bucketName = "ceramic-replacement-bucket";

      this.storage
        .bucket("ceramic-replacement-bucket")
        .upload(filePath, options);
      //   console.log(`${filePath} uploaded to ${bucketName}`);

      this._lastRestore =
        backup.header.timestamp > this._lastRestore
          ? backup.header.timestamp
          : this._lastRestore;
      this._backups[backup.header.hash] = backup;

      return okAsync(CeramicStreamID(""));
    });
  }

  /* Routinely upload a new file */
  pollBackups(): ResultAsync<IDataWalletBackup[], PersistenceError> {
    return this._init().andThen(({ storage, config }) => {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = dirname(__filename);

      //   console.log("Polling config: ", config);

      const data = "this is a test";
      fsPromises.writeFile("testing456.txt", data, {
        flag: "w",
      });

      this.storage = new Storage({
        keyFilename: "../persistence/src/credentials.json",
        projectId: "snickerdoodle-insight-stackdev",
      });

      const filePath = "testing456.txt";
      const dataWalletId = "walletNumber";
      const options = {
        destination: "develop/".concat(dataWalletId).concat("/version3"),
      };
      const bucketName = "ceramic-replacement-bucket";

      this.storage
        .bucket("ceramic-replacement-bucket")
        .upload(filePath, options);
      //   console.log(`${filePath} uploaded to ${bucketName}`);
      return okAsync([]);
    });
  }
}
