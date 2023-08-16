const envVars = {
  __ENABLE_BACKUP_ENCRYPTION__: "false",
  __REQUEST_FOR_DATA_EVENT_FREQ__: 60000,
  __CONTROL_CHAIN_ID__: 31337,
  __ONBOARDING_URL__: "https://datawallet.dev.snickerdoodle.dev/",
  __ACCOUNT_COOKIE_URL__: "https://snickerdoodlelabs.io/",
  __SUPPORTED_CHAINS__: "80001,43113,1,137,43114,-1,56,1284,100,42161,592",
  __IPFS_FETCH_BASE_URL__: "https://ipfs-gateway.snickerdoodle.dev/ipfs/",
  __DEFAULT_INSIGHT_PLATFORM_BASE_URL__:
    "https://insight-api.dev.snickerdoodle.dev/v0/",

  __DROPBOX_APP_KEY__: "w69949reoalc9xg",
  __DROPBOX_APP_SECRET__: "78jch5z5o800dyw",
  __DROPBOX_REDIRECT_URI__:
    "https://datawallet.dev.snickerdoodle.dev/settings/storage",

  /* Alchemy Keys */
  __ALCHEMY_ARBITRUM_API_KEY__: "_G9cUGHUQqvD2ro5zDaTAFXeaTcNgQiF",
  __ALCHEMY_ASTAR_API_KEY__: "Tk2NcwnHwrmRvzZCkqgSr6fOYIgH7xh7",
  __ALCHEMY_MUMBAI_API_KEY__: "UA7tIJ6CdCE1351h24CQUE-MNCIV3DSf",
  __ALCHEMY_OPTIMISM_API_KEY__: "f3mMgv03KKiX8h-pgOc9ZZyu7F9ECcHG",
  __ALCHEMY_POLYGON_API_KEY__: "el_YkQK0DMQqqGlgXPO5gm8g6WmpdNfX",
  __ALCHEMY_SOLANA_API_KEY__: "pci9xZCiwGcS1-_jWTzi2Z1LqAA7Ikeg",
  __ALCHEMY_SOLANA_TESTNET_API_KEY__: "Fko-iHgKEnUKTkM1SvnFMFMw1AvTVAtg",

  /* Etherscan Keys */
  __ETHERSCAN_ETHEREUM_API_KEY__: "6GCDQU7XSS8TW95M9H5RQ6SS4BZS1PY8B7",
  __ETHERSCAN_POLYGON_API_KEY__: "G4XTF3MERFUKFNGANGVY6DTMX1WKAD6V4G",
  __ETHERSCAN_AVALANCHE_API_KEY__: "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1",
  __ETHERSCAN_BINANCE_API_KEY__: "KRWYKPQ3CDD81RXUM5H5UMWVXPJP4C29AY",
  __ETHERSCAN_MOONBEAM_API_KEY__: "EE9QD4D9TE7S7D6C8WVJW592BGMA4HYH71",
  __ETHERSCAN_OPTIMISM_API_KEY__: "XX9XPVXCBA9VCIQ3YBIZHET5U3BR1DG8B3",
  __ETHERSCAN_ARBITRUM_API_KEY__: "CTJ33WVF49E4UG6EYN6P4KSFC749JPYAFV",
  __ETHERSCAN_GNOSIS_API_KEY__: "J7G8U27J1Y9F88E1E56CNNG2K3H98GF4XE",
  __ETHERSCAN_FUJI_API_KEY__: "EQ1TUDT41MKJUCBXNDRBCMY4MD5VI9M9G1",

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
  __GOOGLE_CLOUD_BUCKET__: "dev-zitrz-sdl-dw",
  __DEV_CHAIN_PROVIDER_URL__: "https://doodlechain.dev.snickerdoodle.dev",
};

for (const key in envVars) {
  process.env[key] = envVars[key];
}
