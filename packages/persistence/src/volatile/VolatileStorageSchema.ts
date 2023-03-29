import {
  AdSignatureMigrator,
  ChainTransactionMigrator,
  ClickDataMigrator,
  DomainCredentialMigrator,
  EarnedRewardMigrator,
  EligibleAdMigrator,
  LatestBlockMigrator,
  LinkedAccountMigrator,
  QueryStatusMigrator,
  ReceivingAccountMigrator,
  RestoredBackupMigrator,
  SiteVisitMigrator,
  TokenInfoMigrator,
} from "@snickerdoodlelabs/objects";

import { ERecordKey } from "@persistence/ELocalStorageKey.js";
import { VolatileTableIndex } from "@persistence/volatile/VolatileTableIndex.js";

export const volatileStorageSchema = [
  new VolatileTableIndex(
    ERecordKey.ACCOUNT,
    "sourceAccountAddress",
    false,
    new LinkedAccountMigrator(),
    [["sourceChain", false]],
  ),
  new VolatileTableIndex(
    ERecordKey.TRANSACTIONS,
    "hash",
    false,
    new ChainTransactionMigrator(),
    [
      ["timestamp", false],
      ["chainId", false],
      ["value", false],
      ["to", false],
      ["from", false],
    ],
    false, // TODO: Re-enable backups of transactions!
  ),
  new VolatileTableIndex(
    ERecordKey.SITE_VISITS,
    VolatileTableIndex.DEFAULT_KEY,
    true,
    new SiteVisitMigrator(),
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
  ),
  new VolatileTableIndex(
    ERecordKey.EARNED_REWARDS,
    "queryCID",
    false,
    new EarnedRewardMigrator(),
    [["type", false]],
  ),
  new VolatileTableIndex(
    ERecordKey.ELIGIBLE_ADS,
    ["queryCID", "key"],
    false,
    new EligibleAdMigrator(),
    [["type", false]],
  ),
  new VolatileTableIndex(
    ERecordKey.AD_SIGNATURES,
    ["queryCID", "adKey"],
    false,
    new AdSignatureMigrator(),
    [["type", false]],
  ),
  new VolatileTableIndex(
    ERecordKey.COIN_INFO,
    ["chain", "address"],
    false,
    new TokenInfoMigrator(),
    undefined,
    true,
  ),
  new VolatileTableIndex(
    ERecordKey.RESTORED_BACKUPS,
    VolatileTableIndex.DEFAULT_KEY,
    false,
    new RestoredBackupMigrator(),
    undefined,
    true,
  ),
  new VolatileTableIndex(
    ERecordKey.RECEIVING_ADDRESSES,
    "contractAddress",
    false,
    new ReceivingAccountMigrator(),
  ),
  new VolatileTableIndex(
    ERecordKey.QUERY_STATUS,
    "queryCID",
    false,
    new QueryStatusMigrator(),
  ),
  new VolatileTableIndex(
    ERecordKey.DOMAIN_CREDENTIALS,
    "domain",
    false,
    new DomainCredentialMigrator(),
  ),
];
