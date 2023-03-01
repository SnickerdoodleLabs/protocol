import {
  ChainId,
  IConfigOverrides,
  URLString,
} from "@snickerdoodlelabs/objects";

const SIX_HOURS_MS = 21600000;

// These values are the defaults in the config provider
const UNREALISTIC_BUT_WORKING_POLL_INTERVAL = 5000;
const UNREALISTIC_BUT_WORKING_BACKUP_INTERVAL = 10000;

export const coreConfig = {
  controlChainId: ChainId(43113),
  supportedChains: [ChainId(43113), ChainId(1)],
  ipfsFetchBaseUrl: URLString("https://ipfs-gateway.snickerdoodle.com/ipfs/"),
  defaultInsightPlatformBaseUrl: URLString(
    "https://insight-api.snickerdoodle.com/v0/",
  ),
  requestForDataCheckingFrequency: 30000,
  accountIndexingPollingIntervalMS: 25000,
  accountBalancePollingIntervalMS: 20000,
  accountNFTPollingIntervalMS: 18000,
  dataWalletBackupIntervalMS: 15000,
} as IConfigOverrides;
