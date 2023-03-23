import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import {
  PersistenceError,
  EVMPrivateKey,
  DataWalletBackup,
  DataWalletBackupID,
  EBackupPriority,
  VolatileStorageKey,
  VersionedObject,
  VolatileStorageMetadata,
  JSONString,
  BackupFileName,
  EFieldKey,
  ERecordKey,
} from "@snickerdoodlelabs/objects";
import {
  IBackupManagerProvider,
  IBackupManagerProviderType,
  ICloudStorage,
  ICloudStorageType,
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
  IVolatileStorage,
  IVolatileStorageType,
  IVolatileCursor,
  IVolatileStorageSchemaProviderType,
  IVolatileStorageSchemaProvider,
  ILocalStorageSchemaProvider,
  ILocalStorageSchemaProviderType,
} from "@snickerdoodlelabs/persistence";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IDataWalletPersistence } from "@core/interfaces/data/index.js";
import {
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class DataWalletPersistence implements IDataWalletPersistence {
  private unlockPromise: Promise<EVMPrivateKey>;
  private resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null = null;

  private initRestorePromise: Promise<void>;
  private resolveInitRestore: (() => void) | null = null;

  private fullRestorePromise: Promise<void>;
  private resolveFullRestore: (() => void) | null = null;

  public constructor(
    @inject(IBackupManagerProviderType)
    protected backupManagerProvider: IBackupManagerProvider,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(IVolatileStorageType)
    protected volatileStorage: IVolatileStorage,
    @inject(ICloudStorageType) protected cloudStorage: ICloudStorage,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IVolatileStorageSchemaProviderType)
    protected volatileSchemaProvider: IVolatileStorageSchemaProvider,
    @inject(ILocalStorageSchemaProviderType)
    protected fieldSchemaProvider: ILocalStorageSchemaProvider,
  ) {
    this.unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this.resolveUnlock = resolve;
    });
    this.initRestorePromise = new Promise<void>((resolve) => {
      this.resolveInitRestore = resolve;
    });
    this.fullRestorePromise = new Promise<void>((resolve) => {
      this.resolveFullRestore = resolve;
    });
  }

  public getField<T>(key: EFieldKey): ResultAsync<T | null, PersistenceError> {
    return this.fieldSchemaProvider
      .getLocalStorageSchema()
      .andThen((schema) => {
        const priority = schema.get(key)?.priority;
        return this.waitForPriority(priority);
      })
      .andThen(() => {
        return this.storageUtils.read<JSONString>(key).map((raw) => {
          if (raw == null) {
            return null;
          }
          return JSON.parse(raw) as T;
        });
      });
  }

  public getObject<T extends VersionedObject>(
    name: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<T | null, PersistenceError> {
    return this.volatileSchemaProvider
      .getVolatileStorageSchema()
      .andThen((schema) => {
        const priority = schema.get(name)?.priority;
        return this.waitForPriority(priority);
      })
      .andThen(() => {
        return this.volatileStorage
          .getObject<T>(name, key)
          .map((x) => (x == null ? null : x.data));
      });
  }

  public getCursor<T extends VersionedObject>(
    name: ERecordKey,
    indexName?: string | undefined,
    query?: IDBValidKey | IDBKeyRange | undefined,
    direction?: IDBCursorDirection | undefined,
    mode?: IDBTransactionMode | undefined,
  ): ResultAsync<IVolatileCursor<T>, PersistenceError> {
    return this.volatileSchemaProvider
      .getVolatileStorageSchema()
      .andThen((schema) => {
        const priority = schema.get(name)?.priority;
        return this.waitForPriority(priority);
      })
      .andThen(() => {
        return this.volatileStorage.getCursor<T>(
          name,
          indexName,
          query,
          direction,
          mode,
        );
      });
  }

  public getAll<T extends VersionedObject>(
    name: ERecordKey,
    indexName?: string | undefined,
  ): ResultAsync<T[], PersistenceError> {
    return this.volatileSchemaProvider
      .getVolatileStorageSchema()
      .andThen((schema) => {
        const priority = schema.get(name)?.priority;
        return this.waitForPriority(priority);
      })
      .andThen(() => {
        return this.volatileStorage.getAll<T>(name, indexName).map((values) => {
          return values.map((x) => x.data);
        });
      });
  }

  public getAllKeys<T>(
    name: ERecordKey,
    indexName?: string | undefined,
    query?: IDBValidKey | IDBKeyRange | undefined,
    count?: number | undefined,
    priority?: EBackupPriority,
  ): ResultAsync<T[], PersistenceError> {
    return this.volatileSchemaProvider
      .getVolatileStorageSchema()
      .andThen((schema) => {
        const priority = schema.get(name)?.priority;
        return this.waitForPriority(priority);
      })
      .andThen(() => {
        return this.volatileStorage.getAllKeys<T>(
          name,
          indexName,
          query,
          count,
        );
      });
  }

  public updateRecord<T extends VersionedObject>(
    tableName: ERecordKey,
    value: VolatileStorageMetadata<T>,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.backupManagerProvider.getBackupManager(),
      this.waitForUnlock(),
    ]).andThen(([backupManager]) => {
      return backupManager.addRecord(tableName, value);
    });
  }

  public deleteRecord(
    tableName: ERecordKey,
    key: VolatileStorageKey,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this.backupManagerProvider.getBackupManager(),
    ]).andThen(([_key, backupManager]) => {
      return backupManager.deleteRecord(tableName, key);
    });
  }

  public updateField(
    key: EFieldKey,
    value: object,
  ): ResultAsync<void, PersistenceError> {
    return ResultUtils.combine([
      this.waitForUnlock(),
      this.backupManagerProvider.getBackupManager(),
    ]).andThen(([_key, backupManager]) => {
      return backupManager.updateField(key, value);
    });
  }

  public waitForInitialRestore(): ResultAsync<EVMPrivateKey, never> {
    return ResultUtils.combine<EVMPrivateKey, void, never, never>([
      ResultAsync.fromSafePromise(this.unlockPromise),
      ResultAsync.fromSafePromise(this.initRestorePromise),
    ]).map(([key]) => key);
  }

  public waitForFullRestore(): ResultAsync<EVMPrivateKey, never> {
    return ResultUtils.combine<EVMPrivateKey, void, never, never>([
      this.waitForInitialRestore(),
      ResultAsync.fromSafePromise(this.fullRestorePromise),
    ]).map(([key]) => key);
  }

  public waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this.unlockPromise);
  }

  private waitForPriority(
    priority = EBackupPriority.NORMAL,
  ): ResultAsync<void, never> {
    switch (priority) {
      case EBackupPriority.HIGH:
        return this.waitForInitialRestore().map(() => undefined);
      case EBackupPriority.NORMAL:
      default:
        return this.waitForFullRestore().map(() => undefined);
    }
  }

  public unlock(
    derivedKey: EVMPrivateKey,
  ): ResultAsync<void, PersistenceError> {
    // Store the result
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.resolveUnlock!(derivedKey);
    return ResultUtils.combine([
      this.cloudStorage.unlock(derivedKey),
      this.backupManagerProvider.unlock(derivedKey),
    ])
      .map(() => {
        this.configProvider.getConfig().map((config) => {
          // set the backup restore to timeout as to not block unlocks
          const timeout = setTimeout(() => {
            this.logUtils.error("Backup restore timed out");
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.resolveInitRestore!();
          }, config.restoreTimeoutMS);

          this._pollHighPriorityBackups().map(() => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.resolveInitRestore!();
            clearTimeout(timeout);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.pollBackups().map(() => this.resolveFullRestore!());
          });
        });
      })
      .mapErr((e) => new PersistenceError("error unlocking data wallet", e));
  }

  public restoreBackup(
    backup: DataWalletBackup,
  ): ResultAsync<void, PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager.restore(backup).orElse((err) => {
          this.logUtils.warning(
            "Error restoring backups! Data wallet will likely have incomplete data!",
            err,
          );
          return okAsync(undefined);
        });
      });
  }

  public pollBackups(): ResultAsync<void, PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager.getRestored();
      })
      .andThen((restored) => {
        return this.cloudStorage.pollBackups(restored);
      })
      .andThen((backups) => {
        return ResultUtils.combine(
          backups.map((backup) => {
            return this.restoreBackup(backup);
          }),
        );
      })
      .map(() => undefined);
  }

  public unpackBackupChunk(
    backup: DataWalletBackup,
  ): ResultAsync<string, PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager.unpackBackupChunk(backup);
      });
  }

  public fetchBackup(
    backupHeader: string,
  ): ResultAsync<DataWalletBackup[], PersistenceError> {
    return this.cloudStorage.fetchBackup(backupHeader);
  }

  public listFileNames(): ResultAsync<BackupFileName[], PersistenceError> {
    return this.cloudStorage.listFileNames();
  }

  public postBackups(): ResultAsync<DataWalletBackupID[], PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager.getRendered().andThen((chunks) => {
          return ResultUtils.combine(
            chunks.map((chunk) => {
              return ResultUtils.backoffAndRetry<
                DataWalletBackupID,
                PersistenceError
              >(
                () => this.cloudStorage.putBackup(chunk),
                [PersistenceError],
              ).andThen((id) => {
                return backupManager.popRendered(id);
              });
            }),
          );
        });
      });
  }

  public clearCloudStore(): ResultAsync<void, PersistenceError> {
    return this.cloudStorage.clear().mapErr((error) => {
      return new PersistenceError((error as Error).message, error);
    });
  }

  private _pollHighPriorityBackups(): ResultAsync<void, PersistenceError> {
    return this.backupManagerProvider
      .getBackupManager()
      .andThen((backupManager) => {
        return backupManager.getRestored();
      })
      .andThen((restored) => {
        return this.cloudStorage
          .pollByPriority(restored, EBackupPriority.HIGH)
          .andThen((backups) => {
            return ResultUtils.combine(
              backups.map((backup) => {
                return this.restoreBackup(backup);
              }),
            );
          });
      })
      .map(() => undefined);
  }
}
