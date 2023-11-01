import {
  AdSignatureMigrator,
  ChainTransactionMigrator,
  ClickDataMigrator,
  EarnedRewardMigrator,
  EBackupPriority,
  EligibleAdMigrator,
  LinkedAccountMigrator,
  ReceivingAccountMigrator,
  RestoredBackupMigrator,
  SiteVisitMigrator,
  TokenInfoMigrator,
  ERecordKey,
  VersionedObject,
  DomainCredentialMigrator,
  QueryStatusMigrator,
  PersistenceError,
  SocialProfileMigrator,
  SocialGroupProfileMigrator,
  RejectedInvitationMigrator,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

import {
  IPersistenceConfigProvider,
  IPersistenceConfigProviderType,
} from "@persistence/IPersistenceConfigProvider.js";
import { IVolatileStorageSchemaProvider } from "@persistence/volatile/IVolatileStorageSchemaProvider.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

@injectable()
export class VolatileStorageSchemaProvider
  implements IVolatileStorageSchemaProvider
{
  public constructor(
    @inject(IPersistenceConfigProviderType)
    protected configProvider: IPersistenceConfigProvider,
  ) {}

  public getCurrentVersionForTable(
    tableName: ERecordKey,
  ): ResultAsync<number, PersistenceError> {
    return this.getVolatileStorageSchema().andThen((schema) => {
      const volatileTableIndex = schema.get(tableName);
      if (volatileTableIndex == null) {
        return errAsync(
          new PersistenceError("no schema present for table", tableName),
        );
      }
      return okAsync(volatileTableIndex.migrator.getCurrentVersion());
    });
  }

  public getVolatileStorageSchema(): ResultAsync<
    Map<ERecordKey, VolatileTableIndex<VersionedObject>>,
    never
  > {
    return this.configProvider.getConfig().map((config) => {
      return new Map<ERecordKey, VolatileTableIndex<VersionedObject>>([
        [
          ERecordKey.ACCOUNT,
          new VolatileTableIndex(
            ERecordKey.ACCOUNT,
            "sourceAccountAddress",
            false,
            new LinkedAccountMigrator(),
            EBackupPriority.HIGH,
            config.dataWalletBackupIntervalMS,
            0, // auto push
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
            EBackupPriority.DISABLED,
            config.dataWalletBackupIntervalMS,
            config.backupChunkSizeTarget,
            [
              ["timestamp", false],
              ["chainId", false],
              ["value", false],
              ["to", false],
              ["from", false],
              ["measurementDate", false],
            ],
          ),
        ],
        [
          ERecordKey.SITE_VISITS,
          new VolatileTableIndex(
            ERecordKey.SITE_VISITS,
            "id", // This was previously the "DEFAULT_KEY" (which was "id"), but that's not a valid key.
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
        ],
        [
          ERecordKey.CLICKS,
          new VolatileTableIndex(
            ERecordKey.CLICKS,
            "TODO",
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
        ],
        [
          ERecordKey.REJECTED_INVITATIONS,
          new VolatileTableIndex(
            ERecordKey.REJECTED_INVITATIONS,
            "consentContractAddress",
            false,
            new RejectedInvitationMigrator(),
            EBackupPriority.NORMAL,
            config.dataWalletBackupIntervalMS,
            config.backupChunkSizeTarget,
          ),
        ],
        [
          ERecordKey.EARNED_REWARDS,
          new VolatileTableIndex(
            ERecordKey.EARNED_REWARDS,
            ["queryCID", "name", "contractAddress", "chainId"],
            false,
            new EarnedRewardMigrator(),
            EBackupPriority.NORMAL,
            0, // instant push
            config.backupChunkSizeTarget,
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
            config.dataWalletBackupIntervalMS,
            config.backupChunkSizeTarget,
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
            config.dataWalletBackupIntervalMS,
            config.backupChunkSizeTarget,
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
            config.dataWalletBackupIntervalMS,
            config.backupChunkSizeTarget,
            undefined,
          ),
        ],
        [
          ERecordKey.RESTORED_BACKUPS,
          new VolatileTableIndex(
            ERecordKey.RESTORED_BACKUPS,
            "id",
            false,
            new RestoredBackupMigrator(),
            EBackupPriority.DISABLED,
            config.dataWalletBackupIntervalMS,
            config.backupChunkSizeTarget,
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
            config.dataWalletBackupIntervalMS,
            config.backupChunkSizeTarget,
          ),
        ],
        [
          ERecordKey.QUERY_STATUS,
          new VolatileTableIndex(
            ERecordKey.QUERY_STATUS,
            "queryCID",
            false,
            new QueryStatusMigrator(),
            EBackupPriority.HIGH,
            config.dataWalletBackupIntervalMS,
            config.backupChunkSizeTarget,
          ),
        ],
        [
          ERecordKey.DOMAIN_CREDENTIALS,
          new VolatileTableIndex(
            ERecordKey.DOMAIN_CREDENTIALS,
            "domain",
            false,
            new DomainCredentialMigrator(),
            EBackupPriority.NORMAL,
            config.dataWalletBackupIntervalMS,
            config.backupChunkSizeTarget,
          ),
        ],
        [
          ERecordKey.SOCIAL_PROFILE,
          new VolatileTableIndex(
            ERecordKey.SOCIAL_PROFILE,
            "pKey",
            false,
            new SocialProfileMigrator(),
            EBackupPriority.NORMAL,
            0,
            config.backupChunkSizeTarget,
            [["type", false]],
          ),
        ],
        [
          ERecordKey.SOCIAL_GROUP,
          new VolatileTableIndex(
            ERecordKey.SOCIAL_GROUP,
            "pKey",
            false,
            new SocialGroupProfileMigrator(),
            EBackupPriority.NORMAL,
            config.dataWalletBackupIntervalMS,
            config.backupChunkSizeTarget,
            [
              ["type", false],
              ["ownerId", false],
            ],
          ),
        ],
      ]);
    });
  }
}
