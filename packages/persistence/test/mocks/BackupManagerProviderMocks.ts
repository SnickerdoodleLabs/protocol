import { CryptoUtils, ICryptoUtils } from "@snickerdoodlelabs/common-utils";
import {
  AdSignatureMigrator,
  ChainTransactionMigrator,
  ClickDataMigrator,
  EarnedRewardMigrator,
  EBackupPriority,
  EFieldKey,
  EligibleAdMigrator,
  ERecordKey,
  EVMPrivateKey,
  LatestBlockMigrator,
  LinkedAccountMigrator,
  PersistenceError,
  ReceivingAccountMigrator,
  RestoredBackupMigrator,
  SiteVisitMigrator,
  TokenInfoMigrator,
  VersionedObject,
} from "@snickerdoodlelabs/objects";
import { IStorageUtils, LocalStorageUtils } from "@snickerdoodlelabs/utils";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { BackupManager, IBackupManager } from "@persistence/backup";
import { FieldIndex, ILocalStorageSchemaProvider } from "@persistence/local";
import {
  FakeDBVolatileStorage,
  IVolatileStorage,
  IVolatileStorageSchemaProvider,
  VolatileTableIndex,
} from "@persistence/volatile";

export class BackupManagerProviderMocks {
  private backupManager?: ResultAsync<IBackupManager, PersistenceError>;
  private unlockPromise: Promise<EVMPrivateKey>;
  private resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null = null;

  public volatileStorage: IVolatileStorage;
  public cryptoUtils: ICryptoUtils;
  public storageUtils: IStorageUtils;

  public constructor() {
    this.volatileStorage = new FakeDBVolatileStorage(
      new MockVolatileStorageSchemaProvider(),
    );
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

    return this.waitForUnlock().andThen((privateKey) => {
      return ResultUtils.combine([
        new MockVolatileStorageSchemaProvider().getVolatileStorageSchema(),
        new MockLocalStorageSchemaProvider().getLocalStorageSchema(),
      ]).map(([recordSchema, fieldSchema]) => {
        return new BackupManager(
          privateKey,
          recordSchema,
          fieldSchema,
          this.cryptoUtils,
          this.volatileStorage,
          this.storageUtils,
          false,
        );
      });
    });
  }
}

export class MockLocalStorageSchemaProvider
  implements ILocalStorageSchemaProvider
{
  getLocalStorageSchema(): ResultAsync<FieldIndex[], never> {
    const dataWalletBackupIntervalMS = 1000;
    return okAsync([
      new FieldIndex(
        EFieldKey.ACCEPTED_INVITATIONS,
        EBackupPriority.HIGH,
        dataWalletBackupIntervalMS,
      ),
      new FieldIndex(
        EFieldKey.BIRTHDAY,
        EBackupPriority.HIGH,
        0, // instant push
      ),
      new FieldIndex(
        EFieldKey.DEFAULT_RECEIVING_ADDRESS,
        EBackupPriority.NORMAL,
        dataWalletBackupIntervalMS,
      ),
      new FieldIndex(
        EFieldKey.DOMAIN_PERMISSIONS,
        EBackupPriority.HIGH,
        dataWalletBackupIntervalMS,
      ),
      new FieldIndex(
        EFieldKey.EMAIL,
        EBackupPriority.NORMAL,
        dataWalletBackupIntervalMS,
      ),
      new FieldIndex(EFieldKey.FIRST_NAME, EBackupPriority.HIGH, 0),
      new FieldIndex(EFieldKey.GENDER, EBackupPriority.HIGH, 0),
      new FieldIndex(EFieldKey.LAST_NAME, EBackupPriority.HIGH, 0),
      new FieldIndex(EFieldKey.LOCATION, EBackupPriority.HIGH, 0),
      new FieldIndex(
        EFieldKey.REJECTED_COHORTS,
        EBackupPriority.NORMAL,
        dataWalletBackupIntervalMS,
      ),
    ]);
  }
}

