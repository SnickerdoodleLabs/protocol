const envVars = {
  __REQUEST_FOR_DATA_EVENT_FREQ__: 60000,
  __CONTROL_CHAIN_ID__: 31337,
  __ONBOARDING_URL__: "http://localhost:9001/",
  __ACCOUNT_COOKIE_URL__: "https://snickerdoodlelabs.io/",
  __SUPPORTED_CHAINS__: "5,43113,31337,-1,100,56,1284",
  __IPFS_FETCH_BASE_URL__: "http://localhost:8080/ipfs/",
  __DEFAULT_INSIGHT_PLATFORM_BASE_URL__: "http://localhost:3001/v0/",
  __CERAMIC_NODE_URL__: "https://ceramic.snickerdoodle.dev/",
  __COVALENT_API_KEY__: "",
  __MORALIS_API_KEY__: "",
  __NFTSCAN_API_KEY__: "",
  __POAP_API_KEY__: "",
  __OKLINK_API_KEY__: "",
  __ANKR_API_KEY__: "",
  __PRIMARY_INFURA_KEY__: "a8ae124ed6aa44bb97a7166cda30f1bc",
  __SECONDARY_INFURA_KEY__: "",
  __DNS_SERVER_ADDRESS__: "",
  __PORTFOLIO_POLLING_INTERVAL__: "",
  __TRANSACTION_POLLING_INTERVAL__: "",
  __BACKUP_POLLING_INTERVAL__: "",
  __DEV_CHAIN_PROVIDER_URL__: "http://127.0.0.1:8545",
};

for (const key in envVars) {
  process.env[key] = envVars[key];
}
