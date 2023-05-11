const envVars = {
  __REQUEST_FOR_DATA_EVENT_FREQ__: 60000,
  __CONTROL_CHAIN_ID__: 31337,
  __ONBOARDING_URL__: "https://datawallet.dev.snickerdoodle.dev/",
  __ACCOUNT_COOKIE_URL__: "https://snickerdoodlelabs.io/",
  __SUPPORTED_CHAINS__: "80001,43113,1,137,43114,-1,56,1284,100,42161",
  __IPFS_FETCH_BASE_URL__: "https://ipfs-gateway.snickerdoodle.dev/ipfs/",
  __DEFAULT_INSIGHT_PLATFORM_BASE_URL__:
    "https://insight-api.dev.snickerdoodle.dev/v0/",
  __CERAMIC_NODE_URL__: "https://ceramic.snickerdoodle.dev/",
  __COVALENT_API_KEY__: "",
  __MORALIS_API_KEY__: "",
  __NFTSCAN_API_KEY__: "",
  __POAP_API_KEY__: "",
  __OKLINK_API_KEY__: "",
  __PORTFOLIO_POLLING_INTERVAL__: "",
  __TRANSACTION_POLLING_INTERVAL__: "",
  __BACKUP_POLLING_INTERVAL__: "",
  __DOMAIN_FILTER__: "(localhost|chrome://)",
  __DNS_SERVER_ADDRESS__: "",
  __GOOGLE_CLOUD_BUCKET__: "dev-zitrz-sdl-dw",
  __PRIMARY_INFURA_KEY__: "a8ae124ed6aa44bb97a7166cda30f1bc",
  __DEV_CHAIN_PROVIDER_URL__: "https://doodlechain.dev.snickerdoodle.dev",
};

for (const key in envVars) {
  process.env[key] = envVars[key];
}
