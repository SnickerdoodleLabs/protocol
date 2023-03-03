import { CeramicClient } from "@ceramicnetwork/http-client";
import { StreamID } from "@ceramicnetwork/streamid";
import { DataModel } from "@glazed/datamodel";
import { DIDDataStore } from "@glazed/did-datastore";
import { TileLoader } from "@glazed/tile-loader";
import { CryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  BackupIndex,
  BackupIndexEntry,
  CeramicStreamID,
  DataWalletBackupID,
  EVMPrivateKey,
  IDataWalletBackup,
  ModelTypes,
  PersistenceError,
  AjaxError,
  EBackupPriority,
} from "@snickerdoodlelabs/objects";

import { ICloudStorage } from "@persistence/cloud/ICloudStorage.js";

import { DID } from "dids";

import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";

import { inject, injectable } from "inversify";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class CeramicCloudStorage implements ICloudStorage {
  private _ceramic?: CeramicClient;

  private _loader?: TileLoader;
  private _dataStore?: DIDDataStore<ModelTypes>;
  private _dataModel?: DataModel<ModelTypes>;

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

  public pollByPriority(
    restored: Set<DataWalletBackupID>,
    priority: EBackupPriority,
  ): ResultAsync<IDataWalletBackup[], PersistenceError> {
    return okAsync([]);
  }

  public fetchBackups(
    backupHeader: string,
  ): ResultAsync<IDataWalletBackup[], PersistenceError> {
    return okAsync([]);
  }

  public clear(): ResultAsync<void, PersistenceError> {
    return this._init()
      .andThen(({ store, client }) => {
        return this._getBackupIndex().andThen((entries) => {
          return ResultUtils.combine(
            entries.map((entry) => {
              return ResultAsync.fromPromise(
                client.pin.rm(StreamID.fromString(entry.id)),
                (e) => new PersistenceError("Error pinning stream", e),
              );
            }),
          ).andThen(() => this._putBackupIndex([]));
        });
      })
      .mapErr((e) => new PersistenceError("error clearing ceramic", e));
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this._unlockPromise);
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._resolveUnlock!(derivedKey);
    return okAsync(undefined);
  }

  private _getCeramic(): ResultAsync<CeramicClient, PersistenceError> {
    if (this._ceramic) {
      return okAsync(this._ceramic);
    }

    return this._configProvider.getConfig().andThen((config) => {
      const ceramic = new CeramicClient(config.ceramicNodeURL);
      return this.waitForUnlock().andThen((privateKey) => {
        return this._cryptoUtils
          .deriveCeramicSeedFromEVMPrivateKey(privateKey)
          .andThen((seed) => {
            return this._authenticateDID(seed).andThen((did) => {
              ceramic.did = did;
              this._ceramic = ceramic;
              return okAsync(this._ceramic);
            });
          });
      });
    });
  }

  private _authenticateDID(
    seed: Uint8Array,
  ): ResultAsync<DID, PersistenceError> {
    const provider = new Ed25519Provider(seed);
    const did = new DID({ provider });
    // const did = new DID({ provider, resolver: getResolver() });
    return ResultAsync.fromPromise(
      did.authenticate(),
      (e) => new PersistenceError("error authenticated ceramic DID", e),
    ).andThen((_) => okAsync(did));
  }

  private _init(): ResultAsync<
    {
      client: CeramicClient;
      store: DIDDataStore<ModelTypes>;
      model: DataModel<ModelTypes>;
      loader: TileLoader;
    },
    PersistenceError
  > {
    return ResultUtils.combine([
      this._getCeramic(),
      this._configProvider.getConfig(),
    ]).andThen(([ceramic, config]) => {
      if (
        this._dataStore != undefined &&
        this._dataModel != undefined &&
        this._loader != undefined
      ) {
        return okAsync({
          store: this._dataStore,
          model: this._dataModel,
          loader: this._loader,
          client: ceramic,
        });
      }

      this._loader = new TileLoader({ ceramic });
      this._dataModel = new DataModel({
        ceramic,
        aliases: config.ceramicModelAliases,
      });
      this._dataStore = new DIDDataStore({
        ceramic,
        loader: this._loader,
        model: this._dataModel,
      });

      return okAsync({
        store: this._dataStore,
        model: this._dataModel,
        loader: this._loader,
        client: ceramic,
      });
    });
  }

  public putBackup(
    backup: IDataWalletBackup,
  ): ResultAsync<DataWalletBackupID, PersistenceError> {
    return this._init()
      .andThen(({ store, model, client }) => {
        return ResultAsync.fromPromise(
          model.createTile("DataWalletBackup", backup),
          (e) => new PersistenceError("error creating backup tile", e),
        ).andThen((doc) => {
          return ResultAsync.fromPromise(
            client.pin.add(doc.id, true),
            (e) => new PersistenceError("unable to pin backup tile", e),
          ).andThen(() => {
            // only index if pin was successful
            const id = doc.id.toUrl();
            return this._getBackupIndex().andThen((backups) => {
              const index = [
                ...backups,
                { id: id, timestamp: backup.header.timestamp },
              ];

              return this._putBackupIndex(index).map((_) => {
                console.debug("CloudStorage", `Backup placed: ${id}`);
                return DataWalletBackupID(id);
              });
            });
          });
        });
      })
      .mapErr((e) => new PersistenceError("error putting backup", e));
  }

  private _putBackupIndex(
    backups: BackupIndexEntry[],
  ): ResultAsync<void, PersistenceError | AjaxError> {
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

  public pollBackups(
    restored: Set<DataWalletBackupID>,
  ): ResultAsync<IDataWalletBackup[], PersistenceError> {
    return this._getBackupIndex().andThen((backups) => {
      const recent = backups.map((record) => DataWalletBackupID(record.id));
      const found = [...recent].filter((x) => !restored.has(x));
      // console.debug("CloudStorage", `${found.length} new backups found`);
      return ResultUtils.combine(
        found.map((backupID) => this._getBackup(backupID)),
      );
    });
  }

  private _getBackup(
    id: string,
  ): ResultAsync<IDataWalletBackup, PersistenceError> {
    return this._init().andThen(({ loader }) => {
      return ResultAsync.fromPromise(
        loader.load<IDataWalletBackup>(id),
        (e) => new PersistenceError("error loading backup", e),
      ).map((tileDoc) => {
        const retVal = tileDoc.content;
        retVal.header.hash = tileDoc.id.toUrl();
        return retVal;
      });
    });
  }

  private _getBackupIndex(): ResultAsync<BackupIndexEntry[], PersistenceError> {
    return this._init().andThen(({ store }) => {
      return ResultAsync.fromPromise(
        store.get("backupIndex"),
        (e) => new PersistenceError("unable to get backup index", e),
      )
        .andThen((encrypted) => {
          if (encrypted == null) {
            return okAsync(null);
          }

          return this.waitForUnlock().andThen((key) => {
            return this._cryptoUtils
              .deriveAESKeyFromEVMPrivateKey(key)
              .andThen((aesKey) => {
                return this._cryptoUtils
                  .decryptAESEncryptedString(encrypted, aesKey)
                  .andThen((decrypted) => {
                    return okAsync(JSON.parse(decrypted) as BackupIndex);
                  });
              });
          });
        })
        .map((backups) => {
          if (backups == null) {
            return [];
          }
          return Object.values(backups.backups);
        });
    });
  }
}
