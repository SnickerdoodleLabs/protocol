import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { CoreConfig } from "@snickerdoodlelabs/core/dist/interfaces/objects";
import {
  ChainId,
  IConfigOverrides,
  URLString,
  ProviderUrl,
} from "@snickerdoodlelabs/objects";

const SIX_HOURS_MS = 21600000;

// These values are the defaults in the config provider
const UNREALISTIC_BUT_WORKING_POLL_INTERVAL = 5000;
const UNREALISTIC_BUT_WORKING_BACKUP_INTERVAL = 10000;

export const coreConfig = {
  controlChainId: ChainId(43113),
  ipfsFetchBaseUrl: URLString("https://ipfs-gateway.snickerdoodle.com/ipfs/"),
  defaultInsightPlatformBaseUrl: URLString(
    "https://insight-api.snickerdoodle.com/v0/",
  ),
  requestForDataPollingIntervalMS: 60000,
  accountIndexingPollingIntervalMS: 60000,
  accountBalancePollingIntervalMS: 60000,
  accountNFTPollingIntervalMS: 60000,
  dataWalletBackupIntervalMS: 60000,
  heartbeatIntervalMS: 60000,
  alchemyApiKeys: {
    Arbitrum: "_G9cUGHUQqvD2ro5zDaTAFXeaTcNgQiF",
    Astar: "Tk2NcwnHwrmRvzZCkqgSr6fOYIgH7xh7",
    Mumbai: "UA7tIJ6CdCE1351h24CQUE-MNCIV3DSf",
    Optimism: "f3mMgv03KKiX8h-pgOc9ZZyu7F9ECcHG",
    Polygon: "el_YkQK0DMQqqGlgXPO5gm8g6WmpdNfX",
    Solana: "pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
    SolanaTestnet: "Fko-iHgKEnUKTkM1SvnFMFMw1AvTVAtg",
  },
  etherscanApiKeys: {
    Ethereum: "6GCDQU7XSS8TW95M9H5RQ6SS4BZS1PY8B7", //"6GCDQU7XSS8TW95M9H5RQ6SS4BZS1PY8B7",
    Polygon: "G4XTF3MERFUKFNGANGVY6DTMX1WKAD6V4G", //"G4XTF3MERFUKFNGANGVY6DTMX1WKAD6V4G",
    Avalanche: "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1", //"EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1",
    Binance: "KRWYKPQ3CDD81RXUM5H5UMWVXPJP4C29AY", //"KRWYKPQ3CDD81RXUM5H5UMWVXPJP4C29AY",
    Moonbeam: "EE9QD4D9TE7S7D6C8WVJW592BGMA4HYH71", //"EE9QD4D9TE7S7D6C8WVJW592BGMA4HYH71",
    Optimism: "XX9XPVXCBA9VCIQ3YBIZHET5U3BR1DG8B3",
    Arbitrum: "CTJ33WVF49E4UG6EYN6P4KSFC749JPYAFV",
    Gnosis: "J7G8U27J1Y9F88E1E56CNNG2K3H98GF4XE",
    Fuji: "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1",
  },
  spaceAndTimeKeys: {
    PublicKey: "C4ci88fgOy8NuK0xonhFJkJr6tKXKK7gKSFMkV1Hekk=",
    PrivateKey: "a35JJjDhLqFuHWqnbxseTHEU99BFAa3CApIFjbWBQ3E=",
  },
  covalentApiKey: "ckey_ee277e2a0e9542838cf30325665",
  moralisApiKey:
    "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag",
  nftScanApiKey: "lusr87vNmTtHGMmktlFyi4Nt",
  poapApiKey:
    "wInY1o7pH1yAGBYKcbz0HUIXVHv2gjNTg4v7OQ70hykVdgKlXU3g7GGaajmEarYIX4jxCwm55Oim7kYZeML6wfLJAsm7MzdvlH1k0mKFpTRLXX1AXDIwVQer51SMeuQm",
  ankrApiKey:
    "74bbdfc0dea96f85aadde511a4fe8905342c864202f890ece7d0b8d1c60df637",
  bluezApiKey: "aed4aab2cbc573bbf8e7c6b448c916e5",
  raribleApiKey: "c5855db8-08ef-409f-9947-e46c141af1b4",
  blockvisionKey: "2WaEih5fqe8NUavbvaR2PSuVSSp",
  primaryInfuraKey: "7ac88985c1ed458dbd464b2c5245a6e1",
  secondaryInfuraKey: "",
  devChainProviderURL: undefined, //ProviderUrl("https://doodlechain.dev.snickerdoodle.dev"), Must be null for production
  enableBackupEncryption: true,
} as IConfigOverrides;
