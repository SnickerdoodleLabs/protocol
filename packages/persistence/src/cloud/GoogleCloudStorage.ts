// import { fs } from "fs";
// import { path } from "path";
import { readFileSync, writeFileSync, promises as fsPromises } from "fs";
import * as path from "path";
import { dirname } from "path";
import { config } from "process";
import { Stream } from "stream";
import { fileURLToPath } from "url";
import { promisify } from "util";

import { Datastore, Key } from "@google-cloud/datastore";
import { GetServiceAccountResponse, Storage } from "@google-cloud/storage";
import {
  CryptoUtils,
  ICryptoUtilsType,
  ILogUtils,
  LogUtils,
  ILogUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@snickerdoodlelabs/insight-platform-api";
import {
  AESEncryptedString,
  BackupIndex,
  BackupIndexEntry,
  CeramicStreamID,
  EncryptedString,
  EVMPrivateKey,
  IDataWalletBackup,
  InitializationVector,
  ModelTypes,
  PersistenceError,
  IDataWalletPersistenceType,
  IDataWalletPersistence,
  LinkedAccount,
  URLString,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IPersistenceConfig } from "..";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";
import { AjaxError } from "@snickerdoodlelabs/objects";

@injectable()
export class GoogleCloudStorage implements ICloudStorage {
  protected _backups = new Map<string, IDataWalletBackup>();
  protected _lastRestore = 0;

  private _unlockPromise: Promise<EVMPrivateKey>;
  private _resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null =
    null;

  private _storage?: Storage;

  private _restored: Set<string> = new Set();

  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected _configProvider: IPersistenceConfigProvider,
    @inject(ICryptoUtilsType) protected _cryptoUtils: CryptoUtils, // @inject(IDataWalletPersistenceType) // protected persistenceRepo: IDataWalletPersistence,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(ILogUtilsType)
    protected logUtils: ILogUtils,
  ) {
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, AjaxError | PersistenceError> {
    // return this._configProvider.getConfig().andThen((config) => {
    const baseURL = URLString("http://localhost:3006");
    return this.insightPlatformRepo
      .getAuthBackups(derivedKey, baseURL)
      .andThen((signedUrlResponse) => {
        console.log("signedUrlResponse: ", signedUrlResponse);
        return okAsync(undefined);
      });
  }

  public clear(): ResultAsync<void, PersistenceError> {
    return this._init().andThen(({ client }) => {
      return ResultAsync.fromPromise(
        client.bucket("ceramic-replacement-bucket").deleteFiles(),
        (e) =>
          new PersistenceError("unable to delete files from Google Cloud", e),
      );
    });
  }

  private _getGoogleCloudClient(): ResultAsync<Storage, PersistenceError> {
    if (this._storage) {
      return okAsync(this._storage);
    }
    this._storage = new Storage({
      keyFilename: "../persistence/src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });
    return okAsync(this._storage);
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this._unlockPromise);
  }

  private _init(): ResultAsync<
    {
      client: Storage;
      config: IPersistenceConfig;
    },
    PersistenceError
  > {
    return ResultUtils.combine([
      this._getGoogleCloudClient(),
      this._configProvider.getConfig(),
    ]).andThen(([gcpClient, config]) => {
      return okAsync({
        client: gcpClient,
        config: config,
      });
    });
  }

  public putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<CeramicStreamID, PersistenceError> {
    const bucketName = "ceramic-replacement-bucket";
    return this._init().andThen(({ client, config }) => {
      const bucket = client.bucket(bucketName);
      const file = bucket.file(
        config.ceramicModelAliases.definitions.backupIndex,
      );
      /*
        use deriveCeramicSeedFromEVMPrivateKey to create a unique file name
      */
      const passthroughStream = new Stream.PassThrough();
      passthroughStream.write(JSON.stringify(backup));
      passthroughStream.end();
      passthroughStream.pipe(file.createWriteStream()).on("finish", () => {
        this._restored.add(file.metadata.generation);
        this._backups.set(file.metadata.generation, backup);
      });
      return okAsync(CeramicStreamID(""));
    });
  }

  pollBackups(): ResultAsync<IDataWalletBackup[], PersistenceError> {
    // return okAsync([]);

    return this._init().andThen(({ client, config }) => {
      return ResultAsync.fromPromise(
        client.bucket("ceramic-replacement-bucket").getFiles({
          autoPaginate: true,
          versions: true,
          prefix: config.ceramicModelAliases.definitions.backupIndex,
        }),
        (e) => new PersistenceError("unable to get backup index", e),
      ).andThen((files) => {
        if (files == undefined) {
          return okAsync([]);
        }
        const backups = files[0];
        if (backups.length == 0) {
          return okAsync([]);
        }

        const recent = backups.map((record) => record.metadata.generation);
        // record.metadata.generation
        const found = [...recent].filter((x) => this._restored.has(x));
        const walletBackups = found.map((generationID) => {
          return this._backups.get(generationID) as IDataWalletBackup;
        });
        if (walletBackups[0] == undefined) {
          return okAsync([]);
        }
        return okAsync(walletBackups);
      });
    });
  }
}
