import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { CoreConfig } from "@snickerdoodlelabs/core/dist/interfaces/objects";
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
  requestForDataCheckingFrequency: 60000,
  accountIndexingPollingIntervalMS: 60000,
  accountBalancePollingIntervalMS: 60000,
  accountNFTPollingIntervalMS: 60000,
  dataWalletBackupIntervalMS: 60000,
  heartbeatIntervalMS: 60000,
  covalentApiKey: "ckey_ee277e2a0e9542838cf30325665",
  moralisApiKey:
    "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag",
  nftScanApiKey: "lusr87vNmTtHGMmktlFyi4Nt",
  poapApiKey:
    "wInY1o7pH1yAGBYKcbz0HUIXVHv2gjNTg4v7OQ70hykVdgKlXU3g7GGaajmEarYIX4jxCwm55Oim7kYZeML6wfLJAsm7MzdvlH1k0mKFpTRLXX1AXDIwVQer51SMeuQm",
  etherscanApiKeys: new Map([
    [ChainId(1), "6GCDQU7XSS8TW95M9H5RQ6SS4BZS1PY8B7"],
    // [ChainId(5), "6GCDQU7XSS8TW95M9H5RQ6SS4BZS1PY8B7"],
    [ChainId(137), "G4XTF3MERFUKFNGANGVY6DTMX1WKAD6V4G"],
    //[ChainId(80001), "G4XTF3MERFUKFNGANGVY6DTMX1WKAD6V4G"],
    [ChainId(43114), "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1"],
    //[ChainId(43113), "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1"],
    //[ChainId(100), "J7G8U27J1Y9F88E1E56CNNG2K3H98GF4XE"],
    [ChainId(56), "KRWYKPQ3CDD81RXUM5H5UMWVXPJP4C29AY"],
    [ChainId(1284), "EE9QD4D9TE7S7D6C8WVJW592BGMA4HYH71"],
  ]),
} as IConfigOverrides;