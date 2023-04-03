import {
  CryptoUtils,
  ICryptoUtils,
  ITimeUtils,
  TimeUtils,
} from "@snickerdoodlelabs/common-utils";
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
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  BackupManager,
  BackupUtils,
  IBackupManager,
  IBackupUtils,
} from "@persistence/backup/index.js";
import { FieldIndex, IFieldSchemaProvider } from "@persistence/local/index.js";
import {
  FakeDBVolatileStorage,
  IVolatileStorage,
  IVolatileStorageSchemaProvider,
  VolatileTableIndex,
} from "@persistence/volatile/index.js";

export class BackupManagerProviderMocks {
  private backupManager?: ResultAsync<IBackupManager, PersistenceError>;
  private unlockPromise: Promise<EVMPrivateKey>;
  private resolveUnlock: ((dataWalletKey: EVMPrivateKey) => void) | null = null;

  public volatileStorage: IVolatileStorage;
  public cryptoUtils: ICryptoUtils;
  public storageUtils: IStorageUtils;
  public timeUtils: ITimeUtils;
  public backupUtils: IBackupUtils;

  public constructor() {
    this.volatileStorage = new FakeDBVolatileStorage(
      new MockVolatileStorageSchemaProvider(),
    );
    this.cryptoUtils = new CryptoUtils();
    this.storageUtils = new LocalStorageUtils();
    this.timeUtils = new TimeUtils();
    this.backupUtils = new BackupUtils(this.cryptoUtils);

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
          Array.from(recordSchema.values()),
          Array.from(fieldSchema.values()),
          this.cryptoUtils,
          this.volatileStorage,
          this.storageUtils,
          false,
          this.timeUtils,
          this.backupUtils,
          new MockVolatileStorageSchemaProvider(),
        );
      });
    });
  }
}

export class MockLocalStorageSchemaProvider implements IFieldSchemaProvider {
  getLocalStorageSchema(): ResultAsync<Map<EFieldKey, FieldIndex>, never> {
    const dataWalletBackupIntervalMS = 1000;
    return okAsync(
      new Map([
        [
          EFieldKey.ACCEPTED_INVITATIONS,
          new FieldIndex(
            EFieldKey.ACCEPTED_INVITATIONS,
            EBackupPriority.HIGH,
            dataWalletBackupIntervalMS,
          ),
        ],
        [
          EFieldKey.BIRTHDAY,
          new FieldIndex(
            EFieldKey.BIRTHDAY,
            EBackupPriority.HIGH,
            0, // instant push
          ),
        ],
        [
          EFieldKey.DEFAULT_RECEIVING_ADDRESS,
          new FieldIndex(
            EFieldKey.DEFAULT_RECEIVING_ADDRESS,
            EBackupPriority.NORMAL,
            dataWalletBackupIntervalMS,
          ),
        ],
        [
          EFieldKey.DOMAIN_PERMISSIONS,
          new FieldIndex(
            EFieldKey.DOMAIN_PERMISSIONS,
            EBackupPriority.HIGH,
            dataWalletBackupIntervalMS,
          ),
        ],
        [
          EFieldKey.EMAIL,
          new FieldIndex(
            EFieldKey.EMAIL,
            EBackupPriority.NORMAL,
            dataWalletBackupIntervalMS,
          ),
        ],
        [
          EFieldKey.FIRST_NAME,
          new FieldIndex(EFieldKey.FIRST_NAME, EBackupPriority.HIGH, 0),
        ],
        [
          EFieldKey.GENDER,
          new FieldIndex(EFieldKey.GENDER, EBackupPriority.HIGH, 0),
        ],
        [
          EFieldKey.LAST_NAME,
          new FieldIndex(EFieldKey.LAST_NAME, EBackupPriority.HIGH, 0),
        ],
        [
          EFieldKey.LOCATION,
          new FieldIndex(EFieldKey.LOCATION, EBackupPriority.HIGH, 0),
        ],
        [
          EFieldKey.REJECTED_COHORTS,
          new FieldIndex(
            EFieldKey.REJECTED_COHORTS,
            EBackupPriority.NORMAL,
            dataWalletBackupIntervalMS,
          ),
        ],
      ]),
    );
  }
}

export class MockVolatileStorageSchemaProvider
  implements IVolatileStorageSchemaProvider
{
  getCurrentVersionForTable(
    tableName: ERecordKey,
  ): ResultAsync<number, PersistenceError> {
    return this.getVolatileStorageSchema().andThen((schema) => {
      if (!schema.has(tableName)) {
        return errAsync(
          new PersistenceError("no schema present for table", tableName),
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return okAsync(schema.get(tableName)!.migrator.getCurrentVersion());
    });
  }

  getVolatileStorageSchema(): ResultAsync<
    Map<ERecordKey, VolatileTableIndex<VersionedObject>>,
    never
  > {
    const dataWalletBackupIntervalMS = 1000;
    const backupChunkSizeTarget = 10;

    return okAsync(
      new Map<ERecordKey, VolatileTableIndex<VersionedObject>>([
        [
          ERecordKey.ACCOUNT,
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
        ],
        [
          ERecordKey.TRANSACTIONS,
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
        ],
        [
          ERecordKey.SITE_VISITS,
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
        ],
        [
          ERecordKey.CLICKS,
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
        ],
        [
          ERecordKey.LATEST_BLOCK,
          new VolatileTableIndex(
            ERecordKey.LATEST_BLOCK,
            "contract",
            false,
            new LatestBlockMigrator(),
            EBackupPriority.NORMAL,
            dataWalletBackupIntervalMS,
            backupChunkSizeTarget,
          ),
        ],
        [
          ERecordKey.EARNED_REWARDS,
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
        ],
        [
          ERecordKey.ELIGIBLE_ADS,
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
        ],
        [
          ERecordKey.AD_SIGNATURES,
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
        ],
        [
          ERecordKey.COIN_INFO,
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
        ],
        [
          ERecordKey.RESTORED_BACKUPS,
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
        ],
        [
          ERecordKey.RECEIVING_ADDRESSES,
          new VolatileTableIndex(
            ERecordKey.RECEIVING_ADDRESSES,
            "contractAddress",
            false,
            new ReceivingAccountMigrator(),
            EBackupPriority.NORMAL,
            dataWalletBackupIntervalMS,
            backupChunkSizeTarget,
          ),
        ],
      ]),
    );
  }
}
