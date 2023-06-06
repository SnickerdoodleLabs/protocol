import { EChain } from "@snickerdoodlelabs/objects";

const envVars = {
  __REQUEST_FOR_DATA_EVENT_FREQ__: 60000,
  __CONTROL_CHAIN_ID__: 31337,
  __ONBOARDING_URL__: "https://datawallet.demo-01.snickerdoodle.dev/",
  __ACCOUNT_COOKIE_URL__: "https://snickerdoodlelabs.io/",
  __SUPPORTED_CHAINS__: "80001,43113,1,137,43114,-1,100,56,1284,42161,592",
  __IPFS_FETCH_BASE_URL__: "https://ipfs-gateway.snickerdoodle.dev/ipfs/",
  __DEFAULT_INSIGHT_PLATFORM_BASE_URL__:
    "https://insight-api.demo-01.snickerdoodle.dev/v0/",
  __CERAMIC_NODE_URL__: "https://ceramic.snickerdoodle.dev/",

  /* Alchemy Keys */
  __ALCHEMY_API_KEYS__: new Map([
    [EChain.Arbitrum, "_G9cUGHUQqvD2ro5zDaTAFXeaTcNgQiF"],
    [EChain.Astar, "Tk2NcwnHwrmRvzZCkqgSr6fOYIgH7xh7"],
    [EChain.Mumbai, "UA7tIJ6CdCE1351h24CQUE-MNCIV3DSf"],
    [EChain.Optimism, "f3mMgv03KKiX8h-pgOc9ZZyu7F9ECcHG"],
    [EChain.Polygon, "el_YkQK0DMQqqGlgXPO5gm8g6WmpdNfX"],
    [EChain.Solana, "pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg"],
    [EChain.SolanaTestnet, "Fko-iHgKEnUKTkM1SvnFMFMw1AvTVAtg"],
  ]),

  __ETHERSCAN_API_KEYS__: new Map([
    [EChain.EthereumMainnet, "6GCDQU7XSS8TW95M9H5RQ6SS4BZS1PY8B7"],
    [EChain.Polygon, "G4XTF3MERFUKFNGANGVY6DTMX1WKAD6V4G"],
    [EChain.Avalanche, "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1"],
    [EChain.Binance, "KRWYKPQ3CDD81RXUM5H5UMWVXPJP4C29AY"],
    [EChain.Moonbeam, "EE9QD4D9TE7S7D6C8WVJW592BGMA4HYH71"],
    [EChain.Optimism, "XX9XPVXCBA9VCIQ3YBIZHET5U3BR1DG8B3"],
    [EChain.Arbitrum, "CTJ33WVF49E4UG6EYN6P4KSFC749JPYAFV"],
    [EChain.Gnosis, "J7G8U27J1Y9F88E1E56CNNG2K3H98GF4XE"],
    [EChain.Fuji, "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1"],
  ]),

  __COVALENT_API_KEY__: "ckey_ee277e2a0e9542838cf30325665",
  __MORALIS_API_KEY__:
    "aqy6wZJX3r0XxYP9b8EyInVquukaDuNL9SfVtuNxvPqJrrPon07AvWUmlgOvp5ag",
  __NFTSCAN_API_KEY__: "lusr87vNmTtHGMmktlFyi4Nt",
  __POAP_API_KEY__:
    "wInY1o7pH1yAGBYKcbz0HUIXVHv2gjNTg4v7OQ70hykVdgKlXU3g7GGaajmEarYIX4jxCwm55Oim7kYZeML6wfLJAsm7MzdvlH1k0mKFpTRLXX1AXDIwVQer51SMeuQm",
  __OKLINK_API_KEY__: "700c2f71-a4e2-4a85-b87f-58c8a341d1bf",

  __ANKR_API_KEY__:
    "74bbdfc0dea96f85aadde511a4fe8905342c864202f890ece7d0b8d1c60df637",
  __PRIMARY_INFURA_KEY__: "a8ae124ed6aa44bb97a7166cda30f1bc",
  __SECONDARY_INFURA_KEY__: "",


  __PORTFOLIO_POLLING_INTERVAL__: "",
  __TRANSACTION_POLLING_INTERVAL__: "",
  __BACKUP_POLLING_INTERVAL__: "",
  __DOMAIN_FILTER__: "(localhost|chrome://)",
  __DNS_SERVER_ADDRESS__: "",
  __GOOGLE_CLOUD_BUCKET__: "demo-01-fcszy-sdl-dw",
  __DEV_CHAIN_PROVIDER_URL__: "https://doodlechain.demo-01.snickerdoodle.dev",
};

for (const key in envVars) {
  process.env[key] = envVars[key];
}