export class MockVolatileStorageSchemaProvider
  implements IVolatileStorageSchemaProvider
{
  getVolatileStorageSchema(): ResultAsync<
    VolatileTableIndex<VersionedObject>[],
    never
  > {
    const dataWalletBackupIntervalMS = 1000;
    const backupChunkSizeTarget = 10;

    return okAsync([
      new VolatileTableIndex(
        ERecordKey.ACCOUNT,
        "sourceAccountAddress",
        false,
        new LinkedAccountMigrator(),
        EBackupPriority.HIGH,
        dataWalletBackupIntervalMS,
        backupChunkSizeTarget,
        [["sourceChain", false]],
      ),
      new VolatileTableIndex(
        ERecordKey.TRANSACTIONS,
        "hash",
        false,
        new ChainTransactionMigrator(),
        EBackupPriority.NORMAL,
        dataWalletBackupIntervalMS,
        backupChunkSizeTarget,
        [
          ["timestamp", false],
          ["chainId", false],
          ["value", false],
          ["to", false],
          ["from", false],
        ],
      ),
      new VolatileTableIndex(
        ERecordKey.SITE_VISITS,
        VolatileTableIndex.DEFAULT_KEY,
        true,
        new SiteVisitMigrator(),
        EBackupPriority.NORMAL,
        dataWalletBackupIntervalMS,
        backupChunkSizeTarget,
        [
          ["url", false],
          ["startTime", false],
          ["endTime", false],
        ],
      ),
      new VolatileTableIndex(
        ERecordKey.CLICKS,
        VolatileTableIndex.DEFAULT_KEY,
        true,
        new ClickDataMigrator(),
        EBackupPriority.NORMAL,
        dataWalletBackupIntervalMS,
        backupChunkSizeTarget,
        [
          ["url", false],
          ["timestamp", false],
          ["element", false],
        ],
      ),
      new VolatileTableIndex(
        ERecordKey.LATEST_BLOCK,
        "contract",
        false,
        new LatestBlockMigrator(),
        EBackupPriority.NORMAL,
        dataWalletBackupIntervalMS,
        backupChunkSizeTarget,
      ),
      new VolatileTableIndex(
        ERecordKey.EARNED_REWARDS,
        "queryCID",
        false,
        new EarnedRewardMigrator(),
        EBackupPriority.NORMAL,
        dataWalletBackupIntervalMS,
        backupChunkSizeTarget,
        [["type", false]],
      ),
      new VolatileTableIndex(
        ERecordKey.ELIGIBLE_ADS,
        ["queryCID", "key"],
        false,
        new EligibleAdMigrator(),
        EBackupPriority.NORMAL,
        dataWalletBackupIntervalMS,
        backupChunkSizeTarget,
        [["type", false]],
      ),
      new VolatileTableIndex(
        ERecordKey.AD_SIGNATURES,
        ["queryCID", "adKey"],
        false,
        new AdSignatureMigrator(),
        EBackupPriority.NORMAL,
        dataWalletBackupIntervalMS,
        backupChunkSizeTarget,
        [["type", false]],
      ),
      new VolatileTableIndex(
        ERecordKey.COIN_INFO,
        ["chain", "address"],
        false,
        new TokenInfoMigrator(),
        EBackupPriority.DISABLED,
        dataWalletBackupIntervalMS,
        backupChunkSizeTarget,
        undefined,
      ),
      new VolatileTableIndex(
        ERecordKey.RESTORED_BACKUPS,
        VolatileTableIndex.DEFAULT_KEY,
        false,
        new RestoredBackupMigrator(),
        EBackupPriority.DISABLED,
        dataWalletBackupIntervalMS,
        backupChunkSizeTarget,
        undefined,
      ),
      new VolatileTableIndex(
        ERecordKey.RECEIVING_ADDRESSES,
        "contractAddress",
        false,
        new ReceivingAccountMigrator(),
        EBackupPriority.NORMAL,
        dataWalletBackupIntervalMS,
        backupChunkSizeTarget,
      ),
    ]);
  }
}
