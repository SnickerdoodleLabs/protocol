const envVars = {
  __ENABLE_BACKUP_ENCRYPTION__: "true",
  __REQUEST_FOR_DATA_EVENT_FREQ__: 300000,
  __CONTROL_CHAIN_ID__: 43113,
  __ONBOARDING_URL__: "https://datawallet.snickerdoodle.com/",
  __ACCOUNT_COOKIE_URL__: "https://snickerdoodlelabs.io/",
  __SUPPORTED_CHAINS__: "1,43113,43114,137,-1,100,56,1284,42161",
  __IPFS_FETCH_BASE_URL__: "https://ipfs-gateway.snickerdoodle.com/ipfs/",
  __DEFAULT_INSIGHT_PLATFORM_BASE_URL__:
    "https://insight-api.snickerdoodle.com/v0/",
  __CERAMIC_NODE_URL__: "https://ceramic.snickerdoodle.dev/",
  __COVALENT_API_KEY__: "",
  __MORALIS_API_KEY__: "",
  __NFTSCAN_API_KEY__: "",
  __POAP_API_KEY__: "",
  __OKLINK_API_KEY__: "",
  __PORTFOLIO_POLLING_INTERVAL__: "7200000",
  __TRANSACTION_POLLING_INTERVAL__: "21600000",
  __BACKUP_POLLING_INTERVAL__: "21600000",
  __DOMAIN_FILTER__: "(localhost|chrome://)",
  __DNS_SERVER_ADDRESS__: "",
  __GOOGLE_CLOUD_BUCKET__: "prod-qkppf-sdl-dw",
  __PRIMARY_INFURA_KEY__: "a6271a49218848a7ad939ee62d225914",
  __DEV_CHAIN_PROVIDER_URL__: "https://doodlechain.dev.snickerdoodle.dev",
};

for (const key in envVars) {
  process.env[key] = envVars[key];
}
