/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import { EVMPrivateKey, PersistenceError } from "@snickerdoodlelabs/objects";
import { IStorageUtils, IStorageUtilsType } from "@snickerdoodlelabs/utils";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { BackupManager } from "@persistence/backup/BackupManager.js";
import { ChunkManager } from "@persistence/backup/ChunkManager.js";
import { IBackupManager } from "@persistence/backup/IBackupManager.js";
import { IBackupManagerProvider } from "@persistence/backup/IBackupManagerProvider.js";
import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";
import {
  IVolatileStorage,
  IVolatileStorageType,
} from "@persistence/volatile/index.js";
import { volatileStorageSchema } from "@persistence/volatile/VolatileStorageSchema.js";

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

    const schema = volatileStorageSchema.filter((schema) => {
      return !schema.disableBackup;
    });

    this.backupManager = ResultUtils.combine([
      this.waitForUnlock(),
      this.configProvider.getConfig(),
    ]).map(([key, config]) => {
      return new BackupManager(
        key,
        schema,
        this.volatileStorage,
        this.cryptoUtils,
        this.storageUtils,
        new ChunkManager(),
        config.backupChunkSizeTarget,
      );
    });

    return this.backupManager;
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this.unlockPromise);
  }
}
