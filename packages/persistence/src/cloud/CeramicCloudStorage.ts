import { CeramicClient } from "@ceramicnetwork/http-client";
import { StreamID } from "@ceramicnetwork/streamid";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { TileLoader } from "@glazed/tile-loader";
import { CryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import {
  AuthenticatedStorageSettings,
  BackupFileName,
  BackupIndex,
  BackupIndexEntry,
  CeramicStreamID,
  DataWalletBackup,
  DataWalletBackupID,
  ECloudStorageType,
  EVMPrivateKey,
  IDataWalletBackup,
  ModelTypes,
  PersistenceError,
  StorageKey,
} from "@snickerdoodlelabs/objects";
import { DID } from "dids";
import { inject, injectable } from "inversify";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";

@injectable()
export class CeramicCloudStorage implements ICloudStorage {
  private _ceramic?: CeramicClient;

  private _loader?: TileLoader;
  private _dataStore?: DIDDataStore<ModelTypes>;
  private _dataModel?: DataModel<ModelTypes>;

  private _restored: Set<string> = new Set();

  private _unlockPromise: Promise<EVMPrivateKey>;
  private _resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null =
    null;

  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected _configProvider: IPersistenceConfigProvider,
    @inject(ICryptoUtilsType) protected _cryptoUtils: CryptoUtils,
  ) {
    this._unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this._resolveUnlock = resolve;
    });
  }
  name(): ECloudStorageType {
    throw new Error("Method not implemented.");
  }
  putBackup(
    backup: DataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  pollBackups(
    restored: Set<DataWalletBackupID>,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
  saveCredentials(
    credentials: AuthenticatedStorageSettings,
  ): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  clearCredentials(): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  pollByStorageType(
    restored: Set<DataWalletBackupID>,
    recordKey: StorageKey,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
  getLatestBackup(
    storageKey: StorageKey,
  ): ResultAsync<DataWalletBackup | null, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  clear(): ResultAsync<void, PersistenceError> {
    throw new Error("Method not implemented.");
  }
  listFileNames(): ResultAsync<BackupFileName[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
  fetchBackup(
    backupHeader: string,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    throw new Error("Method not implemented.");
  }
}
