/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ICryptoUtilsType,
  ITimeUtils,
  ITimeUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { EVMPrivateKey, PersistenceError } from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { BackupManager } from "@persistence/backup/BackupManager.js";
import { IBackupManager } from "@persistence/backup/IBackupManager.js";
import { IBackupManagerProvider } from "@persistence/backup/IBackupManagerProvider.js";
import {
  IBackupUtils,
  IBackupUtilsType,
} from "@persistence/backup/IBackupUtils.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";
import {
  ILocalStorageSchemaProvider,
  ILocalStorageSchemaProviderType,
} from "@persistence/local/IFieldSchemaProvider.js";
import {
  IVolatileStorage,
  IVolatileStorageType,
} from "@persistence/volatile/index.js";
import {
  IVolatileStorageSchemaProvider,
  IVolatileStorageSchemaProviderType,
} from "@persistence/volatile/IVolatileStorageSchemaProvider.js";

@injectable()
export class BackupManagerProvider implements IBackupManagerProvider {
  private backupManager?: ResultAsync<IBackupManager, PersistenceError>;
  private unlockPromise: Promise<EVMPrivateKey>;
  private resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null = null;

  public constructor(
    @inject(IVolatileStorageType) protected volatileStorage: IVolatileStorage,
    @inject(IStorageUtilsType) protected storageUtils: IStorageUtils,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
    @inject(IVolatileStorageSchemaProviderType)
    protected recordSchemaProvider: IVolatileStorageSchemaProvider,
    @inject(ILocalStorageSchemaProviderType)
    protected fieldSchemaProvider: ILocalStorageSchemaProvider,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
    @inject(IBackupUtilsType) protected backupUtils: IBackupUtils,
  ) {
    this.unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this.resolveUnlock = resolve;
    });
  }

  public unlock(derivedKey: EVMPrivateKey): ResultAsync<void, never> {
    this.resolveUnlock!(derivedKey);

    return okAsync(undefined);
  }

  public getBackupManager(): ResultAsync<IBackupManager, PersistenceError> {
    if (this.backupManager != undefined) {
      return this.backupManager;
    }

    this.backupManager = ResultUtils.combine([
      this.waitForUnlock(),
      this.configProvider.getConfig(),
      this.recordSchemaProvider.getVolatileStorageSchema(),
      this.fieldSchemaProvider.getLocalStorageSchema(),
    ]).map(([key, config, recordSchema, fieldSchema]) => {
      return new BackupManager(
        key,
        Array.from(recordSchema.values()),
        Array.from(fieldSchema.values()),
        this.cryptoUtils,
        this.volatileStorage,
        this.storageUtils,
        config.enableBackupEncryption,
        this.timeUtils,
        this.backupUtils,
      );
    });

    return this.backupManager;
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this.unlockPromise);
  }
}
