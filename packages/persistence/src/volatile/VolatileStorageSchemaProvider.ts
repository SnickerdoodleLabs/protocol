import {
  AdSignatureMigrator,
  ChainTransactionMigrator,
  ClickDataMigrator,
  EarnedRewardMigrator,
  EBackupPriority,
  EligibleAdMigrator,
  LatestBlockMigrator,
  LinkedAccountMigrator,
  ReceivingAccountMigrator,
  RestoredBackupMigrator,
  SiteVisitMigrator,
  TokenInfoMigrator,
  ERecordKey,
  VersionedObject,
} from "@snickerdoodlelabs/objects";
import { inject } from "inversify";
import { ResultAsync } from "neverthrow";

import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";
import { IVolatileStorageSchemaProvider } from "@persistence/volatile/IVolatileStorageSchemaProvider.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

export class VolatileStorageSchemaProvider
  implements IVolatileStorageSchemaProvider
{
  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
  ) {}

  public getVolatileStorageSchema(): ResultAsync<
    VolatileTableIndex<VersionedObject>[],
    never
  > {
    return this.configProvider.getConfig().map((config) => {
      return [
        new VolatileTableIndex(
          ERecordKey.ACCOUNT,
          "sourceAccountAddress",
          false,
          new LinkedAccountMigrator(),
          EBackupPriority.HIGH,
          config.dataWalletBackupIntervalMS,
          config.backupChunkSizeTarget,
          [["sourceChain", false]],
        ),
        new VolatileTableIndex(
          ERecordKey.TRANSACTIONS,
          "hash",
          false,
          new ChainTransactionMigrator(),
          EBackupPriority.NORMAL,
          config.dataWalletBackupIntervalMS,
          config.backupChunkSizeTarget,
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
          config.dataWalletBackupIntervalMS,
          config.backupChunkSizeTarget,
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
          config.dataWalletBackupIntervalMS,
          config.backupChunkSizeTarget,
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
          config.dataWalletBackupIntervalMS,
          config.backupChunkSizeTarget,
        ),
        new VolatileTableIndex(
          ERecordKey.EARNED_REWARDS,
          "queryCID",
          false,
          new EarnedRewardMigrator(),
          EBackupPriority.NORMAL,
          config.dataWalletBackupIntervalMS,
          config.backupChunkSizeTarget,
          [["type", false]],
        ),
        new VolatileTableIndex(
          ERecordKey.ELIGIBLE_ADS,
          ["queryCID", "key"],
          false,
          new EligibleAdMigrator(),
          EBackupPriority.NORMAL,
          config.dataWalletBackupIntervalMS,
          config.backupChunkSizeTarget,
          [["type", false]],
        ),
        new VolatileTableIndex(
          ERecordKey.AD_SIGNATURES,
          ["queryCID", "adKey"],
          false,
          new AdSignatureMigrator(),
          EBackupPriority.NORMAL,
          config.dataWalletBackupIntervalMS,
          config.backupChunkSizeTarget,
          [["type", false]],
        ),
        new VolatileTableIndex(
          ERecordKey.COIN_INFO,
          ["chain", "address"],
          false,
          new TokenInfoMigrator(),
          EBackupPriority.DISABLED,
          config.dataWalletBackupIntervalMS,
          config.backupChunkSizeTarget,
          undefined,
        ),
        new VolatileTableIndex(
          ERecordKey.RESTORED_BACKUPS,
          VolatileTableIndex.DEFAULT_KEY,
          false,
          new RestoredBackupMigrator(),
          EBackupPriority.DISABLED,
          config.dataWalletBackupIntervalMS,
          config.backupChunkSizeTarget,
          undefined,
        ),
        new VolatileTableIndex(
          ERecordKey.RECEIVING_ADDRESSES,
          "contractAddress",
          false,
          new ReceivingAccountMigrator(),
          EBackupPriority.NORMAL,
          config.dataWalletBackupIntervalMS,
          config.backupChunkSizeTarget,
        ),
      ];
    });
  }
}
