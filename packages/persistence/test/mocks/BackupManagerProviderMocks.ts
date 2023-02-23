import { CryptoUtils, ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import { EVMPrivateKey, PersistenceError } from "@snickerdoodlelabs/objects";
import { IStorageUtils, LocalStorageUtils } from "@snickerdoodlelabs/utils";
import { okAsync, ResultAsync } from "neverthrow";

import { BackupManager, IBackupManager } from "@persistence/backup";
import { FakeDBVolatileStorage, IVolatileStorage } from "@persistence/volatile";
import { volatileStorageSchema } from "@persistence/volatile/VolatileStorageSchema";

export class BackupManagerProviderMocks {
  private backupManager?: ResultAsync<IBackupManager, PersistenceError>;
  private unlockPromise: Promise<EVMPrivateKey>;
  private resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null = null;

  public volatileStorage: IVolatileStorage;
  public cryptoUtils: ICryptoUtils;
  public storageUtils: IStorageUtils;

  public constructor() {
    this.volatileStorage = new FakeDBVolatileStorage();
    this.cryptoUtils = new CryptoUtils();
    this.storageUtils = new LocalStorageUtils();

    this.unlockPromise = new Promise<EVMPrivateKey>((resolve) => {
      this.resolveUnlock = resolve;
    });
  }

  public unlock(derivedKey: EVMPrivateKey): ResultAsync<void, never> {
    this.resolveUnlock!(derivedKey);

    return okAsync(undefined);
  }

  protected waitForUnlock(): ResultAsync<EVMPrivateKey, never> {
    return ResultAsync.fromSafePromise(this.unlockPromise);
  }

  public getBackupManager(): ResultAsync<IBackupManager, PersistenceError> {
    if (this.backupManager != undefined) {
      return this.backupManager;
    }

    const schema = volatileStorageSchema.filter((schema) => {
      return !schema.disableBackup;
    });

    return this.waitForUnlock().map(
      (privateKey) =>
        new BackupManager(
          privateKey,
          schema,
          this.volatileStorage,
          this.cryptoUtils,
          this.storageUtils,
          100000,
        ),
    );
  }
}
