import {
  AdSignatureMigrator,
  ChainTransactionMigrator,
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
  SocialProfileMigrator,
  SocialGroupProfileMigrator,
  RejectedInvitationMigrator,
  WalletNFTDataMigrator,
  WalletNFTHistoryMigrator,
  InvitationForStorageMigrator,
  QuestionnaireMigrator,
  QuestionnaireHistoryMigrator,
  PermissionForStorageMigrator,
} from "@snickerdoodlelabs/objects";

import { IPersistenceConfig } from "@persistence/IPersistenceConfig";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

// This function generates a map of object store configurations for IndexedDB.
// It takes an optional configuration object to customize the settings for each object store.
// We use this method in VolatileStorageSchemaProvider
const testTimeValue = 100000; // for use in indexedDB test
export const getObjectStoreDefinitions = (config?: IPersistenceConfig) => {
  return new Map<ERecordKey, VolatileTableIndex<VersionedObject>>([
    [
      ERecordKey.ACCOUNT,
      new VolatileTableIndex(
        ERecordKey.ACCOUNT,
        ["sourceAccountAddress", false],
        new LinkedAccountMigrator(),
        EBackupPriority.HIGH,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        0, // auto push
        [["sourceChain", false]],
      ),
    ],
    [
      ERecordKey.TRANSACTIONS,
      new VolatileTableIndex(
        ERecordKey.TRANSACTIONS,
        ["hash", false],
        new ChainTransactionMigrator(),
        EBackupPriority.DISABLED,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
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
        [null, true],
        new SiteVisitMigrator(),
        EBackupPriority.NORMAL,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
        [
          ["url", false],
          ["startTime", false],
          ["endTime", false],
        ],
      ),
    ],
    [
      ERecordKey.REJECTED_INVITATIONS,
      new VolatileTableIndex(
        ERecordKey.REJECTED_INVITATIONS,
        ["consentContractAddress", false],
        new RejectedInvitationMigrator(),
        EBackupPriority.NORMAL,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
      ),
    ],
    [
      ERecordKey.EARNED_REWARDS,
      new VolatileTableIndex(
        ERecordKey.EARNED_REWARDS,
        [["queryCID", "name", "type"], false],
        new EarnedRewardMigrator(),
        EBackupPriority.NORMAL,
        0, // instant push
        config?.backupChunkSizeTarget ?? testTimeValue,
        [["type", false]],
      ),
    ],
    [
      ERecordKey.ELIGIBLE_ADS,
      new VolatileTableIndex(
        ERecordKey.ELIGIBLE_ADS,
        [["queryCID", "key"], false],
        new EligibleAdMigrator(),
        EBackupPriority.NORMAL,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
        [["type", false]],
      ),
    ],
    [
      ERecordKey.AD_SIGNATURES,
      new VolatileTableIndex(
        ERecordKey.AD_SIGNATURES,
        [["queryCID", "adKey"], false],
        new AdSignatureMigrator(),
        EBackupPriority.NORMAL,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
        [["type", false]],
      ),
    ],
    [
      ERecordKey.COIN_INFO,
      new VolatileTableIndex(
        ERecordKey.COIN_INFO,
        [["chain", "address"], false],
        new TokenInfoMigrator(),
        EBackupPriority.DISABLED,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
        undefined,
      ),
    ],
    [
      ERecordKey.RESTORED_BACKUPS,
      new VolatileTableIndex(
        ERecordKey.RESTORED_BACKUPS,
        ["id", false],
        new RestoredBackupMigrator(),
        EBackupPriority.DISABLED,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
        undefined,
      ),
    ],
    [
      ERecordKey.RECEIVING_ADDRESSES,
      new VolatileTableIndex(
        ERecordKey.RECEIVING_ADDRESSES,
        ["contractAddress", false],
        new ReceivingAccountMigrator(),
        EBackupPriority.NORMAL,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
      ),
    ],
    [
      ERecordKey.QUERY_STATUS,
      new VolatileTableIndex(
        ERecordKey.QUERY_STATUS,
        ["queryCID", false],
        new QueryStatusMigrator(),
        EBackupPriority.HIGH,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
      ),
    ],
    [
      ERecordKey.DOMAIN_CREDENTIALS,
      new VolatileTableIndex(
        ERecordKey.DOMAIN_CREDENTIALS,
        ["domain", false],
        new DomainCredentialMigrator(),
        EBackupPriority.NORMAL,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
      ),
    ],
    [
      ERecordKey.SOCIAL_PROFILE,
      new VolatileTableIndex(
        ERecordKey.SOCIAL_PROFILE,
        ["pKey", false],
        new SocialProfileMigrator(),
        EBackupPriority.NORMAL,
        0,
        config?.backupChunkSizeTarget ?? testTimeValue,
        [["type", false]],
      ),
    ],
    [
      ERecordKey.SOCIAL_GROUP,
      new VolatileTableIndex(
        ERecordKey.SOCIAL_GROUP,
        ["pKey", false],
        new SocialGroupProfileMigrator(),
        EBackupPriority.NORMAL,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
        [
          ["type", false],
          ["ownerId", false],
        ],
      ),
    ],
    [
      ERecordKey.NFTS,
      new VolatileTableIndex(
        ERecordKey.NFTS,
        ["id", false],
        new WalletNFTDataMigrator(),
        EBackupPriority.DISABLED,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
      ),
    ],
    [
      ERecordKey.NFTS_HISTORY,
      new VolatileTableIndex(
        ERecordKey.NFTS_HISTORY,
        ["id", false],
        new WalletNFTHistoryMigrator(),
        EBackupPriority.DISABLED,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
      ),
    ],
    [
      ERecordKey.OPTED_IN_INVITATIONS,
      new VolatileTableIndex(
        ERecordKey.OPTED_IN_INVITATIONS,
        ["consentContractAddress", false],
        new InvitationForStorageMigrator(),
        EBackupPriority.HIGH,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        0, // auto push
      ),
    ],
    [
      ERecordKey.QUESTIONNAIRES,
      new VolatileTableIndex(
        ERecordKey.QUESTIONNAIRES,
        [["id", "deleted"], false],
        new QuestionnaireMigrator(),
        EBackupPriority.NORMAL,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
      ),
    ],
    [
      ERecordKey.QUESTIONNAIRES_HISTORY,
      new VolatileTableIndex(
        ERecordKey.QUESTIONNAIRES_HISTORY,
        [["id", "measurementDate"], false],
        new QuestionnaireHistoryMigrator(),
        EBackupPriority.NORMAL,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
        [[["deleted", "id", "measurementDate"], false]],
      ),
    ],
    [
      ERecordKey.PERMISSIONS,
      new VolatileTableIndex(
        ERecordKey.PERMISSIONS,
        ["consentContractAddress", false],
        new PermissionForStorageMigrator(),
        EBackupPriority.NORMAL,
        config?.dataWalletBackupIntervalMS ?? testTimeValue,
        config?.backupChunkSizeTarget ?? testTimeValue,
      ),
    ],
  ]);
};
