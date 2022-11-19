// import { fs } from "fs";
// import { path } from "path";
import { readFileSync, writeFileSync, promises as fsPromises } from "fs";
import * as path from "path";
import { dirname } from "path";
import { Stream } from "stream";
import { fileURLToPath } from "url";
import { promisify } from "util";

import { CeramicClient } from "@ceramicnetwork/http-client";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { TileLoader } from "@glazed/tile-loader";
import { Datastore, Key } from "@google-cloud/datastore";
import { Storage } from "@google-cloud/storage";
import { CryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/common-utils";
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

@injectable()
export class GoogleCloudStorage implements ICloudStorage {
  protected _backups = new Map<string, IDataWalletBackup>();
  protected _lastRestore = 0;

  private _unlockPromise: Promise<EVMPrivateKey>;
  private _resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null =
    null;

  private _storage?: Storage;
  private config?: IPersistenceConfig;

  private _ceramic?: CeramicClient;

  private _loader?: TileLoader;
  private _dataStore?: Datastore;
  private _dataModel?: DataModel<ModelTypes>;

  private _restored: Set<string> = new Set();
  s;

  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected _configProvider: IPersistenceConfigProvider,
    @inject(ICryptoUtilsType) protected _cryptoUtils: CryptoUtils,
  ) {
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._resolveUnlock!(derivedKey);
    return okAsync(undefined);
  }

  private _init(): ResultAsync<
    {
      client: Storage;
      store: Datastore;
    },
    PersistenceError
  > {
    return ResultUtils.combine([
      this._getGoogleCloudClient(),
      this._getGoogleCloudStore(),
    ]).andThen(([gcpClient, gcpStore]) => {
      if (this._dataStore != undefined && this._dataModel != undefined) {
        return okAsync({
          client: gcpClient,
          store: gcpStore,
        });
      }

      const taskKey = gcpStore.key("backupIndex");
      const task = new AESEncryptedString(
        EncryptedString(""),
        InitializationVector("asdf"),
      );
      const entity = {
        key: taskKey,
        data: task,
      };
      gcpStore.upsert(entity);

      return okAsync({
        client: gcpClient,
        store: gcpStore,
      });
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

  private _getGoogleCloudStore(): ResultAsync<Datastore, PersistenceError> {
    if (this._dataStore) {
      return okAsync(this._dataStore);
    }

    this._dataStore = new Datastore({
      keyFilename: "../persistence/src/credentials.json",
      projectId: "snickerdoodle-insight-stackdev",
    });

    return okAsync(this._dataStore);
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this._unlockPromise);
  }

  private _putBackupIndex(
    backups: BackupIndexEntry[],
  ): ResultAsync<void, PersistenceError> {
    const payload = {
      backups: backups,
    };

    return this._init().andThen(({ store }) => {
      return this.waitForUnlock().andThen((key) => {
        return this._cryptoUtils
          .deriveAESKeyFromEVMPrivateKey(key)
          .andThen((aesKey) => {
            return this._cryptoUtils
              .encryptString(JSON.stringify(payload), aesKey)
              .andThen((encrypted) => {
                return ResultAsync.fromPromise(
                  store.set("backupIndex", encrypted),
                  (e) => new PersistenceError("error putting backup index", e),
                ).map(() => undefined);
              });
          });
      });
    });
  }

  public putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<CeramicStreamID, PersistenceError> {
    return ResultUtils.combine([
      this._init(),
      this._configProvider.getConfig(),
    ]).andThen(([{ client }, config]) => {
      // Add data file to GCP
      config.ceramicNodeURL;

      const UploadOptions = {
        destination: "adsf",
        encryptionKey: config.ceramicNodeURL,
      };
      return ResultAsync.fromPromise(
        client
          .bucket("ceramic-replacement-bucket")
          .upload(config.ceramicNodeURL, UploadOptions),
        (e) => new PersistenceError("unable to get backup index", e),
      ).andThen(() => {
        // Successful upload, now index it:
        return this._getBackupIndex().andThen((backups) => {
          const index = [
            ...backups,
            { id: id, timestamp: backup.header.timestamp },
          ];

          return this._putBackupIndex(index).map((_) => {
            console.debug("CloudStorage", `Backup placed: ${id}`);
            this._restored.add(id);
            return CeramicStreamID(id);
          });
        });
      });
    });
  }

  private _getBackupIndex(): ResultAsync<BackupIndexEntry[], PersistenceError> {
    return this._init().andThen(({ store }) => {
      return ResultAsync.fromPromise(
        store.get(store.key("backupIndex")),
        (e) => new PersistenceError("unable to get backup index", e),
      ).andThen((encrypted) => {
        if (encrypted == null) {
          return okAsync([]);
        }
        return okAsync([]);
        //   return this.waitForUnlock().andThen((key) => {
        //     return this._cryptoUtils
        //       .deriveAESKeyFromEVMPrivateKey(key)
        //       .andThen((aesKey) => {
        //         return this._cryptoUtils
        //           .decryptAESEncryptedString(encrypted, aesKey)
        //           .andThen((decrypted) => {
        //             return okAsync(JSON.parse(decrypted) as BackupIndex);
        //           });
        //       });
        //   });
        // })
        // .map((backups) => {
        //   if (backups == null) {
        //     return [];
        //   }
        //   return Object.values(backups.backups);
      });
    });
  }

  /* Routinely upload a new file */
  pollBackups(): ResultAsync<IDataWalletBackup[], PersistenceError> {
    return okAsync([]);
  }
}
