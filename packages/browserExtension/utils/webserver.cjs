// These values are appropriate for Local environment
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";
process.env.ASSET_PATH = "/";
process.env.__ONBOARDING_URL__ = "https://localhost:9005/";
process.env.__ACCOUNT_COOKIE_URL__ = "https://snickerdoodlelabs.io/";
process.env.__CONTROL_CHAIN_ID__ = "31337";
process.env.__IPFS_FETCH_BASE_URL__ = "http://localhost:8080/ipfs";
process.env.__DEFAULT_INSIGHT_PLATFORM_BASE_URL__ = "http://localhost:3006";

process.env.__DROPBOX_APP_KEY__ = "";
process.env.__DROPBOX_APP_SECRET__ = "";
process.env.__DROPBOX_REDIRECT_URI__ = "";

process.env.__COVALENT_API_KEY__ = "";
process.env.__MORALIS_API_KEY__ = "";
process.env.__NFTSCAN_API_KEY__ = "";
process.env.__POAP_API_KEY__ = "";
process.env.__OKLINK_API_KEY__ = "";
process.env.__ANKR_API_KEY__ = "";
process.env.__BLUEZ_API_KEY__ = "";
process.env.____RARIBILE_API_KEY__ = "";
process.env.__SPACEANDTIME_API_KEY__ = "";
process.env.__BLOCKVISION_API_KEY__ = "";

process.env.__ALCHEMY_ARBITRUM_API_KEY__ = "";
process.env.__ALCHEMY_ASTAR_API_KEY__ = "";
process.env.__ALCHEMY_MUMBAI_API_KEY__ = "";
process.env.__ALCHEMY_OPTIMISM_API_KEY__ = "";
process.env.__ALCHEMY_POLYGON_API_KEY__ = "";
process.env.__ALCHEMY_SOLANA_API_KEY__ = "";
process.env.__ALCHEMY_SOLANA_TESTNET_API_KEY__ = "";

process.env.__ETHERSCAN_ETHEREUM_API_KEY__ = "";
process.env.__ETHERSCAN_POLYGON_API_KEY__ = "";
process.env.__ETHERSCAN_AVALANCHE_API_KEY__ = "";
process.env.__ETHERSCAN_BINANCE_API_KEY__ = "";
process.env.__ETHERSCAN_MOONBEAM_API_KEY__ = "";
process.env.__ETHERSCAN_OPTIMISM_API_KEY__ = "";
process.env.__ETHERSCAN_ARBITRUM_API_KEY__ = "";
process.env.__ETHERSCAN_GNOSIS_API_KEY__ = "";
process.env.__ETHERSCAN_FUJI_API_KEY__ = "";

process.env.__PRIMARY_INFURA_KEY__ = "";
process.env.__SECONDARY_INFURA_KEY__ = "";
process.env.__DNS_SERVER_ADDRESS__ = "http://localhost:3006/dns";
process.env.__REQUEST_FOR_DATA_EVENT_FREQ__ = "4000";
process.env.__DOMAIN_FILTER__ = "(localhost|chrome://)";
process.env.__GOOGLE_CLOUD_BUCKET__ = "ceramic-replacement-bucket";
process.env.__PORTFOLIO_POLLING_INTERVAL__ = "";
process.env.__TRANSACTION_POLLING_INTERVAL__ = "";
process.env.__BACKUP_POLLING_INTERVAL__ = "";
process.env.__ENABLE_BACKUP_ENCRYPTION__ = "";
process.env.__DISCORD_CLIENT_ID__ = "1089994449830027344";
process.env.__DISCORD_CLIENT_KEY__ = "uqIyeAezm9gkqdudoPm9QB-Dec7ZylWQ";
process.env.__DISCORD_POLL_INTERVAL__ = "86400000";
process.env.__TWITTER_CONSUMER_KEY__ = "IksHLFQGjifiBzswDKpdjtyqW";
process.env.__TWITTER_CONSUMER_SECRET__ =
  "y4FOFgQnuRo7vvnRuKqFhBbM3sYWuSZyg5RqHlRIc3DZ4N7Hnx";
process.env.__TWITTER_POLL_INTERVAL__ = "86400000";

process.env.__OPEN_API_KEY__ = "";
process.env.__SCRAPER_TIMEOUT__ = "";

var WebpackDevServer = require("webpack-dev-server"),
  webpack = require("webpack"),
  config = require("../webpack.config.cjs"),
  env = require("./env.cjs"),
  path = require("path");












config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
  config.plugins || [],
);

var compiler = webpack(config);

var server = new WebpackDevServer(
  {
    https: false,
    hot: false,
    client: false,
    host: "localhost",
    port: env.PORT,
    webSocketServer: false,

    static: {
      directory: path.join(__dirname, "../build"),
    },
    devMiddleware: {
      publicPath: `http://localhost:${env.PORT}/`,
      writeToDisk: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    allowedHosts: "all",
  },
  compiler,
);

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept();
}

(async () => {
  await server.start();
})();
