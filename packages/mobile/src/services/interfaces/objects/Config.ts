import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { CoreConfig } from "@snickerdoodlelabs/core/dist/interfaces/objects";
import {
  ChainId,
  IConfigOverrides,
  URLString,
  ProviderUrl,
  EChain,
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
  alchemyApiKeys: new Map<EChain, string | null>([
    [EChain.Arbitrum, "Alchemy Arbitrum Key"],
    [EChain.Astar, "Alchemy Astar Key"],
    [EChain.Mumbai, "Alchemy Mumbai Key"],
    [EChain.Optimism, "Alchemy Optimism Key"],
    [EChain.Polygon, "Alchemy Polygon Key"],
    [EChain.Solana, "Alchemy Solana Key"],
    [EChain.SolanaTestnet, "Alchemy Solana Testnet Key"],
  ]),
  etherscanApiKeys: new Map<EChain, string | null>([
    [EChain.EthereumMainnet, "Alchemy Arbitrum Key"],
    [EChain.Polygon, "Alchemy Astar Key"],
    [EChain.Avalanche, "Alchemy Mumbai Key"],
    [EChain.Binance, "Alchemy Optimism Key"],
    [EChain.Moonbeam, "Alchemy Polygon Key"],
    [EChain.Optimism, "Alchemy Solana Key"],
    [EChain.Arbitrum, "Alchemy Solana Testnet Key"],
    [EChain.Gnosis, "Alchemy Solana Testnet Key"],
    [EChain.Fuji, "Alchemy Solana Testnet Key"],
  ]),
  covalentApiKey: "ckey_ee277e2a0e9542838cf30325665",
  moralisApiKey:
    "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag",
  nftScanApiKey: "lusr87vNmTtHGMmktlFyi4Nt",
  poapApiKey:
    "wInY1o7pH1yAGBYKcbz0HUIXVHv2gjNTg4v7OQ70hykVdgKlXU3g7GGaajmEarYIX4jxCwm55Oim7kYZeML6wfLJAsm7MzdvlH1k0mKFpTRLXX1AXDIwVQer51SMeuQm",
  ankrApiKey: "",
  primaryInfuraKey: "7ac88985c1ed458dbd464b2c5245a6e1",
  secondaryInfuraKey: "",
  devChainProviderURL: ProviderUrl("https://doodlechain.dev.snickerdoodle.dev"),
} as IConfigOverrides;
